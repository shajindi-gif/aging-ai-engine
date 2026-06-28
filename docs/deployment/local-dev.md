# 本地开发指南

## 环境要求
- Node.js 22+（推荐使用 nvm 管理）
- npm 10+
- Git

## 快速开始

```bash
# 1. 克隆项目
git clone <repo-url> aging-ai-engine
cd aging-ai-engine

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local 配置必要变量

# 4. 启动开发服务器
npm run dev

# 5. 打开浏览器
open http://localhost:3000
```

## 项目结构
```
aging-ai-engine/
├── src/                    # 源码（Next.js App Router）
│   ├── app/               # 页面和API路由
│   ├── components/        # React组件
│   └── lib/               # 工具函数、类型、Mock数据
├── apps/                   # Monorepo应用
│   ├── chrome-extension/  # Chrome插件
│   └── mcp-server/        # MCP服务
├── packages/               # Monorepo包
│   ├── sdk/               # SDK客户端
│   ├── database/          # 数据模型
│   └── agents/            # Agent函数
├── data/mock/              # Mock数据JSON
├── docs/                   # 文档
└── prisma/                 # 数据库Schema
```

## 常用命令
```bash
npm run dev          # 启动开发服务器
npm run build        # 生产构建
npm run start        # 启动生产服务器
npm run lint         # ESLint检查
npm run build:sdk    # 构建SDK
npm run build:mcp    # 构建MCP Server
```

## 代码规范
- TypeScript严格模式
- Tailwind CSS（不用CSS Modules）
- 组件用yc-前缀
- 中文注释和UI文本
- lucide-react图标

## 开发提示
- 修改类型定义后需重启dev server
- Mock数据修改即时生效
- 使用@ts-nocheck的页面将在后续版本重写
