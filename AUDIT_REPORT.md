# AUDIT REPORT — 衍策银龄 AI (aging-ai-engine) v0.3.0

**审计日期**: 2026-07-18  
**审计范围**: 全部产品资产、后端系统、数据库、商业闭环、部署基础设施  
**审计结论**: 项目处于**前端原型 + Mock API 阶段**，具备完整的 UI 和数据模型设计，但后端全部为模拟数据，无真实数据库连接、无认证、无支付、无 AI/LLM 集成。

---

## 一、总体评估

| 维度 | 状态 | 成熟度 |
|------|------|--------|
| 前端页面 | ✅ 存在 (44 页) | UI 完整，数据全部 Mock |
| API 路由 | ✅ 存在 (17 个) | 结构完整，返回 Mock 数据 |
| Agent 系统 | ✅ 存在 (6+6 个) | 100% Mock，无 LLM 调用 |
| MCP Server | ✅ 存在 (12 工具) | JSON-RPC 可用，工具全为 Stub |
| 数据库 Schema | ✅ 存在 (19 模型) | 设计完整，未连接未使用 |
| 认证系统 | ❌ 缺失 | 无注册/登录/Session |
| 支付系统 | ❌ 缺失 | 无支付提供商/订单/回调 |
| RAG 系统 | ❌ 缺失 | 无向量库/Embedding/检索 |
| LLM 集成 | ❌ 缺失 | 无 API Key/无模型调用 |
| Docker | ❌ 缺失 | 无容器化配置 |
| CI/CD | ❌ 缺失 | 无自动化测试/部署 |

**一句话**: 这是一个**设计精良的 Demo 级原型**，拥有完善的 UI、丰富的 Mock 数据（1200+ 条记录）和完整的数据模型设计，但**不具备真实用户服务能力**。

---

## 二、A. 产品资产审计

### 页面总览

| 分类 | 页面数 | 状态 |
|------|--------|------|
| 首页/营销页 | 10 | COMPLETE（UI 完整，数据 Mock） |
| 核心产品页 | 9 | COMPLETE（Mock 数据展示） |
| Dashboard 子页 | 7 | COMPLETE（Mock 数据展示） |
| 免费工具页 | 11 | MOCK（10 个工具页输出完全相同） |
| 增长/SEO 页 | 10 | COMPLETE/MOCK |

### 关键发现

1. **100% Mock 数据** — 所有页面直接从 `@/lib/mock` 导入数据，无任何页面通过 `fetch()` 调用后端 API
2. **API 路由存在但未被使用** — 17 个 API 路由文件存在但前端零调用
3. **10 个工具页共享相同输出** — 所有 `/tools/*` 详情页使用同一份硬编码模板，无论输入什么
4. **两套导航系统并存** — Legacy `Header.tsx`（9 个链接）和 Growth `SiteHeader.tsx`（6 个链接）覆盖不同页面
5. **Footer.tsx 有 8 个死链接** — `href="#"` 占位
6. **Docs 页面链接 12+ 不存在的子页面** — 将 404
7. **Dashboard 与公共页面重复** — `/care-crm` 与 `/dashboard/care-crm` 内容几乎一致

### 页面状态标记

