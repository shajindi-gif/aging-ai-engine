/**
 * 支付宝支付封装（基于官方 alipay-sdk，来自 fengyuxueye 生产验证模板）
 *
 * 环境变量：
 *   ALIPAY_APP_ID / ALIPAY_PRIVATE_KEY / ALIPAY_PUBLIC_KEY（支付宝公钥，验签用）
 *   ALIPAY_GATEWAY（默认生产网关）
 *   ALIPAY_NOTIFY_URL（回调地址，公网可达）
 */

let AlipaySdk: any;
try {
  const mod = require("alipay-sdk");
  AlipaySdk = mod.AlipaySdk || mod.default || mod;
} catch {
  // SDK 未安装时降级为不可用（调用方须明确报错，不伪装成功）
}

const ALIPAY_APP_ID = process.env.ALIPAY_APP_ID || "";
const ALIPAY_PRIVATE_KEY = (process.env.ALIPAY_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const ALIPAY_PUBLIC_KEY = (process.env.ALIPAY_PUBLIC_KEY || "").replace(/\\n/g, "\n");
const ALIPAY_GATEWAY = process.env.ALIPAY_GATEWAY || "https://openapi.alipay.com/gateway.do";

export function isAlipayConfigured(): boolean {
  return !!AlipaySdk && !!ALIPAY_APP_ID && !!ALIPAY_PRIVATE_KEY && !!ALIPAY_PUBLIC_KEY;
}

function getClient(): any | null {
  if (!isAlipayConfigured()) return null;
  return new AlipaySdk({
    appId: ALIPAY_APP_ID,
    privateKey: ALIPAY_PRIVATE_KEY,
    alipayPublicKey: ALIPAY_PUBLIC_KEY,
    gateway: ALIPAY_GATEWAY,
    signType: "RSA2",
  });
}

export function getAlipayNotifyUrl(): string {
  return (
    process.env.ALIPAY_NOTIFY_URL ||
    `${process.env.ALIPAY_NOTIFY_URL_BASE || process.env.SITE_URL || "http://localhost:3000"}/api/pay/notify/alipay`
  );
}

/**
 * 电脑网站支付（page.pay）：返回支付宝收银台跳转 URL。
 * 收银台可扫码也可登录支付宝付款（qr_pay_mode=2）。
 */
export function buildPagePayUrl(opts: {
  outTradeNo: string;
  totalFen: number;
  subject: string;
  returnUrl: string;
}): string | null {
  const alipay = getClient();
  if (!alipay) return null;
  try {
    const bizContent = {
      out_trade_no: opts.outTradeNo,
      total_amount: (opts.totalFen / 100).toFixed(2),
      subject: opts.subject,
      product_code: "FAST_INSTANT_TRADE_PAY",
      qr_pay_mode: "2",
    };
    // sdkExec 返回完整查询字符串（含 method/app_id/sign），直接拼网关 URL（勿当对象遍历）
    const qs: string = alipay.sdkExec("alipay.trade.page.pay", {
      bizContent,
      notify_url: getAlipayNotifyUrl(),
      return_url: opts.returnUrl,
    });
    if (!qs || !qs.startsWith("method=")) {
      console.error("[alipay page.pay] unexpected sdkExec result");
      return null;
    }
    return `${ALIPAY_GATEWAY}?${qs}`;
  } catch (err) {
    console.error("[alipay page.pay] failed", err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * 主动查单（丢单兜底）：返回 { tradeStatus, tradeNo, totalAmountYuan } | null
 */
export async function queryTrade(
  outTradeNo: string
): Promise<{ tradeStatus: string; tradeNo?: string; totalAmountYuan?: string } | null> {
  const alipay = getClient();
  if (!alipay) return null;
  try {
    const result = await alipay.exec("alipay.trade.query", {
      bizContent: { out_trade_no: outTradeNo },
    });
    if (result.code === "10000" && result.tradeStatus) {
      return { tradeStatus: result.tradeStatus, tradeNo: result.tradeNo, totalAmountYuan: result.totalAmount };
    }
    return null; // ACQ.TRADE_NOT_EXIST 等未支付情况
  } catch (err) {
    console.error("[alipay query] failed", err instanceof Error ? err.message : err);
    return null;
  }
}

/** 验证支付宝异步通知签名（form 参数） */
export function verifyNotifySign(data: Record<string, string>): boolean {
  const alipay = getClient();
  if (!alipay) return false; // 未配置时拒绝（安全默认）
  try {
    return alipay.checkNotifySign(data);
  } catch (err) {
    console.error("[alipay verify] failed", err instanceof Error ? err.message : err);
    return false;
  }
}
