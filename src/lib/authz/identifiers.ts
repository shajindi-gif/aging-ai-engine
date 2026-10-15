// 标识规范化与脱敏 — 统一身份系统的基础
import crypto from "crypto";

const SECRET = process.env.AUTH_CODE_SECRET || process.env.NEXTAUTH_SECRET || "dev-only-insecure-secret";

/** 邮箱规范化：去空格、整体小写（Gmail 点号等不做特殊处理，保持可核对） */
export function normalizeEmail(raw: string): string | null {
  const e = (raw || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e)) return null;
  if (e.length > 254) return null;
  return e;
}

/**
 * 手机号规范化为 E.164。
 * 支持：13800138000 / +8613800138000 / 8613800138000 / 138-0013-8000
 * 默认国家码 +86（中国大陆 11 位手机号）。
 */
export function normalizePhone(raw: string, defaultCC = "86"): string | null {
  const digits = (raw || "").replace(/[\s\-()]/g, "").replace(/^\+/, "");
  if (!/^\d{6,15}$/.test(digits)) return null;
  if (digits.startsWith("00")) return null; // 不支持国际前缀写法
  if (digits.startsWith("+")) return null;
  if (digits.startsWith("86") && digits.length > 11) return "+" + digits;
  if (digits.length === 11 && digits.startsWith("1")) return "+" + defaultCC + digits; // 中国大陆
  if (digits.length >= 8 && digits.length <= 10) return "+" + defaultCC + digits;     // 其他短号（按默认国家码）
  return null;
}

/** 验证中国大陆手机号格式（11位 1 开头） */
export function isCNMobile(phone: string): boolean {
  return /^\+861[3-9]\d{9}$/.test(phone);
}

/** HMAC 标识哈希（用于验证码表与日志，不存明文标识） */
export function hashIdentifier(identifier: string): string {
  return crypto.createHmac("sha256", SECRET).update(identifier).digest("hex");
}

/** 脱敏显示：138****8000 / ab***@example.com */
export function maskIdentifier(identifier: string): string {
  if (identifier.startsWith("+")) {
    const p = identifier.slice(1);
    if (p.length >= 9) return `+${p.slice(0, 2)}****${p.slice(-4)}`;
    return p.slice(0, 2) + "****";
  }
  const at = identifier.indexOf("@");
  if (at > 1) {
    return identifier.slice(0, 2) + "***" + identifier.slice(at);
  }
  return "***";
}

/** IP 哈希（审计用，不存明文） */
export function hashIp(ip: string | undefined | null): string | null {
  if (!ip) return null;
  return crypto.createHmac("sha256", SECRET).update(ip).digest("hex").slice(0, 32);
}

export function hashUa(ua: string | undefined | null): string | null {
  if (!ua) return null;
  return crypto.createHash("sha256").update(ua).digest("hex").slice(0, 32);
}

/** 判断输入更像邮箱还是手机号 */
export function detectIdentifierKind(raw: string): "email" | "phone" | "unknown" {
  if (raw.includes("@")) return normalizeEmail(raw) ? "email" : "unknown";
  return normalizePhone(raw) ? "phone" : "unknown";
}
