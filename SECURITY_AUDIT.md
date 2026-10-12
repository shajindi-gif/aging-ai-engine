# SECURITY_AUDIT.md — 安全审计报告

> 日期：2026-10-12 ｜ 审计范围：代码仓库 + 服务器 + 依赖

## 一、通过项 ✅

| 项 | 证据 |
|---|---|
| 支付凭证隔离 | 19 项仅存服务器 `.env.production`(600) 与本地 `.env.local`（gitignore；git 暂存 grep 0 命中） |
| PII 接口鉴权 | /api/elders、health-records、sales-leads、dashboard/stats 未登录 401（实测） |
| 支付回调强验签 | 微信公钥模式验签失败 401 拒绝；支付宝 checkNotifySign 失败 400（代码层） |
| 金额防篡改 | 服务端商品目录定价；回调金额与订单比对不符拒绝（amount_mismatch 留痕） |
| 幂等 | PaymentNotifyLog 去重 + 事务（重复通知 duplicate，不重复发权益） |
| SQL 注入 | 全程 Prisma 参数化查询，无拼接 SQL（grep 验证无 $queryRawUnsafe 业务调用） |
| XSS | React 默认转义；无 dangerouslySetInnerHTML 业务使用 |
| 越权 | getOrderWithPayment 强制 userId 匹配；account/admin API 会话+角色校验 |
| 账户安全 | NextAuth JWT 会话；密码 bcrypt（注册链路） |
| 容器隔离 | app 容器仅 expose 3000（不映射公网），DB 在 Neon（无本地端口暴露）；加入既有 bridge 网络 |
| 日志脱敏 | 支付路由日志仅记录错误码/订单号，不输出密钥与用户敏感信息（代码审读） |
| 边缘安全头 | 复用 fengyuxueye 443 模板（HSTS/X-Frame-Options/nosniff 等，证书部署时生效） |

## 二、风险项与处置

| # | 风险 | 等级 | 状态/处置 |
|---|---|---|---|
| 1 | **无 HTTPS**（服务器 80 only） | 🔴 高 | 待证书（用户申领中）；HTTP 阶段不传密码不收款（登录走 NextAuth CSRF，但明文传输不可接受 → 证书是 P0） |
| 2 | 依赖传递漏洞 1 critical 2 moderate | 🟡 中 | npm audit 定位中；非直接依赖，评估升级（P1） |
| 3 | API 无全局限流 | 🟡 中 | contact 接口有 IP 限流；公开只读 API（policies/institutions）无限流 → P2 加 nginx limit_req |
| 4 | CSP 未配置 | 🟡 低-中 | Next.js 内联脚本多，需 nonce 方案；暂靠其他头兜底，P2 |
| 5 | 服务器 SSH 密钥位于 Downloads 明文目录 | 🟡 中 | 建议移至 ~/.ssh 并 chmod 600（用户操作，1 分钟） |
| 6 | 凭证明文备份存在于工作区 payment-assets/ | 🟡 中 | README 建议用后清理；**待用户决定**（我不擅自删） |
| 7 | ICP 备案未取得（服务器在大陆） | 🟡 合规 | 页脚已合规处理（只挂工信部核验链接）；长期需办理（用户） |
| 8 | demo 账号为 OPERATOR 角色（验收用） | 🟢 低 | 验收后建议改回 FAMILY |

## 三、红线确认

- ✅ 无生产凭证入 git
- ✅ 无客户端定价、无前端标记支付成功
- ✅ 无绕过支付获得权益路径（权益仅由服务端事务创建）
- ✅ 不影响同机其他站点（独立容器+独立网络配置，仅追加自己的 conf）
