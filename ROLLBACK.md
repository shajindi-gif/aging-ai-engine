# ROLLBACK.md — 回滚手册

> 原则：任何变更前先备份；回滚按层级从快到慢尝试。

## 1. DNS 回滚（最快，秒级生效方向切换）

场景：切换后站点严重故障。

```
DNSPod → yanglaoai999.com：
  @   A     124.221.229.12  →  76.76.21.21
  www A     124.221.229.12  →  删除，重建 CNAME cname.vercel-dns.com
（_vercel TXT 从未改动，Vercel 立即恢复接管）
```

## 2. 应用回滚（分钟级）

场景：新版本代码故障。

```bash
ssh ubuntu@124.221.229.12
# 查看可回滚版本（每次部署自动打 tag）
sudo docker images | grep rollback
# 回滚到指定版本
sudo docker tag yanglaoai-app:rollback-YYYYMMDD yanglaoai-app:latest
cd /opt/yanglaoai && sudo docker compose -f docker-compose.prod.yml up -d --force-recreate
# 验证
curl -H "Host: yanglaoai999.com" http://124.221.229.12/api/health
```

## 3. 配置回滚

```bash
# 备份位置（每次部署前自动创建）
ls /opt/yanglaoai-backup-*
# nginx 边缘配置
sudo cp /opt/yanglaoai-backup-<日期>/nginx-conf/yanglaoai999.com.conf \
        /opt/legal-review/deploy/nginx/conf.d/ && sudo docker exec legal-nginx nginx -s reload
# compose
sudo cp /opt/yanglaoai-backup-<日期>/docker-compose.prod.yml /opt/yanglaoai/
```

## 4. 数据库回滚（谨慎）

- **结构**：所有 schema 变更均为增量（新表/可空列/带默认值列），`prisma db push` 未使用破坏性操作；如需回滚结构，用备份 schema 生成反向迁移。
- **数据**：Neon 控制台 → 项目 → PitPITR/时间线恢复（免费层保留窗口内）；重大操作前建议导出关键表 CSV。

## 5. 回滚决策阈值

立即回滚：首页 5xx > 5 分钟、登录不可用、支付回调失败且 10 分钟内无法定位。
可热修不回滚：样式问题、非核心接口异常。

## 6. 当前基线（2026-10-12）

- Git：`683476a`（+ 待提交的 account/admin 页面）
- 镜像：`yanglaoai-app:latest`（label org.opencontainers.image.revision=683476a）
- 回滚镜像：`yanglaoai-app:rollback-20261012-*`
- 备份目录：`/opt/yanglaoai-backup-20261012-134854`