| 路由 | 用途 | 状态 | API连接 | Mock | 假按钮 |
|------|------|------|---------|------|--------|
| `/` | AI工具入口首页 | COMPLETE | NO | YES | NO |
| `/products` | 产品矩阵 | COMPLETE | NO | NO | NO |
| `/pricing` | 5档定价 | COMPLETE | NO | NO | NO |
| `/contact` | 联系表单 | PARTIAL | NO | NO | YES |
| `/demo` | 演示中心 | COMPLETE | NO | NO | YES |
| `/compliance` | 合规声明 | COMPLETE | NO | NO | NO |
| `/docs` | 文档中心 | PARTIAL | NO | NO | NO |
| `/developers` | 开发者平台 | COMPLETE | NO | NO | YES |
| `/trust` | 信任安全 | COMPLETE | NO | YES | NO |
| `/policies` | 政策库 | COMPLETE | NO | YES | NO |
| `/elders` | 长者档案 | COMPLETE | NO | YES | YES |
| `/elders/[id]` | 长者详情 | COMPLETE | NO | YES | NO |
| `/policy-match` | 补贴匹配 | COMPLETE | NO | YES | YES |
| `/care-crm` | 护理CRM | COMPLETE | NO | YES | YES |
| `/care-records` | 护理记录 | COMPLETE | NO | YES | NO |
| `/care-orders` | 护理工单 | COMPLETE | NO | YES | YES |
| `/agents` | Agent工作台 | COMPLETE | NO | YES | YES |
| `/institutions` | 机构库 | COMPLETE | NO | YES | YES |
| `/dashboard` | 仪表盘首页 | COMPLETE | NO | YES | NO |
| `/dashboard/policy-database` | 政策管理 | COMPLETE | NO | YES | NO |
| `/dashboard/subsidy-matching` | 补贴匹配管理 | COMPLETE | NO | YES | NO |
| `/dashboard/health-records` | 健康档案管理 | COMPLETE | NO | YES | YES |
| `/dashboard/care-crm` | CRM管理 | COMPLETE | NO | YES | YES |
| `/dashboard/sales-leads` | 线索管理 | COMPLETE | NO | YES | YES |
| `/dashboard/agent-workbench` | Agent执行台 | COMPLETE | NO | YES | YES |
| `/tools` | 工具目录 | COMPLETE | NO | YES | NO |
| `/tools/[各工具]` | 10个工具详情 | MOCK | NO | YES | YES |
| `/templates` | 模板库 | COMPLETE | NO | YES | NO |
| `/templates/[slug]` | 模板详情 | MOCK | NO | YES | YES |
| `/solutions` | 方案目录 | COMPLETE | NO | YES | NO |
| `/solutions/[slug]` | 方案详情 | COMPLETE | NO | YES | YES |
| `/resources` | 资源中心 | COMPLETE | NO | YES | NO |
| `/resources/[slug]` | 资源文章 | PARTIAL | NO | YES | NO |
| `/city/[slug]` | 城市SEO页 | COMPLETE | NO | YES | NO |

---

## 三、B. 后端审计

### API 路由 (17个)

全部返回 Mock 数据。无输入验证（无 Zod/Joi），无认证检查。每个路由都有 CORS `Access-Control-Allow-Origin: *`。

| 路由 | 方法 | 数据源 | 验证 | 认证 |
|------|------|--------|------|------|
| `/api/health` | GET | 静态 | NO | NO |
| `/api/policies` | GET | Mock | NO | NO |
| `/api/policies/[id]` | GET | Mock | NO | NO |
| `/api/elders` | GET,POST | Mock | NO | NO |
| `/api/elders/[id]` | GET | Mock | NO | NO |
| `/api/institutions` | GET | Mock | NO | NO |
| `/api/institutions/[id]` | GET | Mock | NO | NO |
| `/api/care-orders` | GET,POST | Mock | NO | NO |
| `/api/care-records` | GET,POST | Mock | NO | NO |
| `/api/health-records` | GET | Mock | NO | NO |
| `/api/leads` | GET,POST | Mock | NO | NO |
| `/api/sales-leads` | GET,POST | Mock | NO | NO |
| `/api/agent` | POST | Mock | NO | NO |
| `/api/policy-match` | POST | Mock | NO | NO |
| `/api/subsidy-match` | POST | Mock | NO | NO |
| `/api/agents/policy-match` | POST | Mock | NO | NO |
| `/api/agents/elder-report` | POST | Mock | NO | NO |
| `/api/agents/institution-profile` | POST | Mock | NO | NO |
| `/api/agents/risk-alert` | POST | Mock | NO | NO |
| `/api/agents/care-summary` | POST | Mock | NO | NO |
| `/api/agents/sales-followup` | POST | Mock | NO | NO |

