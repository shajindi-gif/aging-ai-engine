# OPERATIONS.md — 运维手册

## 拓扑（2026-10-12）

```
公网 → 124.221.229.12（腾讯云 Ubuntu）
  └─ legal-nginx（边缘，80/443，多站点共享）
       └─ yanglaoai999.com → yanglaoai-app:3000（Next.js standalone）
            └─ Neon PostgreSQL（新加坡，pooler 连接）
```

## 日常命令

```bash
ssh -i ~/Downloads/04-项目与密码/yanceedu.pem ubuntu@124.221.229.12

# 状态
sudo docker ps --filter name=yanglaoai          # 应 Up (healthy)
curl -H "Host: yanglaoai999.com" http://124.221.229.12/api/health

# 日志（已配置轮转 10M×3）
sudo docker logs --since 1h yanglaoai-app | grep -iE "error|⨯"

# 重启
cd /opt/yanglaoai && sudo docker compose -f docker-compose.prod.yml restart
```

## 部署流程（每次发版）

```bash
# 本机
git push origin main
COMMIT=$(git rev-parse --short HEAD)
rsync -az --delete --exclude node_modules --exclude .next --exclude .git --exclude '.env*' \
  ~/projects/aging-ai-engine/ ubuntu@124.221.229.12:/opt/yanglaoai/

# 服务器（先备份 → 构建 → 切换 → 验证）
ssh ubuntu@124.221.229.12
BK=/opt/yanglaoai-backup-$(date +%Y%m%d-%H%M%S) && sudo mkdir -p $BK/nginx-conf
sudo cp /opt/yanglaoai/docker-compose.prod.yml $BK/
sudo cp /opt/legal-review/deploy/nginx/conf.d/yanglaoai999.com.conf $BK/nginx-conf/
sudo docker tag yanglaoai-app:latest yanglaoai-app:rollback-$(date +%Y%m%d-%H%M)
cd /opt/yanglaoai && sudo GIT_COMMIT=$COMMIT docker compose -f docker-compose.prod.yml up -d --build --force-recreate
sleep 25 && sudo docker ps --filter name=yanglaoai --format "{{.Status}}"   # 期望 (healthy)
curl -s -H "Host: yanglaoai999.com" http://124.221.229.12/api/health | head -c 80
```

⚠️ `.env.production` 在 rsync `--exclude '.env*'` 保护下不会被覆盖；变更凭证直接编辑服务器文件后 `restart`。

## 资源与限制

- 容器：1.5G 内存 / 1 核 / 重启策略 unless-stopped / healthcheck 30s
- 整机：15G 内存（多站点共享，当前用量 2.6G）、磁盘 217G 用 40%
- Neon：免费层 serverless，冷启动首请求可能慢 1-2 秒（正常现象）

## 监控与告警（现状与建议）

现状：人工（docker ps / logs / curl health）。
建议接入（P3）：腾讯云云监控告警（CPU/内存/磁盘）、证书到期提醒（TrustAsia 免费证书 1 年期，控制台自带到期通知）、UptimeRobot 拨测 `https://yanglaoai999.com/api/health`。

## 数据库（Neon）

- 连接串在 `.env.production`（pooler 端点，serverless 安全）
- 备份：Neon 控制台时间线（PITR）；重大变更前导出关键表
- Schema 变更：本地改 prisma/schema.prisma → `npx prisma db push`（只用增量操作）→ 随镜像部署

## 支付运维

- 对账：`/admin/ops` 后台看订单+回调日志；商户后台核对流水
- 异常订单（回调缺失）：前端 status 轮询会触发主动查单兜底；也可后台核对后人工确认
- 退款：微信/支付宝商户后台操作（线上退款接口未开，属审批类高危操作）
- 密钥轮换：改 `.env.production` → `docker compose restart`（勿在聊天/文档留存明文）

## 应急联系路径

服务器：腾讯云控制台工单 ｜ 支付：微信/支付宝商户客服 ｜ 代码：github.com/shajindi-gif/aging-ai-engine
