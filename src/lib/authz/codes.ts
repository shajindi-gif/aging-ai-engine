// 一次性验证码服务：服务端生成（密码学安全随机）、哈希存储、限时、单次使用、尝试受限
import crypto from "crypto";
import prisma from "@/lib/db";
import { hashIdentifier } from "./identifiers";

export type CodePurpose = "login" | "email_verify" | "phone_verify" | "password_reset";
export type CodeChannel = "email" | "sms";

const CODE_TTL_MS = Number(process.env.AUTH_CODE_TTL_SEC || 300) * 1000;        // 默认 5 分钟
const RESEND_COOLDOWN_MS = Number(process.env.AUTH_CODE_COOLDOWN_SEC || 60) * 1000; // 默认 60 秒
const MAX_ACTIVE_CODES = 3;      // 同一标识未消费验证码上限
const MAX_ATTEMPTS = Number(process.env.AUTH_CODE_MAX_ATTEMPTS || 5);

function genCode6(): string {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

function codeHash(code: string, identifierHash: string): string {
  return crypto.createHash("sha256").update(code + ":" + identifierHash).digest("hex");
}

function timingSafeEqualStr(a: string, b: string): boolean {
  const ba = Buffer.from(a), bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
}

export interface IssueResult {
  ok: boolean;
  code?: string;          // 仅返回给渠道发送层；绝不落库明文、绝不进日志
  error?: "cooldown" | "too_many" | "channel_unavailable";
  waitSec?: number;
}

/** 发放验证码。identifier 为规范化后的邮箱/E.164 手机号。 */
export async function issueCode(opts: {
  channel: CodeChannel;
  purpose: CodePurpose;
  identifier: string;
  ipHash?: string | null;
}): Promise<IssueResult> {
  const ih = hashIdentifier(opts.identifier);
  const now = Date.now();

  const recent = await prisma.authVerificationCode.findFirst({
    where: { identifierHash: ih, purpose: opts.purpose },
    orderBy: { createdAt: "desc" },
    take: 1,
  });
  if (recent && now - recent.createdAt.getTime() < RESEND_COOLDOWN_MS) {
    return { ok: false, error: "cooldown", waitSec: Math.ceil((RESEND_COOLDOWN_MS - (now - recent.createdAt.getTime())) / 1000) };
  }

  const activeCount = await prisma.authVerificationCode.count({
    where: { identifierHash: ih, purpose: opts.purpose, consumedAt: null, expiresAt: { gt: new Date(now) } },
  });
  if (activeCount >= MAX_ACTIVE_CODES) return { ok: false, error: "too_many" };

  const code = genCode6();
  await prisma.authVerificationCode.create({
    data: {
      channel: opts.channel,
      purpose: opts.purpose,
      identifierHash: ih,
      codeHash: codeHash(code, ih),
      expiresAt: new Date(now + CODE_TTL_MS),
      maxAttempts: MAX_ATTEMPTS,
      ipHash: opts.ipHash ?? null,
    },
  });
  return { ok: true, code };
}

export type VerifyResult = "ok" | "invalid" | "expired" | "locked";

/** 校验并消费验证码（单次使用；失败计数；超限锁定） */
export async function verifyCode(opts: {
  purpose: CodePurpose;
  identifier: string;
  code: string;
}): Promise<VerifyResult> {
  const ih = hashIdentifier(opts.identifier);
  const now = Date.now();

  const rec = await prisma.authVerificationCode.findFirst({
    where: { identifierHash: ih, purpose: opts.purpose, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });
  if (!rec) return "invalid";
  if (rec.expiresAt.getTime() < now) return "expired";
  if (rec.attempts >= rec.maxAttempts) return "locked";

  const matched = timingSafeEqualStr(codeHash((opts.code || "").trim(), ih), rec.codeHash);
  if (!matched) {
    await prisma.authVerificationCode.update({ where: { id: rec.id }, data: { attempts: { increment: 1 } } });
    return rec.attempts + 1 >= rec.maxAttempts ? "locked" : "invalid";
  }

  // 消费（原子：仅未消费时成功，防并发重复使用）
  const consumed = await prisma.authVerificationCode.updateMany({
    where: { id: rec.id, consumedAt: null },
    data: { consumedAt: new Date(now) },
  });
  if (consumed.count === 0) return "invalid"; // 已被并发消费
  return "ok";
}

/** 清理过期验证码（供 cron 或懒清理） */
export async function purgeExpiredCodes() {
  try {
    await prisma.authVerificationCode.deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 86400000) } } });
  } catch { /* 忽略 */ }
}