### Agent 系统 (12个函数, 全部 Mock)

**主版本 (`src/lib/agents/`)**:

| Agent | 输入 | 真实LLM | 工具调用 | DB写入 | 状态 |
|-------|------|---------|----------|--------|------|
| policyMatchAgent | region/age/careLevel等 | ❌ 规则评分 | ❌ | ❌ | MOCK |
| elderReportAgent | elderId | ❌ 模板拼接 | ❌ | ❌ | MOCK |
| institutionProfileAgent | institutionId | ❌ 条件逻辑 | ❌ | ❌ | MOCK |
| riskAlertAgent | elderId | ❌ 模板文本 | ❌ | ❌ | MOCK |
| careSummaryAgent | careOrderId | ❌ 模板文本 | ❌ | ❌ | MOCK |
| salesFollowupAgent | leadId | ❌ 条件逻辑 | ❌ | ❌ | MOCK |

**v1 版本 (`packages/agents/`)**: 6个同名 Agent，全部硬编码输出，未被路由使用。

### MCP Server (12 工具, 全为 Stub)

JSON-RPC stdio 传输层可运行，但 12 个工具全部返回硬编码文本。`create_care_record` 是唯一"功能性"工具（仅回显输入，无持久化）。

### 缺失系统

| 系统 | 状态 |
|------|------|
| RAG (向量库/Embedding/检索) | ❌ MISSING |
| LLM (OpenAI/Anthropic/Qwen) | ❌ MISSING |
| 认证 (注册/登录/JWT) | ❌ MISSING |
| 支付 (支付宝/微信) | ❌ MISSING |
| 文件上传 | ❌ MISSING |
| PDF 生成 | ❌ MISSING |
| 邮件/短信 | ❌ MISSING |
| 队列/Worker | ❌ MISSING |
| 定时任务 | ❌ MISSING |
| 结构化日志 | ❌ MISSING |
| 速率限制 | ❌ MISSING |

---

## 四、C. 数据库审计

### Schema 现状

Prisma schema (`prisma/schema.prisma`): 662 行, 19 个模型, 21 个枚举。

**但**: `prisma` 未列入 `package.json` 依赖，`DATABASE_URL` 为空，无迁移文件，无 seed 脚本，Prisma Client 未生成。

### 必需实体检查

| # | 实体 | Schema 存在 | 有 Mock 数据 | API 使用真实 DB | 状态 |
|---|------|------------|-------------|----------------|------|
| 1 | users (含认证字段) | ⚠️ PARTIAL | ❌ | ❌ | 缺 passwordHash/emailVerified |
| 2 | organizations | ✅ | ❌ | ❌ | Schema only |
| 3 | elderly_profiles | ✅ | ✅ (结构不匹配) | ❌ | 需对齐 |
| 4 | family_members | ✅ | ✅ | ❌ | OK |
| 5 | emergency_contacts | ✅ | ✅ | ❌ | OK |
| 6 | assessments | ❌ | ❌ | ❌ | **需新建** |
| 7 | policies | ✅ | ✅ (枚举不匹配) | ❌ | 需对齐 |
| 8 | policy_chunks (RAG) | ❌ | ❌ | ❌ | **需新建** |
| 9 | care_plans | ❌ | ❌ | ❌ | **需新建** |
| 10 | service_tasks | ❌ | ❌ | ❌ | **需新建** |
| 11 | service_records | ❌ | ✅ | ❌ | **需新建** |
| 12 | agent_runs | ⚠️ PARTIAL (AgentTask) | ❌ | ❌ | 需扩展 |
| 13 | reports | ❌ | ❌ | ❌ | **需新建** |
| 14 | orders (支付订单) | ❌ | ❌ | ❌ | **需新建** |
| 15 | payments | ❌ | ❌ | ❌ | **需新建** |
| 16 | subscriptions | ❌ | ❌ | ❌ | **需新建** |
| 17 | audit_events | ❌ | ❌ | ❌ | **需新建** |
| 18 | entitlements | ❌ | ❌ | ❌ | **需新建** |
| 19 | cases (统一Case) | ❌ | ❌ | ❌ | **需新建** |

