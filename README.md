# 衍策银龄 AI

> **AI 驱动的养老服务基础设施**

---

## 项目概述

衍策银龄 AI（Aging AI Engine）是面向中国老龄化社会的 AI 原生养老服务基础设施平台。我们为养老服务提供商、社区养老服务站、养老 SaaS 企业及政府机构提供一站式智能解决方案，涵盖政策数据库、补贴智能匹配、护理 CRM、健康档案管理、销售线索管理和 AI Agent 工作台等核心能力。

平台以 **数据驱动 + AI 赋能** 为核心理念，致力于降低养老服务的信息化门槛，提升服务效率，让每一位老人都能获得精准、有温度的养老服务。

### 目标用户

- **陪诊护理公司** — 订单管理、护理员调度、服务报告自动化
- **社区养老服务站** — 老人档案管理、政策匹配、补贴申领辅助
- **养老 SaaS / 设备企业** — 通过 SDK 和 API 快速集成养老 AI 能力
- **政府 / 民政部门** — 区域养老数据驾驶舱、政策落地追踪
- **老人家属** — 健康摘要、服务报告、政策权益查询

---

## 核心功能

- **政策数据库** — 全国养老政策结构化存储，支持按类别、省份、状态多维检索
- **补贴智能匹配** — AI 根据老人画像自动匹配可申请补贴，输出匹配分数与申请路径
- **护理 CRM** — 陪诊、护理、康复、陪伴等多类型服务订单全生命周期管理
- **健康档案** — 慢性病、用药、就诊记录、风险标记一体化健康画像
- **销售线索管理** — 养老机构数字化成熟度评估与商机挖掘
- **AI Agent 工作台** — 政策匹配、健康摘要、风险评估、服务报告、机构推荐、家属沟通六大智能体
- **SDK / API / MCP** — 开放技术栈，支持第三方快速集成
- **Chrome 扩展** — 浏览器端一键查询养老政策与补贴信息

---

## 系统架构

```
┌──────────────────────────────────────────────────────────────────┐
│                        衍策银龄 AI 平台                          │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────────┐ │
│  │  Landing Page│  │  Pricing    │  │  Compliance              │ │
│  │  (Next.js)   │  │  Page       │  │  Page                    │ │
│  └─────────────┘  └─────────────┘  └──────────────────────────┘ │
│                                                                  │
│  ┌──────────────────── SaaS Dashboard ─────────────────────────┐ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │ │
│  │  │ 概览首页  │ │ 政策数据库│ │ 补贴匹配  │ │ 护理 CRM     │   │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────────────────────┐    │ │
│  │  │ 健康档案  │ │ 销售线索  │ │ AI Agent 工作台          │    │ │
│  │  └──────────┘ └──────────┘ └──────────────────────────┘    │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌──────────────────── API Layer ──────────────────────────────┐ │
│  │  /api/policies    /api/subsidy-match   /api/care-orders     │ │
│  │  /api/health-records  /api/sales-leads  /api/agent          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                  │
├─────────────────── 开放生态层 ────────────────────────────────── │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │ @aging-ai/sdk│  │ MCP Server   │  │ Chrome Extension     │   │
│  │ (TypeScript) │  │ (JSON-RPC)   │  │ (Manifest V3)        │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                  │
├─────────────────── 基础设施层 ────────────────────────────────── │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  PostgreSQL  │  │  Vercel      │  │  第三方 AI 服务       │   │
│  │  (Prisma)    │  │  部署 & CDN  │  │  (LLM / Embedding)  │   │
│  └──────────────┘  └──────────────┘  └──────────────────────┘   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 技术栈

| 层级       | 技术                                          |
| ---------- | --------------------------------------------- |
| 前端框架   | Next.js 16 (App Router, React 19)             |
| 样式系统   | Tailwind CSS v4 + PostCSS                     |
| 语言       | TypeScript 5                                  |
| 图标       | Lucide React                                  |
| 样式工具   | clsx + tailwind-merge                         |
| 数据库 ORM | Prisma (PostgreSQL, 规划中)                    |
| SDK        | @aging-ai/sdk (TypeScript 独立库)              |
| MCP 服务   | @aging-ai/mcp-server (Model Context Protocol)  |
| 浏览器扩展 | Chrome Extension Manifest V3                  |
| 部署平台   | Vercel                                        |

---

## 快速开始

### 环境要求

- Node.js 22+
- npm 10+

### 安装与运行

```bash
# 1. 克隆项目
git clone <repository-url>
cd aging-ai-engine

