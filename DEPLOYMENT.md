# 衍策银龄 AI — 部署指南

本文档详细说明衍策银龄 AI 平台的完整部署流程，涵盖本地开发、Vercel 生产部署、独立子项目发布和 Chrome 扩展上架。

---

## 目录

- [环境要求](#环境要求)
- [本地开发](#本地开发)
- [环境变量](#环境变量)
- [Vercel 部署](#vercel-部署)
- [自定义域名](#自定义域名)
- [SDK 发布](#sdk-发布)
- [MCP Server 部署](#mcp-server-部署)
- [Chrome 扩展发布](#chrome-扩展发布)
- [监控与日志](#监控与日志)

---

## 环境要求

| 工具         | 最低版本 | 推荐版本 | 说明                         |
| ------------ | -------- | -------- | ---------------------------- |
| Node.js      | 22.0     | 22 LTS   | 运行时环境                   |
| npm          | 10.0     | 10+      | 包管理器                     |
| Git          | 2.40     | 2.40+    | 版本控制                     |
| PostgreSQL   | 15       | 16       | 数据库（生产环境，规划中）    |

---

## 本地开发

### 1. 克隆项目

```bash
git clone <repository-url>
cd aging-ai-engine
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

```bash
cp .env.local.example .env.local
```

编辑 `.env.local` 文件，填入必要的配置值（详见[环境变量](#环境变量)章节）。

### 4. 启动开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 5. 开发命令

| 命令                | 说明                       |
| ------------------- | -------------------------- |
| `npm run dev`       | 启动开发服务器             |
| `npm run build`     | 构建生产版本               |
| `npm run start`     | 启动生产服务器             |
| `npm run lint`      | ESLint 代码检查            |
| `npm run lint:fix`  | ESLint 自动修复            |
| `npm run build:sdk` | 构建 SDK                   |
| `npm run build:mcp` | 构建 MCP Server            |
| `npm run dev:all`   | 启动完整开发环境           |

---

## 环境变量

项目使用以下环境变量，按用途分组：

### 基础配置

| 变量名                      | 默认值                    | 必填 | 说明                           |
| --------------------------- | ------------------------- | ---- | ------------------------------ |
| NEXT_PUBLIC_SITE_URL        | http://localhost:3000     | 是   | 站点公开访问 URL               |
| NEXT_PUBLIC_APP_NAME        | 衍策银龄 AI               | 是   | 应用显示名称                   |
| NEXT_PUBLIC_APP_DESCRIPTION | AI驱动的养老服务基础设施  | 否   | 应用描述（SEO / meta 信息）    |

### 数据库（后续接入）

| 变量名       | 默认值 | 必填 | 说明                                |
| ------------ | ------ | ---- | ----------------------------------- |
| DATABASE_URL | —      | 否   | PostgreSQL 连接字符串               |

示例值：
```
DATABASE_URL=postgresql://user:password@localhost:5432/aging_ai_db?schema=public
```

### API 认证

| 变量名  | 默认值 | 必填 | 说明                            |
| ------- | ------ | ---- | ------------------------------- |
| API_KEY | —      | 否   | API 访问密钥（生产环境必填）    |

### 第三方服务（后续接入）

| 变量名       | 默认值 | 必填 | 说明                      |
| ------------ | ------ | ---- | ------------------------- |
| SUPABASE_URL | —      | 否   | Supabase 项目 URL        |
| SUPABASE_KEY | —      | 否   | Supabase 匿名密钥        |

### 本地环境变量文件

```bash
# .env.local（开发环境，不提交 Git）
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=衍策银龄 AI
NEXT_PUBLIC_APP_DESCRIPTION=AI驱动的养老服务基础设施
DATABASE_URL=
API_KEY=
SUPABASE_URL=
SUPABASE_KEY=
```

> **重要**：`.env.local` 已加入 `.gitignore`，请勿将密钥提交至版本控制。

---

## Vercel 部署

### 前置准备

1. 确保代码已推送至 GitHub 仓库
2. 拥有 Vercel 账号（免费方案即可）

### 部署步骤

#### 第一步：推送代码至 GitHub

```bash
git add .
git commit -m "feat: 项目初始化"
git push origin main
```

#### 第二步：在 Vercel 导入项目

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **Add New → Project**
3. 选择 GitHub 仓库 `aging-ai-engine`
4. **重要**：创建全新项目，**不要**关联到 yance.ai 项目
5. Framework Preset 选择 **Next.js**

#### 第三步：配置环境变量

在项目设置的 **Environment Variables** 中添加：

| 变量名                      | 值（生产环境）                    |
| --------------------------- | --------------------------------- |
| NEXT_PUBLIC_SITE_URL        | https://your-domain.com           |
| NEXT_PUBLIC_APP_NAME        | 衍策银龄 AI                       |
| NEXT_PUBLIC_APP_DESCRIPTION | AI驱动的养老服务基础设施          |
| DATABASE_URL                | postgresql://...                  |
| API_KEY                     | your-production-api-key           |

#### 第四步：部署

点击 **Deploy**，等待构建完成。首次部署通常需要 2-3 分钟。

### 部署验证

部署完成后，Vercel 会提供一个临时域名（如 `aging-ai-engine-xxxx.vercel.app`），访问以下页面验证：

- 着陆页：`https://your-vercel-domain.com/`
- Dashboard：`https://your-vercel-domain.com/dashboard`
- API 健康检查：`https://your-vercel-domain.com/api/policies`

---

## 自定义域名

### 推荐域名方案

| 域名               | 用途                 | 优先级 |
| ------------------ | -------------------- | ------ |
| agingai.cn         | 主站（国内用户）     | 高     |
| agingengine.ai     | 国际站 / 技术品牌    | 高     |
| api.agingengine.ai | API 服务             | 中     |
| docs.agingengine.ai| 文档站               | 低     |

### 域名配置步骤

1. 在 Vercel 项目设置 → **Domains** 中添加自定义域名
2. 按提示在 DNS 服务商处添加 CNAME 记录：
   ```
   agingai.cn      → cname.vercel-dns.com
   api.agingai.cn  → cname.vercel-dns.com
   ```
3. 等待 DNS 生效（通常 5-30 分钟）
4. Vercel 自动配置 SSL 证书

> **重要提示**：本项目为公司独立产品线，务必使用独立域名部署，**不要**关联至 yance.ai 或相关域名。

---

## SDK 发布

`@aging-ai/sdk` 为独立的 TypeScript 客户端库，发布至 npm 供第三方集成。

### 构建

```bash
cd sdk
npm install
npm run build
```

### 发布至 npm

```bash
# 1. 确保已登录 npm
npm login

# 2. 版本号管理
cd sdk
npm version patch  # 或 minor / major

# 3. 发布
npm publish --access public
```

### 版本号规范

遵循 [语义化版本](https://semver.org/zh-CN/)：

- `0.1.x` — 初始开发阶段
- `0.x.0` — 新增功能（可能含破坏性变更）
- `1.0.0` — 首个稳定版本

---

## MCP Server 部署

`@aging-ai/mcp-server` 基于 Model Context Protocol，可部署为本地 CLI 工具或远程服务。

### 构建

```bash
cd mcp-server
npm install
npm run build
```

### 本地使用

```bash
# 全局安装
npm install -g @aging-ai/mcp-server

# 启动
aging-ai-mcp --api-url https://api.agingengine.ai
```

### 发布至 npm

```bash
cd mcp-server
npm version patch
npm publish --access public
```

### 远程部署（可选）

MCP Server 可部署为独立微服务，推荐方案：

- **Railway** — 简单的容器化部署
- **AWS Lambda + API Gateway** — Serverless 方案
- **Vercel Functions** — 与主站统一部署

---

## Chrome 扩展发布

### 开发测试

```bash
cd chrome-extension

# 在 Chrome 中加载
# 1. 访问 chrome://extensions/
# 2. 开启「开发者模式」
# 3. 点击「加载已解压的扩展程序」
# 4. 选择 chrome-extension 目录
```

### 打包

```bash
cd chrome-extension
zip -r ../aging-ai-extension-v0.1.0.zip . -x "src/*" ".*"
```

### 发布至 Chrome Web Store

1. 注册 [Chrome Web Store 开发者账号](https://chrome.google.com/webstore/devconsole)（需一次性支付 $5）
2. 创建新的商品详情
3. 上传 zip 包
4. 填写扩展信息：
   - **名称**：衍策银龄 AI — 养老政策助手
   - **描述**：中国老龄化社会 AI 服务引擎 — 一键查询养老政策、补贴匹配、健康摘要
   - **类别**：生活效率
   - **语言**：中文（简体）
5. 提交审核（通常 1-3 个工作日）

### 扩展更新

每次更新需要：
1. 修改 `manifest.json` 中的 `version`
2. 重新打包并上传
3. 提交审核

---

## 监控与日志

### 推荐监控方案

| 工具                | 用途                 | 优先级 | 说明                           |
| ------------------- | -------------------- | ------ | ------------------------------ |
| Vercel Analytics    | 页面访问 / Web Vitals| 高     | Vercel 内置，零配置            |
| Vercel Logs         | 函数日志 / API 监控  | 高     | 实时查看函数执行日志           |
| Sentry              | 错误追踪             | 高     | 前端 + API 错误捕获与告警     |
| Logtail / Better Stack | 结构化日志        | 中     | 集中式日志收集与查询           |
| Uptime Robot        | 可用性监控           | 中     | API 端点 7x24 可用性检测       |

### 关键指标

- **API 响应时间** — P95 < 2000ms
- **API 可用性** — > 99.5%
- **页面加载时间** — LCP < 2.5s
- **Agent 任务成功率** — > 95%
- **错误率** — < 0.1%

### 告警配置

建议为以下场景配置告警：

1. API 端点连续 3 次健康检查失败
2. 错误率超过 1% 持续 5 分钟
3. Agent 任务失败率超过 5%
4. 数据库连接池使用率超过 80%

---

## 常见问题

### Q: 部署后页面空白？

检查 `NEXT_PUBLIC_SITE_URL` 是否配置正确，该变量需要包含完整的协议和域名。

### Q: API 返回 CORS 错误？

所有 API 路由已配置 `Access-Control-Allow-Origin: *`，如需限制来源域名，请修改各路由的 `corsHeaders`。

### Q: 构建失败？

确保 Node.js 版本 >= 22，并执行 `rm -rf node_modules .next && npm install` 清理重装依赖。

### Q: 如何切换数据库？

当前阶段使用 Mock 数据，后续接入 PostgreSQL 时：
1. 设置 `DATABASE_URL` 环境变量
2. 安装 Prisma 依赖：`npm install @prisma/client`
3. 执行数据库迁移：`npx prisma migrate deploy`
4. 将 API 路由中的 mock 数据替换为 Prisma 查询