**得分: 6/19 存在或部分存在, 13 个完全缺失。**

### Mock → Schema 关键不匹配

- **Elder vs ElderlyProfile**: Mock 用扁平字段 (`birthYear`, `age`, `livingStatus`)，Schema 规范化为多个关联表
- **Policy 枚举不匹配**: Mock 有 `smart_aging`, `training`；Schema 的 `PolicyCategory` 无这些值
- **Institution 枚举不匹配**: Mock 有 `escort_company`, `renovation_vendor`；Schema 的 `InstitutionType` 无
- **CareRecord**: 有 TS 类型 + 250 条 Mock 记录，但 Schema 无对应模型
- **mockCareRecords 在两个文件中重复导出** (`care-orders.ts` 120条 vs `care-records.ts` 130条)

---

## 五、D. 商业闭环审计

| 步骤 | 状态 | 发现 |
|------|------|------|
| 1. 注册 | ❌ MISSING | 无页面、无 Auth 库、Schema 无密码字段 |
| 2. 登录 | ❌ MISSING | 无页面、无 Session/JWT、无 Middleware |
| 3. Dashboard | ⚠️ MOCK | 页面存在但仅渲染 Mock 数据，无认证隔离 |
| 4. 创建老人档案 | ⚠️ MOCK | UI 存在，POST 返回临时数据，不持久化 |
| 5. AI 分析 | ⚠️ MOCK | Agent 工作台 UI 可操作但用 setTimeout + 硬编码 |
| 6. 定价 | ⚠️ PARTIAL | 5 档定价前端完整，但硬编码、无结账 CTA |
| 7. 支付 | ❌ MISSING | 无支付提供商、无订单创建、无回调 |
| 8. 付费墙 | ❌ MISSING | 零访问控制，所有路由/API 完全公开 |
| 9. 报告交付 | ⚠️ MOCK | 内联 Markdown 渲染，无 PDF、无持久化、无下载 |
| 10. Demo 模式 | ⚠️ PARTIAL | Demo 页面有场景链接，无沙盒/重置/支付 |

**商业闭环从第 1 步就断了**。无认证 = 无用户身份 = 无后续任何环节可运行。

---

## 六、E. 部署审计

| 维度 | 状态 | 详情 |
|------|------|------|
| Docker | ❌ MISSING | 无 Dockerfile/docker-compose |
| Vercel 部署 | ✅ EXISTS | 项目已链接，BUILD_ID 有效 |
| 自定义域名 | ⚠️ PLANNED | yanglaoai999.com 已购买并配置 DNS（本次会话中完成） |
| 环境变量 | ✅ PARTIAL | `.env.local.example` 文档完整，无真实配置 |
| 构建/生产 | ✅ COMPLETE | `next build` 成功，64 路由，0 错误 |
| PostgreSQL | ⚠️ PLANNED | Schema 存在但未连接，无 Prisma 依赖 |
| Redis | ❌ MISSING | 无任何引用 |
| 向量数据库 | ❌ MISSING | 无 pgvector/Qdrant |
| 文件存储 | ❌ MISSING | 无 S3/OSS |
| 监控 | ⚠️ PARTIAL | 仅 `/api/health` 基础存活检查 |
| 备份 | ❌ MISSING | 无策略无脚本 |
| 安全 | ⚠️ PARTIAL | CORS `*`，无 CSRF、无速率限制、无认证 |
| CI/CD | ❌ MISSING | 无 GitHub Actions、零测试 |
| Git | ✅ COMPLETE | GitHub 仓库，main 分支，2 次提交 |

