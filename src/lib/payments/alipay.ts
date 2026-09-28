// ═══════════════════════════════════════════════
// 支付宝支付客户端（电脑网站支付 trade.page.pay / RSA2）
// 凭证全部来自服务端环境变量；未配置时 isConfigured()=false，
// 调用方需降级为 MOCK/测试模式，不得伪装成真实支付。
//
// 环境变量：
//   ALIPAY_APP_ID          应用 APPID
//   ALIPAY_PRIVATE_KEY     应用私钥（PKCS8，一行，含 \n 转义）
//   ALIPAY_PUBLIC_KEY      支付宝公钥（用于验签，非应用公钥）
//   ALIPAY_GATEWAY         默认 https://openapi.alipay.com/gateway.do（沙箱: https://openapi-sandbox.dl.alipaydev.com/gateway.do）
//   ALIPAY_NOTIFY_URL_BASE 对外可达站点根（如 https://yanglaoai999.com）
// ═══════════════════════════════════════════════

import crypto from "crypto";

export interface AlipayConfig {
  appId: string;
  privateKey: string;
  alipayPublicKey: string;
  gateway: string;
}

export function getAlipayConfig(): AlipayConfig | null {
  const appId = process.env.ALIPAY_APP_ID?.trim();
  const privateKey = normalizePem(process.env.ALIPAY_PRIVATE_KEY);
  const alipayPublicKey = normalizePem(process.env.ALIPAY_PUBLIC_KEY);
  if (!appId || !privateKey || !alipayPublicKey) return null;
  return {
    appId,
    privateKey,
    alipayPublicKey,
    gateway: process.env.ALIPAY_GATEWAY?.trim() || "https://openapi.alipay.com/gateway.do",
  };
}

export function isAlipayConfigured(): boolean {
  return getAlipayConfig() !== null;
}

function normalizePem(raw?: string): string | null {
  if (!raw?.trim()) return null;
  let s = raw.trim().replace(/\\n/g, "\n");
  if (!s.includes("-----BEGIN")) {
    s = `-----BEGIN RSA PRIVATE KEY-----\n${s}\n-----END RSA PRIVATE KEY-----`;
  }
  return s;
}

/** 参数签名（RSA2）：剔除 sign/sign_type 后按 key 升序拼 k=v&，RSA-SHA256 */
export function signParams(params: Record<string, string>, privateKey: string): string {
  const filtered = Object.entries(params).filter(([k]) => k !== "sign" && k !== "sign_type" && k !== "");
  filtered.sort(([a], [b]) => a.localeCompare(b));
  const content = filtered.map(([k, v]) => `${k}=${v}`).join("&");
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(content, "utf8");
  return signer.sign(privateKey, "base64");
}

/** 验签支付宝异步通知：返回 {ok, params} */
export function verifyNotify(
  formParams: Record<string, string>,
  alipayPublicKey: string
): { ok: boolean; params: Record<string, string> } {
  const params: Record<string, string> = {};
  for (const [k, v] of Object.entries(formParams)) {
    if (k === "sign" || k === "sign_type" || k.startsWith("http_")) continue;
    params[k] = v;
  }
  const sign = formParams["sign"];
  if (!sign) return { ok: false, params };
  const filtered = Object.entries(params).filter(([, v]) => v !== "");
  filtered.sort(([a], [b]) => a.localeCompare(b));
  const content = filtered.map(([k, v]) => `${k}=${v}`).join("&");
  const verifier = crypto.createVerify("RSA-SHA256");
  verifier.update(content, "utf8");
  const ok = verifier.verify(alipayPublicKey, sign, "base64");
  return { ok, params };
}

/**
 * 生成支付宝电脑网站支付跳转 URL（alipay.trade.page.pay）
 * 用户浏览器 302 过去即可看到支付宝收银台
 */
export function buildPagePayUrl(opts: {
  outTradeNo: string;
  totalFen: number;
  subject: string;
  notifyUrl: string;
  returnUrl: string;
}): string | null {
  const cfg = getAlipayConfig();
  if (!cfg) return null;
  const bizContent = JSON.stringify({
    out_trade_no: opts.outTradeNo,
    product_code: "FAST_INSTANT_TRADE_PAY",
    total_amount: (opts.totalFen / 100).toFixed(2),
    subject: opts.subject,
  });
  const params: Record<string, string> = {
    app_id: cfg.appId,
    method: "alipay.trade.page.pay",
    format: "JSON",
    charset: "utf-8",
    sign_type: "RSA2",
    timestamp: formatAlipayTime(new Date()),
    version: "1.0",
    notify_url: opts.notifyUrl,
    return_url: opts.returnUrl,
    biz_content: bizContent,
  };
  const sign = signParams(params, cfg.privateKey);
  const query = new URLSearchParams({ ...params, sign, sign_type: "RSA2" });
  return `${cfg.gateway}?${query.toString()}`;
}

function formatAlipayTime(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
}

/**
 * 支付宝主动查单（alipay.trade.query）——用于丢单兜底。
 * 返回 {tradeStatus, totalAmount?} 或 null（查询失败/订单不存在）
 */
export async function queryTrade(outTradeNo: string): Promise<{ tradeStatus: string; totalAmount?: string } | null> {
  const cfg = getAlipayConfig();
  if (!cfg) return null;
  const bizContent = JSON.stringify({ out_trade_no: outTradeNo });
  const params: Record<string, string> = {
    app_id: cfg.appId,
    method: "alipay.trade.query",
    format: "JSON",
    charset: "utf-8",
    sign_type: "RSA2",
    timestamp: formatAlipayTime(new Date()),
    version: "1.0",
    biz_content: bizContent,
  };
  const sign = signParams(params, cfg.privateKey);
  const body = new URLSearchParams({ ...params, sign, sign_type: "RSA2" });
  try {
    const res = await fetch(cfg.gateway, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: AbortSignal.timeout(15_000),
    });
    const json = await res.json();
    const resp = json?.alipay_trade_query_response;
    if (!resp || resp.code !== "10000") return null;
    return { tradeStatus: resp.trade_status, totalAmount: resp.total_amount };
  } catch {
    return null;
  }
}
