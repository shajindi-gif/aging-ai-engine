# AUTH_ACCEPTANCE.md — 用户认证系统升级验收报告

> 日期：2026-10-14 ｜ 版本：`e8943f0`（main，已部署生产）
> 环境：https://yanglaoai999.com（腾讯云 124.221.229.12，Docker `yanglaoai-app`，healthy）

## 1. 改造前后对比

| 能力 | 改造前 | 改造后 |
|---|---|---|
| 登录方式 | 仅邮箱+密码 | 邮箱/手机号+密码、手机号验证码（即验即注册）、邮箱验证码（已有账户） |
| 身份模型 | email/phone 字段即主键 | 统一 User ID + UserIdentity 凭证表（identifier 唯一），两种方式进同一账户 |
| 密码策略 | ≥6 位 | NIST 风格：新密码 ≥15/≤64、无复杂度强制、弱码拦截；历史短密码兼容登录 |
| 找回密码 | 无 | 验证码重置，成功后撤销全部旧会话 |
| 邮箱验证 | 无（emailVerified 恒空） | 验证码验证 + 身份表 verifiedAt 双记录 |
| 会话撤销 | 不可能（JWT 无状态） | authVersion 机制：改密/重置/换绑/退出所有设备 → 旧 JWT 即时 401 |
| 限流 | 无 | 登录(IP/账户)、验证码(IP/标识/全局)、注册、重置 六维，阈值可配 |
| 审计 | 无 | AuthAuditLog（IP/UA 哈希、事件、成败），登录记录可在账户页查看 |
| 注册摩擦 | 姓名必填 | 仅邮箱+密码，姓名选填，注册后自动登录进引导 |
| UI | 通用表单 | 极简 SaaS 风（验证码/密码双 Tab、倒计时、加载态、错误反馈、键盘可达、44px 触控） |

## 2. 修改/新增文件清单（53 文件）

**新增库**：`src/lib/authz/{identifiers,codes,ratelimit,channels,identity,guard,pwd-hint}.ts`
**新增 API**：`/api/auth/{send-code,reset-password,verify-email}`、`/api/account/{security,bind,change-password,logout-all,profile}`、`/api/events`
**改造**：`src/lib/auth.ts`（双 Provider + authVersion）、`/api/auth/register`（重写）、`/login`（重写）、`/register`（重写）、`/login/forgot`、`/verify-email`、`/account/settings`（新）、`Header.tsx`（登录态显示账户入口）、`middleware.ts`（放行 forgot/verify-email）
**数据库**：`prisma/schema.prisma` + `migrations-manual/20261014_auth_upgrade.sql`（+ 同名 `.rollback.sql`）
**配置**：`.env.example`（认证/限流/邮件/短信全量键名）

## 3. 数据库变更（纯增量，历史数据零影响）

- 新表：`UserIdentity`（统一身份）、`AuthVerificationCode`（HMAC 标识哈希 + 码哈希存储，无明文）、`AuthAuditLog`
- User 新增可空列：`authVersion(默认0)/nickname/avatarUrl/lastLoginAt`
- 已应用至 Neon（`prisma db push`，迁移 SQL 已存档）；回滚 = 执行 rollback.sql（DROP 新表 + DROP 新列）

## 4. 测试执行结果

**本地 E2E 集成测试（test-auth-e2e.py）：25/25 全绿**
A 历史邮箱用户登录+身份回填 ✓ ｜ B 新注册/弱密码拒绝/登录/未验证状态 ✓ ｜ C 短信验证码登录（自动注册）/60s 冷却 ✓ ｜ D 错误码拒绝/5 次锁定 ✓ ｜ E 忘记密码→重置→旧密码失效→旧会话撤销 ✓ ｜ F 退出所有设备→会话即时失效 ✓ ｜ G 路由保护/公开页 ✓

**生产验收（https://yanglaoai999.com）：10/10**
历史用户登录 ✓ 新注册 ✓ 退出所有设备 ✓ 旧会话 401 ✓ 未配凭证诚实 502（不假成功）✓ 307+callbackUrl 防开放重定向 ✓ 品牌 v2 首页 ✓ ICP 页脚 ✓

## 5. 安全问题与修复情况

| 风险 | 状态 |
|---|---|
| 登录无限流（暴力/撞库） | ✅ 六维限流 |
| 会话不可撤销 | ✅ authVersion（改密/重置/换绑/登出全设备即时生效） |
| 验证码明文存储/可重放 | ✅ 码哈希+标识 HMAC+单次原子消费+尝试锁定 |
| 账户枚举 | ✅ 登录/重置统一模糊报错（注册 409 保留属行业惯例，可后续改邮件确认制） |
| 开放重定向 | ✅ callbackUrl 白名单（仅站内路径） |
| CSRF | ✅ SameSite Cookie + 敏感接口同源校验 |
| 日志泄敏 | ✅ IP/UA 哈希；验证码/密码/Token 不落日志 |
| 自动合并账户风险 | ✅ 身份冲突拒绝（409），绝不按相同标识合并 |

## 6. 尚未实现（如实）

1. **生产验证码渠道待凭证**：邮件需 `RESEND_API_KEY`（或同类 SMTP），短信需 `SMS_PROVIDER=aliyun|tencent` + 商户密钥。未配置时接口诚实返回 502（已验证），密码登录/注册不受影响。**这是当前唯一的功能性阻塞。**
2. 按设备会话列表与单设备撤销（需 DB Session 改造，P1）
3. 图形验证码/风控渐进验证（当前用限流兜底，P2）
4. Google/GitHub/微信 OAuth、Passkeys、TOTP MFA、企业 SSO（预留 authVersion 与身份表结构，未实现未伪装）
5. 邮件模板为简洁版（品牌色+验证码），未做多模板精修

## 7. 环境变量清单（生产 `.env.production` 需补）

```
AUTH_CODE_SECRET=*** 已生成并注入）
RESEND_API_KEY=      ← 待你提供（邮件验证码/重置信）
SMS_PROVIDER=        ← aliyun 或 tencent（待你提供对应密钥）
（限流/TTL 均有默认值，可调）
```

## 8. 部署与回滚

- 部署：rsync → `docker compose build`（GIT_COMMIT=e8943f0）→ `up --force-recreate` → healthcheck（已执行，容器 healthy）
- 回滚：`docker tag yanglaoai-app:rollback-20261014-1845 yanglaoai-app:latest && docker compose up -d --force-recreate`；数据层回滚执行 `prisma/migrations-manual/20261014_auth_upgrade.rollback.sql`（新表无人使用，可安全延后执行）
- 验证脚本：`outputs/test-auth-e2e.py`（可随时对任意环境重跑）
