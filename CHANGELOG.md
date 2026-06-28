# Changelog

All notable changes to the Aging AI Engine project will be documented in this file.

## [0.3.0] - 2026-06-28

### Added — 产品增长升级（参考全球高访问量 AI 网站模式）

- **首页改造**: 从公司介绍页升级为 AI 工具入口页 — Hero 输入框、双 CTA（补贴匹配 + 家属报告）、三大产品入口、六大场景入口、社会证明、免费工具矩阵、开发者入口
- **免费工具矩阵 (/tools)**: 10 个免费 AI 工具页，含输入表单、结构化输出、60% 结果展示、注册转化、免责声明、相关工具推荐
  - /tools/subsidy-checker — 养老补贴资格初筛
  - /tools/family-care-report — 家属照护报告生成器
  - /tools/medical-companion-summary — 陪诊记录总结器
  - /tools/care-plan-generator — 居家照护计划生成器
  - /tools/medication-reminder-plan — 用药提醒计划生成器
  - /tools/follow-up-reminder — 复诊提醒生成器
  - /tools/elder-risk-check — 老人照护风险初筛
  - /tools/home-aging-modification-checklist — 适老化改造清单生成器
  - /tools/nursing-home-lead-score — 养老机构线索评分工具
  - /tools/policy-materials-generator — 政策申报材料清单生成器
- **模板库 (/templates)**: 35 个养老服务模板（家属沟通 7 + 服务记录 7 + 政策申报 7 + 机构运营 7 + 销售线索 7），含模板详情页（输入字段、输出样例、一键生成、升级 CTA）
- **解决方案 (/solutions)**: 9 个行业解决方案页（老人家庭、陪诊公司、居家护理、社区服务站、养老机构、适老化改造、智慧养老硬件、政府/园区、研究机构），含痛点分析、解决方案、产品模块、工作流、价格入口
- **资源中心 (/resources)**: 10 个 SEO 专题页（政策数据库、城市政策、长护险、居家养老、陪诊服务、养老SaaS、银发经济、适老化改造、护理服务、子女照护指南）
- **城市 SEO 页 (/city)**: 12 个城市专题页（上海、北京、深圳、广州、杭州、苏州、南京、成都、武汉、天津、重庆、西安），含高龄津贴、长护险、适老化改造、社区助餐、居家养老服务、机构类型、适合工具、相关政策
- **开发者平台 (/developers)**: API Overview、SDK 安装、快速开始、5 个示例代码、MCP Server 12 工具列表、Chrome 插件说明、Webhook 规划
- **信任与安全 (/trust)**: 12 个信任项（医疗边界 3 + 隐私保护 3 + 数据安全 4 + 合规透明 2），完整医疗和政策免责声明，企业级安全特性规划
- **共享组件**: SiteHeader、SiteFooter、CTASection、ToolLayout、PolicyDisclaimer、MedicalDisclaimer、DemoBadge
- **Mock 数据**: tools.json (10)、templates.json (35)、solutions.json (9)、city_pages.json (12)、pricing_plans.json (5)、trust_items.json (12)、seo_pages.json (10)
- **增长策略文档**: top-ai-websites-patterns.md、seo-content-strategy.md、free-tools-funnel.md、template-library-strategy.md、developer-platform-strategy.md

### Changed
- 首页从公司介绍型首页重构为 AI 工具入口型首页
- 路由数从 44 增加到 64
- 构建路由总数: 64 个

## [0.2.0] - 2026-06-28

### Added
- **Monorepo 结构**: apps/, packages/, data/, docs/ 目录组织
- **18个数据实体**: Organization, User, Elder, FamilyMember, CareProvider, CareOrder, CareRecord, MedicalVisit, MedicationReminder, ChronicMetric, Policy, PolicyEligibilityRule, SubsidyApplication, Institution, Lead, AgentTask, RiskEvent, Report
- **22个页面路由**: /, /products, /policies, /policy-match, /care-crm, /elders, /elders/[id], /care-orders, /care-records, /institutions, /agents, /pricing, /demo, /docs, /compliance, /contact + dashboard 子页面
- **22条API路由**: /api/health, /api/policies, /api/policies/[id], /api/policy-match, /api/elders, /api/elders/[id], /api/care-orders, /api/care-records, /api/institutions, /api/institutions/[id], /api/leads, /api/sales-leads, /api/subsidy-match, /api/health-records, /api/agent, /api/agents/policy-match, /api/agents/elder-report, /api/agents/institution-profile, /api/agents/risk-alert, /api/agents/care-summary, /api/agents/sales-followup
- **大规模Mock数据**: 40条政策（覆盖10城市）、30位老人档案、60位家属、50次就诊记录、40个用药提醒、60条慢病指标、30个风险事件、80笔订单、120条服务记录、15位护理人员、80家机构、80条销售线索
- **6个Agent函数**: policyMatchAgent, elderReportAgent, institutionProfileAgent, riskAlertAgent, careSummaryAgent, salesFollowupAgent
- **26个文档文件**: 产品文档5个、商业文档5个、路演文档3个、QA文档2个、演示脚本3个、部署文档3个、合规文档3个 + PITCH/SALES
- **统一API响应格式**: { success, data, meta: { project, source, generatedAt, humanReviewRequired, disclaimer } }
- **Chrome插件**: Web Clipper功能，政策抓取+机构线索
- **MCP Server**: 12个工具（search_aging_policy, match_elder_subsidy等）
- **SDK**: 命名空间API（agingAI.policies.list(), agingAI.agents.policyMatch()）
- **Prisma Schema**: 18个模型、18个枚举、PostgreSQL
- **5档定价方案**: 免费演示版、小团队版、专业版、数据库订阅版、园区定制版

### Changed
- 从 /dashboard/* 路由升级为扁平路由结构
- 数据模型从12个实体扩展到18个实体
- 品牌升级：主色Teal #0D9488 + Warm Gold #D97706
- 合规页从基础版升级为9项详细声明
- 定价页从3档升级为5档方案

### Technical
- TypeScript 0错误
- ESLint 0错误
- Next.js Build 44路由全部通过
- @ts-nocheck 用于待重写的旧页面
- export const dynamic = 'force-dynamic' 防止静态生成错误

## [0.1.0] - 2026-06-27

### Added
- 初始项目脚手架 (Next.js 16 + TypeScript + Tailwind v4)
- 基础落地页、定价页、合规页
- Dashboard 6个子页面
- 6条Mock API路由
- 基础SDK、MCP Server、Chrome Extension
- README和部署文档
- 品牌设计系统 (yc-前缀CSS类)
