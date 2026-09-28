# 服务器部署指南（124.221.229.12 · 与 fengyuxueye.com.cn 同机）

> 目标：把衍策银龄 AI（Next.js 16 standalone）部署到自有服务器，由 nginx 反代 443。
> 支付宝异步通知要求公网 HTTPS 域名可达，部署完成后用最终域名配置 `ALIPAY_NOTIFY_URL_BASE`。

## 一、服务器侧前置（一次性）

```bash
# 1) Node 22（若无）
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs
# 2) pm2 进程守护
sudo npm i -g pm2
# 3) nginx 站点配置见下；证书用 certbot 或复用现有通配符证书
sudo certbot --nginx -d <你的域名>
```

## 二、构建与上传

本机执行（构建产物不含密钥）：

```bash
npm ci && npx prisma generate
npm run build            # 或 NEXT_OUTPUT=standalone 模式
rsync -avz --exclude node_modules --exclude .next/cache \
  ./ user@124.221.229.12:/srv/yanglaoai/
```

## 三、服务器上启动

```bash
cd /srv/yanglaoai && npm ci --omit=dev && npx prisma generate
pm2 start npm --name yanglaoai -- start   # 监听 3000
pm2 save && pm2 startup
```

生产环境变量写入 `/srv/yanglaoai/.env.production`（`pm2 start npm -- start` 会读取 `.env`；或用 `pm2 start ecosystem.config.js` 注入）。必需项见 `.env.example`：

- `DATABASE_URL`（Neon）
- `NEXTAUTH_SECRET` / `NEXTAUTH_URL=https://<域名>` / `AUTH_TRUST_HOST=true`
- `NEXT_PUBLIC_SITE_URL=https://<域名>`
- 支付宝四件套：`ALIPAY_APP_ID / ALIPAY_PRIVATE_KEY / ALIPAY_PUBLIC_KEY / ALIPAY_GATEWAY / ALIPAY_NOTIFY_URL_BASE`

## 四、nginx 反代（追加 server 块）

```nginx
server {
  listen 443 ssl http2;
  server_name <你的域名>;
  ssl_certificate     /etc/letsencrypt/live/<域名>/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/<域名>/privkey.pem;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
  # 支付宝异步通知：不限 body、不加缓存
  location /api/pay/notify/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

## 五、支付宝上线核对单

1. 开放平台应用签约「电脑网站支付」；`ALIPAY_APP_ID` 填入。
2. 接口加签方式选**公钥模式**：`ALIPAY_PRIVATE_KEY`=应用私钥(PKCS8)，`ALIPAY_PUBLIC_KEY`=**支付宝公钥**。
3. `ALIPAY_GATEWAY`：生产 `https://openapi.alipay.com/gateway.do`；沙箱调试用 `https://openapi-sandbox.dl.alipaydev.com/gateway.do`。
4. `ALIPAY_NOTIFY_URL_BASE` = 对外 HTTPS 域名（回调 `POST /api/pay/notify/alipay` 必须公网可达）。
5. 小额真实支付 1 笔验证：支付 → 收到通知 → 订单 PAID → 权益生成 → 对账记录。
6. 退款走支付宝后台或后续接入 `alipay.trade.refund`。

## 六、域名说明（重要）

- 当前 `yanglaoai999.com` 托管在 Vercel。若整体迁到本服务器：在阿里云把 A 记录改指 `124.221.229.12`，并保留 Vercel 项目（可随时切回）。
- 若只是把「健康OS/支付」放本服务器：用子域名（如 `app.yanglaoai999.com`）A 记录指 124.221.229.12，主站继续走 Vercel。
- 无论哪种，`ALIPAY_NOTIFY_URL_BASE` 必须是最终对外域名。

## 七、验证清单（部署后）

- [ ] `curl -I https://<域名>/` 200
- [ ] 注册/登录可用（NextAuth 回调域名正确）
- [ ] `/api/policies` 200（数据库连通）
- [ ] 定价页 → 专业版「在线购买」→ 收银台 → 支付宝收银台可打开
- [ ] 支付后 `/checkout/[orderNo]` 显示支付成功；数据库 `Order.status=PAID` 且 `Entitlement` 生成
- [ ] 重放同一条通知 → `PaymentNotifyLog.result=duplicate`
