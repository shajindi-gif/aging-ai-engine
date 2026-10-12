# PAYMENT_ACCEPTANCE.md — 支付验收报告

> 日期：2026-10-12 ｜ 代码：`683476a`+（main）
> 规则：单元/Mock 集成/生产真实交易**分层报告，不得混同**。

## 一、已实现能力（代码层审计结论）

| 能力 | 微信支付 | 支付宝 |
|---|---|---|
| 签名 | APIv3 RSA-SHA256 请求头签名 ✓ | RSA2（alipay-sdk）✓ |
| 支付方式 | Native 扫码（code_url→二维码） | 电脑网站 page.pay（qr_pay_mode=2 可扫码可登录） |
| 回调验签 | 微信支付公钥模式（WXPAY_PUBKEY_ID 匹配）✓ | checkNotifySign ✓ |
| 回调解密 | AES-256-GCM（APIv3 resource）✓ | 明文 form ✓ |
| 金额校验 | 回调 amount.total(分) === 订单 amountFen ✓ | total_amount(元) === amountFen/100 ✓ |
| 幂等 | PaymentNotifyLog + 状态判断 + 事务 ✓ | 同左（共用 handlePaidNotify）✓ |
| 权益开通 | Entitlement 事务创建，expireAt=+30d ✓ | 同左 ✓ |
| 丢单兜底 | status 接口主动查单（queryWechatOrder）✓ | queryTrade ✓ |
| 商品定价 | 服务端 products.ts 目录，前端不可传价 ✓ | 同左 ✓ |

订单状态机：`PENDING → PAID`（以服务端回调/查单为唯一依据）+ `CANCELLED/REFUNDED/EXPIRED` 预留。前端无法标记支付成功。

## 二、Mock 集成测试（已通过 ✅ 2026-10-11）

```
下单(¥2980) → 模拟回调 processed → 订单 PAID → Payment SUCCESS(txn 记录)
→ Entitlement silvercare.pro ACTIVE(+30d) → 重复回调 duplicate（权益不重复发放）
→ 未配凭证发起真实支付 → 503 明确拒绝（不伪装成功）
```
DB 证据：PaymentNotifyLog 两条（processed + duplicate），Entitlement 仅一条。

## 三、真实凭证下单验证（已通过 ✅ 2026-10-11，本机）

- 微信：真实网关下单返回 `weixin://wxpay/bizpayurl?pr=…` + 二维码图 ✓
- 支付宝：`openapi.alipay.com/gateway.do?...sign_type=RSA2` 收银台 URL ✓
- 未支付订单保持 PENDING（不扣款）✓

## 四、生产真实交易验收（**BLOCKED** — 等 DNS+HTTPS）

阻塞链：微信/支付宝回调地址为 `https://yanglaoai999.com/api/pay/notify/{alipay,wechat}`，域名仍指 Vercel，回调不可达。

**解锁步骤**（详见 DNS_SSL_GUIDE.md）：
1. 用户：腾讯云免费 SSL 证书申领（DNS 验证）
2. 我：证书部署 + 443 配置 + 源站验证
3. 用户：DNSPod 切 DNS（@/www → 124.221.229.12）
4. 用户：微信商户平台（1117431351）加支付授权目录 `https://yanglaoai999.com/`（带尾斜杠）
5. **真实验收**（用户扫码，建议 1 分钱测试商品 test-1fen）：
   - [ ] 微信扫码支付 → 回调验签 → 订单 PAID → 权益开通 → 后台订单可见
   - [ ] 支付宝收银台支付 → 同上
   - [ ] 商户后台核对交易流水与金额
   - [ ] 重复通知不重复开通（重放回调或等渠道重推）
6. 验收后：1 分钱订单原路退款（商户后台），测试商品可下架（products.ts active:false）

## 五、已知边界（如实）

- 退款：线上退款按钮未开放（走商户后台操作，Payment.refundNo 字段已预留），高风险操作需审批留痕（运营后台已声明）
- 微信 JSAPI/H5 通道：代码未含（当前只开 Native 扫码），需要时按模板补
- 对账：PaymentNotifyLog 可查，每日对账单自动拉取未做（P3）
