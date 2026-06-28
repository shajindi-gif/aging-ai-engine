# 新域名配置指南

## 推荐域名
| 域名 | 用途 | 状态 |
|------|------|------|
| agingai.cn | 主站 | 待注册 |
| agingengine.ai | 技术品牌 | 待注册 |
| silvercareai.cn | 服务品牌 | 待注册 |
| yinlingai.cn | 中文品牌 | 待注册 |
| yanglaoai.cn | 行业品牌 | 待注册 |
| silverageos.com | 国际品牌 | 待注册 |

## 这是新域名，不是 yance.ai
衍策银龄 AI 是完全独立的项目，使用全新的域名。yance.ai 域名不会被修改或重定向。

## DNS 配置

### 以 agingai.cn 为例：
1. 在域名注册商处添加DNS记录：
   ```
   A    @     76.76.21.21    (Vercel IP)
   CNAME www   cname.vercel-dns.com
   ```
2. 在 Vercel 中验证域名所有权
3. 等待DNS传播（通常5-30分钟）

## SSL 证书
- Vercel 自动签发 Let's Encrypt 证书
- 通常几分钟内完成
- 自动续期

## 域名验证
```bash
curl -I https://agingai.cn
# 应返回 200 OK
```