# 2. 安装依赖
npm install

# 3. 复制环境变量
cp .env.local.example .env.local

# 4. 启动开发服务器
npm run dev

# 5. 打开浏览器访问
open http://localhost:3000
```

### 构建生产版本

```bash
npm run build
npm run start
```

---

## 项目结构

```
aging-ai-engine/
├── src/app/                    # Next.js App Router 页面与 API
│   ├── page.tsx               # 着陆页
│   ├── pricing/page.tsx       # 定价页
│   ├── compliance/page.tsx    # 合规声明页
│   ├── dashboard/             # SaaS 管理后台
│   │   ├── page.tsx           # 概览首页
│   │   ├── policy-database/   # MVP1: 政策数据库
│   │   ├── subsidy-matching/  # MVP1: 补贴智能匹配
│   │   ├── care-crm/          # MVP2: 护理 CRM
│   │   ├── health-records/    # MVP2: 健康档案
│   │   ├── sales-leads/       # MVP3: 销售线索
│   │   └── agent-workbench/   # AI Agent 工作台
│   └── api/                   # RESTful API 路由
│       ├── policies/          # 政策数据 API
│       ├── subsidy-match/     # 补贴匹配 API
│       ├── care-orders/       # 护理订单 API
│       ├── health-records/    # 健康档案 API
│       ├── sales-leads/       # 销售线索 API
│       └── agent/             # AI Agent 统一调度
├── src/lib/
│   ├── types/                 # TypeScript 统一数据模型
│   ├── mock/                  # Mock 数据（开发阶段）
│   ├── agents/                # AI Agent 函数库
│   └── utils/                 # 工具函数
├── src/components/
│   ├── ui/                    # 通用 UI 组件
│   ├── layout/                # 布局组件 (Header, Footer, Sidebar, DashboardLayout)
│   ├── landing/               # 着陆页区块组件
│   └── dashboard/             # Dashboard 业务组件
├── sdk/                       # @aging-ai/sdk — 客户端 SDK
├── mcp-server/                # @aging-ai/mcp-server — MCP 协议服务
├── chrome-extension/          # Chrome 浏览器扩展 (MV3)
├── docs/                      # 项目文档
├── prisma/                    # 数据库 Schema（规划中）
└── public/                    # 静态资源
```

---

## 三大 MVP

### MVP1: 政策数据与补贴匹配引擎

面向养老服务机构的政策情报工具。

- **政策数据库** — 全国 3000+ 养老政策结构化存储，按类别（补贴/保险/服务/住房/医疗/就业/税收）、行政级别（国家/省/市/区）、地区多维分类
- **补贴智能匹配** — 输入老人画像（年龄、地区、护理等级、残疾等级、特殊条件），AI 自动匹配可申请政策，输出匹配分数、申请路径和预估金额
- **商业价值** — 帮助养老机构为服务对象争取政策权益，提升客户粘性和服务附加值

### MVP2: 护理 CRM 与健康档案

面向陪诊护理公司的业务管理系统。

- **护理 CRM** — 陪诊、护理、康复、陪伴、助浴、助餐、保洁等 7 类服务订单全流程管理；支持护理员分配、服务报告提交、家属通知
- **健康档案** — 老人健康画像：慢性病管理、用药记录、就诊历史、跌倒/用药/生命体征/行为/营养/其他 6 类风险标记
- **风险事件追踪** — 服务过程中发现的风险事件记录、处理和闭环管理
- **商业价值** — 替代 Excel 和纸质记录，降低管理成本，提升服务质量

### MVP3: 销售线索与 AI Agent 工作台

面向养老 SaaS 和设备企业的商机引擎。

- **销售线索管理** — 从政策扫描、网络爬取、转介绍、展会、电话拓展 5 大渠道获取养老机构线索；线索状态从 new 到 won/lost 全生命周期跟踪
- **数字化成熟度评估** — 信息系统、数据管理、服务数字化、员工技术采纳、家属参与 5 维度评分（L1-L5）
- **AI Agent 工作台** — 6 大智能体统一调度：政策匹配、健康摘要、服务报告、风险评估、机构推荐、家属沟通报告
- **商业价值** — 精准获客 + AI 赋能，缩短销售周期

---

## API 接口文档

所有 API 支持 CORS 跨域请求，返回 JSON 格式数据。

### 1. `GET /api/policies` — 查询政策列表

**请求参数：**

| 参数       | 类型   | 必填 | 说明                           |
| ---------- | ------ | ---- | ------------------------------ |
| category   | string | 否   | 政策类别（subsidy/insurance/service/housing/medical/employment/tax/other） |
| province   | string | 否   | 省份过滤                       |

**响应示例：**

```json
{
  "data": [
    {
      "id": "pol-001",
      "title": "北京市高龄老年人养老服务补贴",
      "category": "subsidy",
      "level": "municipal",
      "province": "北京",
      "status": "active",
      "summary": "80周岁以上老年人可享受...",
      "eligibility": ["80周岁以上", "北京市户籍"],
      "benefits": "每月500元养老服务补贴券",
      "tags": ["高龄补贴", "养老服务"]
    }
  ],
  "total": 1
}
```

### 2. `POST /api/subsidy-match` — 补贴智能匹配

**请求体：**

```json
{
  "elderlyId": "eld-001",
  "province": "北京",
  "age": 82,
  "careLevel": "semi_dependent",
  "disabilityLevel": "轻度",
  "specialConditions": ["独居"]
}
```

**响应示例：**

```json
{
  "result": {
    "matches": [
      {
        "policyId": "pol-001",
        "policyTitle": "北京市高龄老年人养老服务补贴",
        "matchScore": 0.92,
        "matchReasons": ["年龄82岁符合80周岁以上要求", "北京市户籍"],
        "missingConditions": [],
        "estimatedAmount": "每月500元",
        "applicationPath": ["社区居委会申请", "街道办事处审核", "区民政局审批"],
        "confidence": 0.88
      }
    ],
    "totalMatched": 2
  },
  "confidence": 0.85,
  "sources": ["民政部养老服务政策汇编(2024版)"],
  "disclaimer": "政策匹配结果仅供参考，具体资格以当地主管部门审核为准。"
}
```

### 3. `GET /api/care-orders` / `POST /api/care-orders` — 护理订单

**GET 请求参数：**

| 参数   | 类型   | 必填 | 说明                                   |
| ------ | ------ | ---- | -------------------------------------- |
| status | string | 否   | 状态过滤（pending/confirmed/in_progress/completed/cancelled） |

**GET 响应示例：**

```json
{
  "data": [
    {
      "id": "ord-001",
      "orderNo": "CO-2024-0001",
      "elderlyName": "王淑芬",
      "type": "escort",
      "status": "completed",
      "scheduledAt": "2024-12-01T09:00:00Z",
      "caregiverName": "张护士",
      "location": "朝阳医院",
      "price": 280
    }
  ],
  "total": 1
}
```

**POST 请求体：**

```json
{
  "elderlyId": "eld-001",
  "elderlyName": "王淑芬",
  "type": "escort",
  "scheduledAt": "2025-01-15T09:00:00Z",
  "location": "北京协和医院",
  "notes": "心内科复诊",
  "price": 300
}
```

### 4. `GET /api/health-records` — 健康档案

**请求参数：**

| 参数 | 类型   | 必填 | 说明                   |
| ---- | ------ | ---- | ---------------------- |
| id   | string | 否   | 指定老人 ID 获取单个档案 |

**响应示例（列表）：**

```json
{
  "data": [
    {
      "id": "eld-001",
      "name": "王淑芬",
      "gender": "female",
      "birthDate": "1942-05-12",
      "careLevel": "semi_dependent",
      "healthSummary": {
        "chronicDiseases": ["高血压", "糖尿病"],
        "allergies": ["青霉素"],
        "currentMedications": [
          { "name": "氨氯地平", "dosage": "5mg", "frequency": "每日一次" }
        ],
        "riskFlags": [
          { "type": "fall", "level": "medium", "description": "近6个月有1次跌倒史" }
        ]
      },
      "tags": ["高龄", "独居"]
    }
  ],
  "total": 1
}
```

### 5. `GET /api/sales-leads` / `POST /api/sales-leads` — 销售线索

**GET 请求参数：**

| 参数   | 类型   | 必填 | 说明                                      |
| ------ | ------ | ---- | ----------------------------------------- |
| status | string | 否   | 状态过滤（new/contacted/qualified/proposal/negotiation/won/lost） |

**GET 响应示例：**

```json
{
  "data": [
    {
      "id": "lead-001",
      "institutionName": "幸福晚年养老院",
      "contactName": "刘院长",
      "source": "policy_scan",
      "status": "qualified",
      "priority": "high",
      "estimatedValue": 120000,
      "productInterest": ["护理CRM", "政策数据库"]
    }
  ],
  "total": 1
}
```

### 6. `POST /api/agent` — AI Agent 统一调度

**请求体：**

```json
{
  "type": "policy_match",
  "params": {
    "age": 82,
    "province": "北京",
    "careLevel": "semi_dependent"
  }
}
```

**支持的 Agent 类型：**

| type                  | 说明         |
| --------------------- | ------------ |
| policy_match          | 政策智能匹配 |
| health_summary        | 健康摘要报告 |
| service_report        | 服务报告生成 |
| risk_assessment       | 风险评估     |
| institution_recommend | 机构推荐     |
| family_report         | 家属沟通报告 |

**响应示例：**

```json
{
  "taskId": "task-001",
  "result": { "matches": [...] },
  "confidence": 0.85,
  "sources": ["民政部养老服务政策汇编(2024版)"],
  "disclaimer": "政策匹配结果仅供参考。",
  "requiresHumanReview": false
}
```

---

## SDK 使用

`@aging-ai/sdk` 提供 TypeScript 类型安全的客户端库，方便第三方应用集成。

### 安装

```bash
npm install @aging-ai/sdk
```

### 使用示例

```typescript
import { AgingAIClient } from "@aging-ai/sdk";

