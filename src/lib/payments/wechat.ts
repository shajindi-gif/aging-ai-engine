/**
 * 微信支付 APIv3 封装 — Native 扫码支付（来自 fengyuxueye 生产验证模板）
 * 无第三方 SDK 依赖，直接实现微信支付 v3 签名 / 验签 / 回调解密
 *
 * 环境变量：
 *   WXPAY_MCH_ID / WXPAY_APP_ID / WXPAY_SERIAL_NO / WXPAY_PRIVATE_KEY
 *   WXPAY_APIV3_KEY（32位 APIv3 密钥）
 *   WXPAY_PUBKEY_ID / WXPAY_PUBKEY（微信支付公钥模式，2024+ 新商户）
 *   WXPAY_NOTIFY_URL（回调地址，公网可达）
 */

import crypto from "crypto";

const WXPAY_MCH_ID = process.env.WXPAY_MCH_ID || "";
const WXPAY_APP_ID = process.env.WXPAY_APP_ID || "";
const WXPAY_SERIAL_NO = process.env.WXPAY_SERIAL_NO || "";
const WXPAY_PRIVATE_KEY = (process.env.WXPAY_PRIVATE_KEY || "").replace(/\\n/g, "\n");
const WXPAY_APIV3_KEY = process.env.WXPAY_APIV3_KEY || process.env.WXPAY_APIV || "";
const WXPAY_GATEWAY = process.env.WXPAY_GATEWAY || "https://api.mch.weixin.qq.com";

// 微信支付公钥模式（新商户无平台证书，验签用固定公钥）
const WXPAY_PUBKEY_ID = process.env.WXPAY_PUBKEY_ID || "";
const WXPAY_PUBKEY = (process.env.WXPAY_PUBKEY || "").replace(/\\n/g, "\n");

export function isWechatConfigured(): boolean {
  return !!(WXPAY_MCH_ID && WXPAY_APP_ID && WXPAY_SERIAL_NO && WXPAY_PRIVATE_KEY && WXPAY_APIV3_KEY);
}

export function getWechatNotifyUrl(): string {
  return (
    process.env.WXPAY_NOTIFY_URL ||
    `${process.env.ALIPAY_NOTIFY_URL_BASE || process.env.SITE_URL || "http://localhost:3000"}/api/pay/notify/wechat`
  );
}

function getPrivateKey(): crypto.KeyObject | null {
  if (!WXPAY_PRIVATE_KEY) return null;
  try {
    return crypto.createPrivateKey(WXPAY_PRIVATE_KEY);
  } catch (err) {
    console.error("[wechat-pay] invalid private key", err instanceof Error ? err.message : err);
    return null;
  }
}

// ── 请求签名（WECHATPAY2-SHA256-RSA2048）────────────────────────────────

function buildAuthorizationHeader(method: string, urlPath: string, body: string): string | null {
  const privateKey = getPrivateKey();
  if (!privateKey) return null;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = crypto.randomBytes(16).toString("hex");
  const message = `${method}\n${urlPath}\n${timestamp}\n${nonce}\n${body}\n`;

  let signature: string;
  try {
    signature = crypto.createSign("RSA-SHA256").update(message).sign(privateKey, "base64");
  } catch (err) {
    console.error("[wechat-pay] sign failed", err instanceof Error ? err.message : err);
    return null;
  }

  return (
    `WECHATPAY2-SHA256-RSA2048 ` +
    `mchid="${WXPAY_MCH_ID}",` +
    `nonce_str="${nonce}",` +
    `timestamp="${timestamp}",` +
    `serial_no="${WXPAY_SERIAL_NO}",` +
    `signature="${signature}"`
  );
}

const HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  // 微信网关对 Node fetch 默认的 Accept-Language 返回 406（生产踩坑修复，勿删）
  "Accept-Language": "zh-CN,zh;q=0.9",
  "User-Agent": "yanglaoai-web/1.0",
};

// ── Native 下单（返回 code_url 用于二维码）──────────────────────────────