---

## 七、可直接复用的资产

| 资产 | 复用方式 |
|------|----------|
| 44 个页面 UI | ✅ 直接保留，改造为真实 API 调用 |
| 17 个 API 路由结构 | ✅ 保留路由签名，替换实现为真实 DB/LLM |
| Prisma 19 模型 | ✅ 作为数据库基础，增量扩展 13 个缺失模型 |
| 15 个 Mock 数据文件 | ✅ 转为 Seed 脚本初始化数据 |
| 6 个 Agent 函数签名 | ✅ 保留接口，替换实现为真实 LLM + RAG |
| MCP Server 传输层 | ✅ 保留 JSON-RPC，重写 12 个工具实现 |
| SDK 客户端 | ✅ 保留，随 API 变更同步更新 |
| Tailwind CSS 主题 | ✅ 直接使用 |
| 组件库 (11 个) | ✅ 直接使用，新增组件扩展 |
| 文档体系 (46 份) | ✅ 作为项目知识库基础 |
| 定价设计 (5 档) | ✅ 提取到数据库 Product/PricingPlan 表 |

---

## 八、必须修复的问题

### 严重 (P0)

1. **无认证系统** — 无注册/登录/Session，整个商业闭环无法启动
2. **无数据库连接** — Prisma 未安装、DATABASE_URL 为空、无迁移
3. **无真实 AI** — 所有 Agent 返回硬编码文本，无 LLM 调用
4. **无 RAG** — 无向量库、无 Embedding、无检索管线
5. **无支付** — 无支付宝/微信商户、无订单模型、无回调

### 重要 (P1)

6. **Mock/Schema 类型不匹配** — Elder/Policy/Institution 枚举值不一致
7. **API 无输入验证** — 无 Zod schema，可注入任意数据
8. **CORS 完全开放** — `*` 需在认证后限制
9. **两套导航系统** — Header vs SiteHeader 需统一
10. **Dashboard 无用户隔离** — 所有访客看到相同数据

### 次要 (P2)

11. **Footer 死链接** — 8 个 `href="#"`
12. **Docs 死页面** — 12+ 不存在的子页面
13. **10 个工具页输出相同** — 需分别实现或标记为 coming soon
14. **mockCareRecords 重复导出** — 清理死代码
15. **无测试** — 零测试文件

---

## 九、必须增量开发的功能

| Phase | 功能 | 优先级 |
|-------|------|--------|
| P0 | 用户认证 (注册/登录/JWT/Session) | P0 |
| P0 | Prisma 安装 + 数据库连接 + 迁移 | P0 |
| P0 | User 模型扩展 (passwordHash, emailVerified) | P0 |
| P0 | LLM Gateway (OpenAI/Qwen 适配) | P0 |
| P1 | RAG 管线 (政策文档 → Chunk → Embed → 检索) | P1 |
| P1 | Agent 重写 (真实 LLM + RAG + 结构化输出) | P1 |
| P1 | Case 状态管理 (统一 Case 模型 + 状态机) | P1 |
| P1 | Mock → DB 迁移 (API 改为读写真实数据库) | P1 |
| P2 | 支付系统 (支付宝/微信 + 回调 + 幂等) | P2 |
| P2 | Entitlement/Paywall (后端鉴权 + 403) | P2 |
| P2 | PDF 报告生成 + 下载 | P2 |
| P2 | Demo 沙盒 + Reset 机制 | P2 |
| P2 | Docker 化部署 | P2 |
| P3 | Safety Agent (幻觉检测 + 医疗越界检查) | P3 |
| P3 | 评估数据集 + 离线评估 + 消融实验 | P3 |
| P3 | CI/CD + 自动化测试 | P3 |

---

## 十、P0/P1/P2 优先级总览