const client = new AgingAIClient({
  baseUrl: "https://api.agingengine.ai",
  apiKey: process.env.AGING_AI_API_KEY,
});

// 查询政策
const policies = await client.policies.list({
  category: "subsidy",
  province: "北京",
});

// 补贴匹配
const matchResult = await client.subsidy.match({
  province: "北京",
  age: 82,
  careLevel: "semi_dependent",
});

// 获取健康档案
const healthRecords = await client.healthRecords.list();

// 调用 Agent
const agentResult = await client.agent.execute({
  type: "risk_assessment",
  params: { elderlyId: "eld-001" },
});
```

### 构建 SDK

```bash
npm run build:sdk
```

---

## MCP Server

`@aging-ai/mcp-server` 实现 Model Context Protocol，使 AI 助手（如 Claude Desktop、Cursor 等）可以直接调用养老服务能力。

### 安装

```bash
npm install -g @aging-ai/mcp-server
```

### 配置（Claude Desktop / Cursor）

在 MCP 配置文件中添加：

```json
{
  "mcpServers": {
    "aging-ai": {
      "command": "aging-ai-mcp",
      "args": ["--api-url", "https://api.agingengine.ai"]
    }
  }
}
```

### 提供的工具

| 工具名称              | 说明             |
| --------------------- | ---------------- |
| search_policies       | 搜索养老政策     |
| match_subsidy         | 补贴智能匹配     |
| get_health_record     | 获取健康档案     |
| create_care_order     | 创建护理订单     |
| assess_risk           | 风险评估         |
| recommend_institution | 养老机构推荐     |
| generate_report       | 生成服务/家属报告 |

### 构建 MCP Server

```bash
npm run build:mcp
```

---

## Chrome 扩展

衍策银龄 AI Chrome 扩展提供浏览器端养老政策查询和补贴匹配能力。

### 功能

- **弹出面板（Popup）** — 快速搜索养老政策、查看最新补贴信息
- **侧边栏（Side Panel）** — 完整的政策浏览和补贴匹配工具
- **内容脚本（Content Script）** — 在政府网站页面自动高亮养老政策关键词

### 安装（开发模式）

```bash
# 1. 进入 Chrome 扩展目录
cd chrome-extension

