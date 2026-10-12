# PROJECT_AUDIT.md — 衍策银龄 AI（yanglaoai999.com）

> 审计时间：2026-10-12 13:30 ｜ 审计人：技术架构师 / DevOps / 支付集成 / 安全合规（AI 复合角色）
> 基线 Git Commit：`683476a`（main，与 origin 同步）

---

## 1. 现有架构

```
公网 124.221.229.12（腾讯云，Ubuntu 6.8）
  └─ Docker: legal-nginx（边缘，占 80/443，多站点）
       ├─ fengyuxueye.com.cn → fengyuxueye-app:3000
       ├─ legalai86.com.cn   → legal-frontend/backend
       ├─ offerready / yijingguaai（同机其他站点，不得影响）
       └─ yanglaoai999.com   → yanglaoai-app:3000 ← 本项目（HTTP 已通，HTTPS 未配）

yanglaoai-app：Next.js 16.2.9 standalone（node:22-slim，自建镜像）
  ├─ 前端 59 页（App Router, React 19, Tailwind 4）
  ├─ API 41 路由（含支付 7 个）
  ├─ Prisma 5.22 / 44 模型 → Neon PostgreSQL（新加坡，serverless）
  ├─ 认证：NextAuth v5 (JWT + Credentials)
  └─ 支付：微信 APIv3（Native）+ 支付宝（page.pay，alipay-sdk v4）

域名：yanglaoai999.com 仍指向 Vercel（76.76.21.21）——线上流量当前走 Vercel 旧版
```

## 2. 已有能力（验证过的）

| 能力 | 证据 |
|---|---|
| 应用容器生产运行 | Up 19h，近 1h 日志 0 错误，Neon 读写正常 |
| 边缘 HTTP 路由 | Host 头直测 200，`/api/policies` 返回真实数据 |
| 微信 Native 支付（代码层） | 本地真实凭证下单出码 `weixin://wxpay/bizpayurl` ✓；幂等/权益开通 mock 全绿 |
| 支付宝 page.pay（代码层） | 本地 RSA2 签名出真实收银台 URL ✓ |
| 支付回调链 | 验签（微信公钥模式/支付宝 checkNotifySign）→金额校验→幂等→改单→开权益，事务化 |
| 订单/权益模型 | Order(amountFen)/Payment/PaymentNotifyLog/Entitlement（幂等留痕） |
| 双渠道丢单兜底 | status 接口按 provider 主动查单补状态 |
| 合规页面 | /privacy /terms /compliance（P0 轮已如实化） |
| SEO | robots.txt / sitemap.xml / 38 页独立 metadata（在最新代码中） |

## 3. 缺失功能 / 问题清单

| # | 问题 | 风险 | 等级 | 修复 |
|---|---|---|---|---|
| 1 | **DNS 未切换**：域名仍指 Vercel，线上是旧版（无 /privacy、无收银台、robots 404） | 用户看到旧站，新功能全部未对外 | 🔴 P0 | 用户在 DNSPod 改 2 条记录（需人工授权） |
| 2 | **无 HTTPS**：服务器只有 80，回调 `https://...` 不可达 → 支付回调必挂 | 支付闭环无法生产验收 | 🔴 P0 | 腾讯云免费 DV 证书 + 443 配置（证书需用户申领） |
| 3 | **容器无资源限制/健康检查**：Mem=0，无 Healthcheck，无日志轮转配置 | OOM/日志撑爆磁盘风险 | 🟡 P1 | compose 补 mem_limit/healthcheck/logging |
| 4 | **支付真实交易未完成**：mock 通过 ≠ 生产验收（规则 13） | 商业化未闭环 | 🔴 P0 | DNS+HTTPS 后用户扫码做 1 分钱真实验收 |
| 5 | 微信商户后台支付授权目录未加 `https://yanglaoai999.com/` | Native 支付被拒 | 🟡 P0 | 用户在商户平台操作（2 分钟） |
| 6 | 无订单中心/会员中心/个人中心页面 | SaaS 成熟度缺口 | 🟡 P1 | 复用 Entitlement/Order 模型补 3 个页面 |
| 7 | 无管理后台（订单/用户/支付记录管理） | 运营能力缺口 | 🟡 P2 | 复用现有 /admin 入口扩展 |
| 8 | AI 能力为规则引擎模式（LLM key 未配），页面已如实标注 | 非阻断，产品力 | 🟢 P2 | 配 LLM_API_KEY 即启用 |
| 9 | 手机号注册/短信验证码未实现（当前邮箱+密码） | 获客摩擦 | 🟢 P2 | 需短信服务采购决策 |
| 10 | 依赖漏洞：transitive 1 critical 2 moderate（npm audit） | 供应链风险 | 🟡 P1 | 升级受影响传递依赖 |
| 11 | ICP 备案未取得（页脚只挂工信部核验链接，合规） | 域名长期合规 | 🟡 P2 | 用户办理备案（中国大陆服务器需备案才能合规对外） |
| 12 | 服务器非 git 部署（rsync），部署版本靠镜像 CreatedSince 追溯 | 可追溯性弱 | 🟢 P2 | 部署脚本记录 commit → 镜像 label |

## 4. 修复顺序（依赖关系）

```
① 容器加固（资源/健康/日志）      ← 我，立即可做，不依赖任何人
② 证书部署 + 443 配置 + 源站验证  ← 等用户申领证书（DNS 验证型）
③ DNS 切换                        ← 等用户 DNSPod 操作（预检清单已备）
④ 真实支付验收（1分钱×2渠道）     ← 依赖②③，用户扫码
⑤ 订单/会员/个人中心页面          ← 我，与①并行
⑥ 管理后台                        ← 我
⑦ 依赖升级 + 自动化测试 + 文档    ← 我
```

## 5. 需要人工授权的事项（用户操作，无法代办）

| 事项 | 位置 | 耗时 |
|---|---|---|
| A. DNSPod 改解析（@ → 124.221.229.12；www 删 CNAME 建 A 同 IP） | console.cloud.tencent.com → DNSPod | 5 分钟 |
| B. 申请免费 SSL 证书（DNS 自动验证，Nginx 格式） | 控制台 → SSL 证书 | 申领 10 分钟 + 等签发 5-30 分钟 |
| C. 证书文件提供（.pem/.key 放 ~/Downloads） | 本地 | 2 分钟 |
| D. 微信商户平台加支付授权目录 `https://yanglaoai999.com/`（带尾斜杠） | pay.weixin.qq.com（商户号 1117431351） | 2 分钟 |
| E. 真实支付验收扫码（微信+支付宝各 1 分钱） | 收银台页 | 5 分钟 |
| F. ICP 备案（长期合规，非上线阻断项） | 腾讯云备案系统 | 数个工作日 |

## 6. 安全与数据现状

- 生产凭证 19 项仅在服务器 `/opt/yanglaoai/.env.production`（600 权限）与本地 `.env.local`（gitignore 双重确认，git 暂存 0 泄露）
- 凭证备份原件位于 `payment-assets/`（README 建议用后清理——**待用户决定**，我不擅自删）
- PII 接口（health-records/sales-leads/elders）已鉴权 401 ✓；支付回调强验签 ✓；金额服务端定价 ✓
- Neon 免费层自带 PITR 时间线恢复（备份策略记入 OPERATIONS.md）
