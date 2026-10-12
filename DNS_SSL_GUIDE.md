# DNS_SSL_GUIDE.md — 域名切换与 HTTPS 上线指南

> 适用：yanglaoai999.com 从 Vercel 切换至腾讯云服务器 124.221.229.12
> 原则：**源站验证通过后才切 DNS**；所有原记录已备份可回滚。

## 当前 DNS 基线（2026-10-12 实测，切换前请复核）

| 主机记录 | 类型 | 当前值 | 归属 |
|---|---|---|---|
| `@` | A | 76.76.21.21 | Vercel（旧版线上） |
| `www` | CNAME | cname.vercel-dns.com | Vercel |
| TXT `_vercel.yanglaoai999.com` | TXT | vc-domain-verify=… | Vercel 域名验证（**保留不动**，Vercel 回滚依赖） |

## 步骤 A：申领证书（用户操作，DNS 验证型）

1. 腾讯云控制台 → 搜索「SSL 证书」→「我的证书」→ **免费申请**（TrustAsia DV）
2. 域名：`yanglaoai999.com`（可勾选多域名同时覆盖 `www.yanglaoai999.com`；不行就申两张）
3. 验证方式：**DNS 自动验证**（域名在 DNSPod，自动加 TXT，等签发 5-30 分钟）
4. 下载 **Nginx 格式**（.pem + .key），放到本机 `~/Downloads/` 告知文件名

## 步骤 B：证书部署 + 443 配置（我执行）

- 证书上传服务器 → 边缘容器卷 `/etc/letsencrypt/live/yanglaoai999.com/`
- nginx 443 server 块（复用 fengyuxueye 模板：TLS1.2/1.3、HSTS、http→https 301、www→主域 301）
- `nginx -t && nginx -s reload`

## 步骤 C：源站验证（切 DNS 前，必须全绿）

```bash
# 用 --resolve 模拟域名指向新服务器（不依赖公网 DNS）
for p in / /login /register /pricing /privacy /terms "/checkout/new?product=pro-monthly" /robots.txt /sitemap.xml /api/health "/api/policies?pageSize=1"; do
  curl -sk --resolve yanglaoai999.com:443:124.221.229.12 -o /dev/null -w "$p → %{http_code}\n" "https://yanglaoai999.com$p"
done
# 期望：全部 200/307（login 保护属正常），robots/sitemap 200
```

## 步骤 D：DNS 切换（用户操作，10 分钟内全球生效）

DNSPod → 我的域名 → yanglaoai999.com → 解析记录：

1. `@` A 记录：76.76.21.21 → **124.221.229.12**（编辑保存）
2. `www`：删除 CNAME → 新建 A 记录 **124.221.229.12**
3. **不动**：`_vercel` TXT、MX 及其他无关记录

验证：`dig +short yanglaoai999.com` 出现 124.221.229.12。

## 步骤 E：切换后检查（我执行）

DNS 生效 → HTTPS 首页/登录/API/静态资源/移动端 → 支付回调联通 → 观察容器日志无异常。

## 回滚（严重故障时）

1. DNS：`@` A 记录改回 **76.76.21.21**；`www` 重建 CNAME **cname.vercel-dns.com**（`_vercel` TXT 未动，Vercel 立即恢复）
2. 应用：`docker tag yanglaoai-app:rollback-YYYYMMDD yanglaoai-app:latest && docker compose -f docker-compose.prod.yml up -d --force-recreate`
3. 回滚决策阈值：首页 5xx、登录不可用、支付回调失败超过 10 分钟未定位。
