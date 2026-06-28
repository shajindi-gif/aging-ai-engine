# 衍策银龄 AI — 开发者平台策略

---

## 策略定位

参考 Replit（开发者友好）、Cursor（Agent 工具链）、OpenAI Platform（API 生态）模式，建立养老服务 AI 开发者平台。

## 四大产品

### 1. TypeScript SDK

```
npm install @aging-ai/sdk
```

**命名空间 API 模式**：

| 命名空间 | 方法 |
|----------|------|
| `agingAI.policies` | `.list()` `.get(id)` `.match(input)` |
| `agingAI.elders` | `.list()` `.get(id)` `.create(data)` |
| `agingAI.careOrders` | `.list()` `.create(data)` |
| `agingAI.careRecords` | `.list()` `.create(data)` |
| `agingAI.institutions` | `.list()` `.get(id)` |
| `agingAI.leads` | `.list()` `.create(data)` |
| `agingAI.agents` | `.policyMatch()` `.elderReport()` `.institutionProfile()` `.riskAlert()` `.careSummary()` `.salesFollowup()` |

### 2. REST API

21 个 API 路由，统一 JSON 响应格式：

```json
{
  "success": true,
  "data": { ... },
  "meta": { "total": 40, "page": 1 }
}
```

| 类别 | 路由数 |
|------|--------|
| 政策 | 4 (list, detail, match, subsidy-match) |
| 老人 | 3 (list, detail, create) |
| 订单/记录 | 4 (orders list/create, records list/create) |
| 机构 | 3 (list, detail, health-records) |
| 线索 | 3 (list, create, alias) |
| Agent | 7 (generic + 6 specific) |
| 健康检查 | 1 |

### 3. MCP Server

12 个 AI 工具，stdio 传输，可集成 Claude Desktop / Cursor：

| 工具 | 功能 |
|------|------|
| search_aging_policy | 搜索养老政策 |
| match_elder_subsidy | 匹配老人补贴 |
| summarize_policy | 政策摘要 |
| generate_application_materials | 生成申请材料 |
| search_aging_institution | 搜索养老机构 |
| profile_aging_institution | 机构画像 |
| create_care_record | 创建服务记录 |
| generate_elder_family_report | 生成家属报告 |
| detect_elder_risk | 风险检测 |
| generate_care_service_summary | 服务总结 |
| generate_sales_followup_plan | 销售跟进 |
| search_silver_economy_leads | 银发经济线索 |

### 4. Chrome 插件

Manifest V3，Web Clipper 功能：

| 场景 | 功能 |
|------|------|
| 政策网页 | 一键提取标题/摘要/地区/部门/补贴类型 |
| 养老机构网页 | 一键提取名称/地址/类型/联系方式 → 生成销售线索 |
| 政府公告 | 一键提取补贴条件/申请流程 |
| 医院/社区信息 | 一键归档到老人服务档案 |

## 示例代码

```typescript
// 查询上海养老政策
const policies = await agingAI.policies.list({ region: '上海' });

// 匹配养老补贴
const result = await agingAI.agents.policyMatch({
  region: '上海', age: 78,
  livingStatus: 'alone', careLevel: 'semi_dependent',
});

// 生成家属报告
const report = await agingAI.agents.elderReport('elder-001');

// 创建护理记录
await agingAI.careRecords.create({
  careOrderId: 'order-001', elderId: 'elder-001',
  recordType: 'vital_check', content: '血压 130/85mmHg',
});

// 查询机构线索
const institutions = await agingAI.institutions.list({
  region: '上海', institutionType: 'nursing_home',
});
```

## 开发者获客路径

```
发现（GitHub/HN/社区）
→ /developers 阅读文档
→ npm install SDK
→ 运行示例代码
→ 申请 API Key（免费额度）
→ 集成到产品
→ 达到免费额度
→ 升级付费 API
```

## Webhook 规划（P1）

| 事件 | 触发条件 | 推送内容 |
|------|----------|----------|
| risk_event | 风险事件发生 | 老人ID/风险类型/等级 |
| order_status_change | 订单状态变更 | 订单ID/新状态 |
| policy_update | 政策更新 | 政策ID/变更摘要 |
| report_ready | 报告生成完成 | 报告ID/下载链接 |

## 扩展计划

- API 速率限制和配额管理
- API Key 管理后台
- 用量统计和计费
- Webhook 管理
- 更多 SDK 语言（Python, Go）
- API Playground（在线试用）