export async function createNativeOrder(
  outTradeNo: string,
  totalFen: number,
  description: string,
  notifyUrl: string
): Promise<{ codeUrl: string } | { error: string }> {
  if (!isWechatConfigured()) return { error: "not_configured" };

  const urlPath = "/v3/pay/transactions/native";
  const payload = JSON.stringify({
    mchid: WXPAY_MCH_ID,
    appid: WXPAY_APP_ID,
    description,
    out_trade_no: outTradeNo,
    notify_url: notifyUrl,
    amount: { total: totalFen, currency: "CNY" },
  });

  const auth = buildAuthorizationHeader("POST", urlPath, payload);
  if (!auth) return { error: "sign_failed" };

  try {
    const res = await fetch(`${WXPAY_GATEWAY}${urlPath}`, {
      method: "POST",
      headers: { ...HEADERS, Authorization: auth },
      body: payload,
      signal: AbortSignal.timeout(15_000),
    });
    const data = await res.json();
    if (res.ok && data.code_url) return { codeUrl: data.code_url };
    console.error("[wechat native]", { status: res.status, code: data.code, msg: data.message });
    return { error: data.code || `http_${res.status}` };
  } catch (err) {
    console.error("[wechat native] request failed", err instanceof Error ? err.message : err);
    return { error: "network_error" };
  }
}

// ── 主动查单（丢单兜底）─────────────────────────────────────────────────

export async function queryWechatOrder(
  outTradeNo: string
): Promise<{ tradeState: string; transactionId?: string; payerTotal?: number } | null> {
  if (!isWechatConfigured()) return null;
  const urlPath = `/v3/pay/transactions/out-trade-no/${encodeURIComponent(outTradeNo)}?mchid=${encodeURIComponent(WXPAY_MCH_ID)}`;
  const auth = buildAuthorizationHeader("GET", urlPath, "");
  if (!auth) return null;
  try {
    const res = await fetch(`${WXPAY_GATEWAY}${urlPath}`, {
      headers: { ...HEADERS, Authorization: auth },
      signal: AbortSignal.timeout(15_000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      tradeState: data.trade_state,
      transactionId: data.transaction_id,
      payerTotal: data.amount?.payer_total ?? data.amount?.total,
    };
  } catch (err) {
    console.error("[wechat query] failed", err instanceof Error ? err.message : err);
    return null;
  }
}

// ── AES-256-GCM 解密（APIv3 回调 resource）──────────────────────────────

function aes256GcmDecrypt(ciphertextB64: string, key: string, nonce: string, associatedData: string): Buffer {
  const buf = Buffer.from(ciphertextB64, "base64");
  const authTag = buf.subarray(buf.length - 16);
  const data = buf.subarray(0, buf.length - 16);
  const decipher = crypto.createDecipheriv("aes-256-gcm", Buffer.from(key, "utf8"), Buffer.from(nonce, "utf8"));
  decipher.setAuthTag(authTag);
  decipher.setAAD(Buffer.from(associatedData, "utf8"));
  return Buffer.concat([decipher.update(data), decipher.final()]);
}

function verifyWithKey(timestamp: string, nonce: string, body: string, signatureB64: string, key: crypto.KeyObject): boolean {
  const message = `${timestamp}\n${nonce}\n${body}\n`;
  return crypto.createVerify("RSA-SHA256").update(message).verify(key, signatureB64, "base64");
}

/** 验证微信回调签名（微信支付公钥模式；未知 serial 回退平台证书不可用时明确失败） */
export function verifyWechatNotifySignature(
  timestamp: string,
  nonce: string,
  body: string,
  signatureB64: string,
  serialNo: string
): boolean {
  try {
    if (!WXPAY_PUBKEY) {
      console.error("[wechat-pay] WXPAY_PUBKEY 未配置，无法验签");
      return false;
    }
    const pem = WXPAY_PUBKEY.startsWith("-----")
      ? WXPAY_PUBKEY
      : `-----BEGIN PUBLIC KEY-----\n${WXPAY_PUBKEY}\n-----END PUBLIC KEY-----`;
    const pubKeyObj = crypto.createPublicKey(pem);
    if (WXPAY_PUBKEY_ID && serialNo && serialNo !== WXPAY_PUBKEY_ID) {
      console.error("[wechat-pay] 回调 serial 与配置公钥 ID 不符:", serialNo);
      // 仍尝试验签（防配置 ID 与实际不符），失败即拒
    }
    return verifyWithKey(timestamp, nonce, body, signatureB64, pubKeyObj);
  } catch (err) {
    console.error("[wechat-pay] verify signature error", err instanceof Error ? err.message : err);
    return false;
  }
}

/** 解密回调 resource 明文 */
export function decryptWechatResource(resource: {
  ciphertext: string;
  nonce: string;
  associated_data?: string;
}): Record<string, unknown> {
  const plaintext = aes256GcmDecrypt(
    resource.ciphertext,
    WXPAY_APIV3_KEY,
    resource.nonce,
    resource.associated_data || ""
  ).toString("utf8");
  return JSON.parse(plaintext);
}