# 2. 打开 Chrome 浏览器
#    访问 chrome://extensions/

# 3. 开启右上角「开发者模式」

# 4. 点击「加载已解压的扩展程序」

# 5. 选择 chrome-extension 目录
```

### 发布到 Chrome Web Store

```bash
# 1. 打包扩展
cd chrome-extension
zip -r ../aging-ai-extension.zip .

# 2. 上传至 Chrome Web Store Developer Dashboard
#    https://chrome.google.com/webstore/devconsole
```

---

## 环境变量

项目使用以下环境变量，详见 `.env.local.example`：

| 变量名                      | 默认值                  | 说明                 |
| --------------------------- | ----------------------- | -------------------- |
| NEXT_PUBLIC_SITE_URL        | http://localhost:3000   | 站点 URL             |
| NEXT_PUBLIC_APP_NAME        | 衍策银龄 AI             | 应用名称             |
| NEXT_PUBLIC_APP_DESCRIPTION | AI驱动的养老服务基础设施 | 应用描述             |
| DATABASE_URL                | —                       | PostgreSQL 连接字符串 |
| API_KEY                     | —                       | API 认证密钥         |
| SUPABASE_URL                | —                       | Supabase URL（规划） |
| SUPABASE_KEY                | —                       | Supabase Key（规划） |

---

## 部署

推荐使用 **Vercel** 部署，详见 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### 快速部署

```bash
# 1. 推送到 GitHub
git push origin main

