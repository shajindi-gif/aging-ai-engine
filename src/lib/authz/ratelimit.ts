// 进程内滑动窗口限流（单实例部署适用；多实例时替换为 Redis Adapter）
// 用途：登录尝试、验证码发送（按 IP / 按标识 / 全局）
import crypto from "crypto";

interface Bucket { hits: number[] }
const store = new Map<string, Bucket>();

function keyHash(k: string): string {
  return crypto.createHash("sha1").update(k).digest("hex");
}

/**
 * 检查并记录一次请求。
 * @param key 维度键，如 "login:ip:xxx" / "code:sms:phone:+86..." / "code:sms:global"
 * @param limit 窗口内最大次数
 * @param windowMs 窗口毫秒
 * @returns { allowed, retryAfterSec }
 */
export function rateLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const k = keyHash(key);
  const b = store.get(k) || { hits: [] };
  b.hits = b.hits.filter((t) => now - t < windowMs);
  if (b.hits.length >= limit) {
    const retry = Math.ceil((windowMs - (now - b.hits[0])) / 1000);
    store.set(k, b);
    return { allowed: false, retryAfterSec: retry };
  }
  b.hits.push(now);
  store.set(k, b);
  // 简易清理防内存膨胀
  if (store.size > 50000) {
    for (const [kk, bb] of store) {
      bb.hits = bb.hits.filter((t) => now - t < windowMs);
      if (bb.hits.length === 0) store.delete(kk);
    }
  }
  return { allowed: true, retryAfterSec: 0 };
}

// ── 认证场景限流配置（阈值可配）──
export const RL = {
  login: (ip: string) => rateLimit("login:ip:" + ip, Number(process.env.RL_LOGIN_IP || 10), 60_000),
  loginAccount: (id: string) => rateLimit("login:acc:" + id, Number(process.env.RL_LOGIN_ACCOUNT || 5), 300_000),
  codeIp: (ip: string) => rateLimit("code:ip:" + ip, Number(process.env.RL_CODE_IP || 10), 600_000),
  codeIdentifier: (id: string) => rateLimit("code:id:" + id, Number(process.env.RL_CODE_ID || 5), 3_600_000),
  codeGlobal: () => rateLimit("code:global", Number(process.env.RL_CODE_GLOBAL || 600), 3_600_000),
  register: (ip: string) => rateLimit("reg:ip:" + ip, Number(process.env.RL_REGISTER_IP || 5), 3_600_000),
  reset: (ip: string) => rateLimit("reset:ip:" + ip, Number(process.env.RL_RESET_IP || 5), 3_600_000),
};
