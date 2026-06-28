# 开发者平台策略

## 概述

参考 Replit / Cursor / OpenAI Platform 的开发者生态，建立养老服务 AI 开发者平台。

## 四大产品

### 1. TypeScript SDK

- 命名空间 API 模式：`agingAI.policies.list()` / `agingAI.agents.policyMatch()`
- 完整 TypeScript 类型定义
- npm 包分发：`@aging-ai/sdk`

### 2. REST API

- 21 个 API 路由
- 统一 JSON 响应格式
- API Key 认证（规划中）
- 速率限制和配额管理（规划中）

### 3. MCP Server

- 12 个 AI 工具
- stdio 传输协议
- 可集成 Claude Desktop / Cursor / 其他 MCP 客户端
- 工具覆盖：政策搜索、补贴匹配、机构画像、风险评估、家属报告、服务总结等

### 4. Chrome 插件

- Manifest V3
- 政策网页一键提取摘要
- 养老机构网页一键生成销售线索
- 政府公告一键提取补贴条件

## 开发者获客路径

```
发现 → 文档阅读 → SDK 安装 → 示例代码 → API 试用 → 集成上线 → 付费
```

## 技术文档规划

- 快速开始指南
- API 参考文档
- SDK 使用指南
- MCP Server 配置
- Chrome 插件说明
- Webhook 规划
- 错误码参考