### P0 — 必须先做 (阻塞商业闭环)

1. 安装 Prisma + PostgreSQL，跑通数据库连接
2. 扩展 User 模型 (passwordHash, emailVerified, sessions)
3. 实现注册/登录/Session (NextAuth 或自建 JWT)
4. 扩展 Schema 新增 13 个缺失模型
5. 将 Mock 数据导入 Seed 脚本
6. 安装 LLM SDK (OpenAI/Qwen)，配置 API Key
7. 重写 Agent 为真实 LLM 调用 + 结构化输出

### P1 — 核心能力 (产品可用性)

8. 实现 RAG 管线 (pgvector + 政策文档 Embedding)
9. 实现 Case 状态机和 Orchestrator
10. API 添加 Zod 输入验证
11. API 添加认证中间件
12. 统一导航系统
13. 页面从 Mock 切换到真实 API 调用

### P2 — 商业闭环 (收费能力)

14. 支付系统 (支付宝/微信商户接入)
15. Entitlement/Paywall
16. PDF 报告生成
17. Demo 模式 + Reset
18. Docker 部署配置

### P3 — 工程卓越 (竞赛加分)

19. Safety Agent
20. 评估框架 + 实验
21. CI/CD + 自动化测试
22. 性能优化
23. 监控告警

---

## 十一、风险点

| 风险 | 影响 | 缓解 |
|------|------|------|
| LLM API 不稳定 | Agent 执行失败 | 实现 Retry + Fallback + Cache |
| 支付宝/微信商户审批慢 | 支付无法上线 | 先用 MockPayment，生产环境切换 |
| 政策 RAG 幻觉 | 生成虚假政策信息 | Citation 强制 + Safety Agent |
| 域名实名认证延迟 | 域名被 Hold | 已完成实名，监控状态 |
| Mock/Schema 类型漂移 | 数据迁移出错 | Phase 1 优先对齐类型定义 |
| 竞赛现场 LLM 超时 | Demo 卡住 | 预计算 Fallback 响应 |

---

## 十二、最短上线路径

```
Phase 0 ✅ → 审计完成 (本报告)
    ↓
Phase 1 → 数据库 + 认证 + LLM Gateway (3-5天)
    ↓
Phase 2 → RAG + Agent 重写 + Case 状态 (3-5天)
    ↓
Phase 3 → 支付 + Paywall + PDF (2-3天)
    ↓
Phase 4 → Demo 模式 + Reset + Safety (2天)
    ↓
Phase 5 → Docker + 部署 + 测试 (2天)
    ↓
Phase 6 → 评估 + 文档 + 竞赛准备 (2天)
```

**预计总工期: 14-21 天**（一个开发者全职）

---

## 十三、"现有功能最大化复用方案"

### 直接复用 (无需修改)

- 全部 44 个页面 UI 组件
- Tailwind CSS 主题和样式系统
- 11 个共享组件 (Header/Footer/Sidebar/ToolLayout 等)
- MCP Server JSON-RPC 传输层
- SDK 客户端结构和错误处理
- 46 份文档作为知识基础

### 改造复用 (保留接口，替换实现)

- 17 个 API 路由 → 添加认证 + 验证 + 切换为 DB 读写
- 6 个 Agent 函数签名 → 保留输入/输出 Schema，实现替换为 LLM + RAG
- 12 个 MCP 工具定义 → 保留 tool schema，重写 handler
- Prisma 19 模型 → 作为 DB 基础，增量扩展

### 转换复用 (Mock → Seed)

- 15 个 Mock 数据文件 (115KB) → 转为 `prisma/seed.ts` 初始化数据集
- 5 档定价数据 → 导入 `pricing_plans` 表
- 40 条政策数据 → 作为 RAG 知识库初始语料
- 30 份长者档案 → 作为评估数据集基础

---

*审计完成。等待确认后启动 Phase 1 增量开发。*
