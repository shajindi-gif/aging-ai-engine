# Vercel 部署指南

## 重要提示
⚠️ 这是一个全新的独立项目。请创建全新的 Vercel Project，**不要**关联到 yance.ai 或任何现有项目。

## 部署步骤

### 1. 推送代码到 GitHub
```bash
git remote add origin https://github.com/your-org/aging-ai-engine.git
git push -u origin main
```

### 2. 在 Vercel 创建新项目
1. 登录 vercel.com
2. 点击 "Add New..." → "Project"
3. Import Git Repository → 选择 aging-ai-engine
4. **Framework Preset: Next.js**
5. Root Directory: `./`（根目录）

### 3. 配置环境变量
在 Vercel 项目 Settings → Environment Variables 中添加：
```
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_APP_NAME=衍策银龄 AI
DATABASE_URL=（后续接入数据库时填写）
API_KEY=（后续接入鉴权时填写）
```

### 4. 部署
- 点击 "Deploy"
- 等待构建完成（约2-3分钟）
- 部署成功后获得 `.vercel.app` 域名

### 5. 验证
- 访问部署URL
- 测试首页、Dashboard、API
- 检查页面加载性能

## 自定义域名
1. Settings → Domains
2. 添加你的域名（如 agingai.cn）
3. 按指引配置DNS
4. 等待SSL证书签发（通常几分钟）

## 注意事项
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`
- Node.js Version: 22.x