# 2. 在 Vercel 导入项目（创建新项目，请勿关联 yance.ai）

# 3. 配置环境变量

# 4. 点击 Deploy
```

### 独立域名

本项目需使用独立域名部署（如 agingai.cn、agingengine.ai），**不要**关联到 yance.ai 域名。

---

## 合规声明

- **医疗免责** — 本系统仅用于健康信息整理、服务记录和风险提示，不替代医生诊断、治疗建议或医疗决策。具体诊疗请咨询执业医生。
- **政策参考** — 政策匹配结果仅供参考，具体资格、材料和办理结果以当地主管部门、街道社区或经办机构最终审核为准。
- **数据安全** — 系统严格遵守《个人信息保护法》《数据安全法》等法规，老年人健康信息属于敏感个人数据，需获得明确授权方可收集和使用。

---

## 许可证

**版权所有 (c) 2024-2025 上海衍策引擎人工智能科技有限公司**

本项目为专有软件（Proprietary Software），未经书面授权，任何个人或组织不得复制、修改、分发本项目代码。

---

## 联系方式

- **公司** — 上海衍策引擎人工智能科技有限公司
- **品牌** — 衍策银龄 AI / Aging AI Engine
- **网站** — [agingengine.ai](https://agingengine.ai)
- **邮箱** — contact@agingengine.ai
- **地址** — 上海市
