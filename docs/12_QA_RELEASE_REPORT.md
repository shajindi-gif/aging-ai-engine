# 12 — QA 与发布报告（本轮改造）

> 日期：2026-10-19 ｜ 基线 commit：d3a9de2 ｜ 本文对应任务书 20/21/22 章验收

## 实际修改文件（本轮，共 30+）

**安全（新增）**：src/lib/authz/elder-access.ts
**安全（改造）**：src/app/api/elders/route.ts、elders/[id]/route.ts、care-orders/route.ts、care-orders/[id]/route.ts（新）、care-records/route.ts、silvercare/{vitals,mobility,care-tasks,agent,alerts,overview}/route.ts、api/leads/route.ts、api/sales-leads/route.ts、src/middleware.ts（白名单收敛）
**诚实化/文案（16 文件）**：products、agents、institutions、policies、resources/[slug]、city/[slug]、docs（重写去死链）、templates/[slug]、pricing、solutions/[slug]、policy-match、3×tools/layout、首页、mock/{templates,solutions,tools}

## 测试命令与结果（本地隔离环境，合成数据）

| 套件 | 命令 | 结果 |
|---|---|---|
| P0 授权+状态机（新增） | `python3 outputs/test-rbac-e2e.py http://127.0.0.1:3100` | **23/23** |
| 认证回归 | `python3 outputs/test-auth-e2e.py …` | **25/25** |
| 邮箱码即注册 | `python3 outputs/test-email-code-login.py …` | **11/11** |
| 发票闭环（mock 支付） | `python3 outputs/test-invoice-e2e.py …` | **13/13** |
| 构建+类型检查 | `npx next build` | ✓ 53/53 页，无类型错误 |

已知测试环境注：macOS 系统代理例外仅 127.0.0.1，套件 BASE 须用 127.0.0.1；连跑多套需放宽 RL_REGISTER_IP。

## 未完成任务清单（可复现，按优先级）

| # | 事项 | 章 | 级别 |
|---|---|---|---|
| 1 | 部署本轮改造到生产并跑生产验收（需授权；回滚=tag 镜像） | — | P0 流程 |
| 2 | 生产库清理 seed 假 sourceUrl（改为 NULL+UI 已兜底）与 demo 弱口令账户处置 | 04/15 | P0 |
| 3 | /api/agent、/api/agents/* 加限流或登录墙（LLM 成本） | 11 | P1 |
| 4 | CareOrder/care-tasks 变更记录 operator+时间（操作审计表） | 09 | P1 |
| 5 | CareCircle/ConsentGrant：家属账户绑定邀请+授权撤回 UI | 08 | P2 |
| 6 | 机构组织成员管理 API+多租户隔离（机构版商业化前置） | 15 | P2 |
| 7 | 适老模式开关（大字/高对比/语音朗读）与任务走查 | 07 | P2 |
| 8 | 真实图片素材库 + docs/10 授权清单（Unsplash/Pexels 逐张登记） | 05 | P2 |
| 9 | 政策核验字段（verificationDate/失效监控）+真实政策采集 | 10 | P3 |
| 10 | 首批 20 个案例/指南（来源可查）+内容审核状态机 | 12/13 | P3 |
| 11 | SEO：sitemap 补动态页、generateMetadata、结构化数据 | 18 | P3 |
| 12 | CI：lint/typecheck/回归套件门禁；订单排班冲突检测 | 19/09 | P3 |
| 13 | 竞品对标 docs/03 与 PRD/设计系统等其余 8 份文档 | 21 | 文档 |

## 已知风险（生产发布前必读）

1. 本轮授权收紧后，历史 seed 演示档案 userId 为空 → 非平台角色在列表中将不可见（demo 演示路径改走平台角色或补 owner 字段）。
2. 机构成员（CAREGIVER）依赖 User.organizationId 绑定，当前无管理界面（任务 #6）。
3. 性能未压测；LCP/INP 无真实测量记录，不得对外宣称达标。
