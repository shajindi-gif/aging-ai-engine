# 01 — 代码库全面审计报告

> 日期：2026-10-19 ｜ 仓库：aging-ai-engine main @ d3a9de2 基础 ｜ 方法：双审计代理全量扫描 + 人工复核（只读阶段），随后 P0 修复
> 本轮已实施修复见文末「本轮已修复」；未修复项全部列入 docs/12 任务清单，不谎称完成。

## 1. 资产清单摘要

- 页面 68 个 page.tsx：公开营销/工具页（首页、/tools×11、/policies、/institutions、/pricing、/products、/solutions、/resources、/city、/docs、/demo、legal 四页、/login、/register、/agents）＋ 登录后业务页（/dashboard×6、/family、/elders、/care-crm、/care-orders、/care-records、/policy-match、/checkout、/account×4、/admin×4、/onboarding、/alerts、/care-center）。
- API 56+ route.ts；Prisma 45 model / 24 enum。
- 中间件按 X-Forwarded-Proto 解析会话 Cookie（前轮已修）。
- 测试：无 CI、无 *.test.*；外置回归资产 5 套（outputs/test-auth-e2e.py 25 项、test-email-code-login.py 11 项、test-invoice-e2e.py 13 项、test-invoice-prod.py 15 项、本轮新增 test-rbac-e2e.py 23 项）。

## 2. P0 发现（安全/欺骗性）——本轮全部修复并有测试证据

| # | 发现 | 证据（修复前） | 修复 | 验证 |
|---|---|---|---|---|
| 1 | 老人健康数据无对象级授权：任何登录用户按 ID 可读任意老人的档案/用药/体征/风险/服务记录 | api/elders/[id] 仅判 session；silvercare vitals/alerts/care-tasks/mobility 仅凭 query elderlyId；alerts 不传参返回全库 | 新增 src/lib/authz/elder-access.ts（平台角色全量；其余仅归属 userId 或同机构 organizationId），应用到 elders、care-orders、care-records、silvercare 六组路由；无权统一 404 防枚举 | test-rbac S3–S8（B 读 A 全部资源→404；无参列表不混入他人数据）23/23 |
| 3 | CRM 线索匿名泄露：GET /api/leads 无鉴权返回 100 条线索含机构信息 | api/leads/route.ts:25-41 | GET 收紧为登录+ADMIN/OPERATOR；/api/sales-leads 同步加角色 | S21 匿名→401、S22 普通用户→403 |
| 4 | 订单/任务状态可任意改写且无状态机 | CareOrder 无 PATCH；care-tasks PATCH 任意状态互转 | 新增 /api/care-orders/[id] PATCH 状态机（PENDING→CONFIRMED→IN_PROGRESS→COMPLETED，旁路 CANCELLED，终态不可逆）；care-tasks PATCH 加 ALLOWED_FROM 流转表+归属校验；重复提交幂等 | S12–S16、S18–S20 |
| 5 | 业务数据页在匿名白名单：/care-crm /care-orders /care-records /elders 可匿名打开空壳 | src/middleware.ts publicPaths | 白名单移除，统一 307 登录 | 全站登录回归 25/25 |
| 6 | 假来源链接：种子政策 sourceUrl 为合成 gov.cn 假链接，UI 渲染为可点「原文」 | src/lib/mock/policies.ts:64 | /policies UI：sourceUrl 为空或含 "policy-" 时不渲染假链接，显示「样本条目 · 暂无官方原文链接」；种子数据源头修复列入待办 | 构建通过；UI 判定函数 isRealSourceUrl |
| 7 | /agents 假 AI 执行伪装真实：setTimeout 1.5s 返回预置 JSON 冒充运行结果 | agents/page.tsx:30,55-58 | 页首金色横幅「本页为产品概念演示…非真实 AI 运行结果」+ 每张卡「演示」角标 + mock 数据来源改「示例文案，非真实数据来源」 | 人工复核 |
| 8 | 机构库虚构联系方式无标注（假手机号/联系人以真实形态展示） | prisma/seed.ts:229 数据 + institutions 页 | 页面横幅明示「公开资料与演示样例混合…联系人均为虚构样例」；行内加「示例」标签 | 人工复核 |
| 9 | 未经验证宣传：「覆盖全国200+城市」「已帮助30+机构提升效率60%」等 | products/page.tsx:28-30、mock/templates.ts:84、mock/solutions.ts | 改为真实口径「41 条已核验政策样本、覆盖 10 个地区」；无来源统计删除；「AI自动匹配/一键生成」→「按条件筛选/快速生成」；政策结果加「以主管部门审核为准」限定 | 构建通过 + 全站回归 |

## 3. P0/P1 未修复（诚实清单，见 docs/12 任务清单）

- demo@yanglaoai999.com / demo123456 弱口令后门账户仍在生产（删除需运营确认，列入发布前检查）。
- /api/agent、/api/agents/* 匿名可调 LLM（成本/滥用风险）——待接入 RL 限流或登录墙（涉及演示页转化取舍，需产品决策）。
- Policy 模型无 verificationDate/数据核验状态字段；真实政策爬虫核验流程未建（P4 任务）。
- 无操作者审计字段（订单谁改的状态）；CareOrder 变更日志待建。
- 多租户机构隔离仅有 organizationId 雏形，无组织成员管理 API。
- 无 CI/lint 门禁/单元框架；@ts-nocheck 仍存在于 41 个文件。
- SEO：sitemap 缺 /tools/* 与动态详情页；无 generateMetadata。

## 4. 保留完好（回归证据）

本轮改造后本地全量回归：认证 25/25、邮箱码即注册 11/11、发票 13/13、RBAC/状态机 23/23，构建+类型检查通过（53/53 静态页生成）。生产库零接触（未部署、未动数据）。
