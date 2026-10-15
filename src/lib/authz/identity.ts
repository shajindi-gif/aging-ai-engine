// 密码策略与身份解析、审计日志
import bcrypt from "bcryptjs";
import prisma from "@/lib/db";
import { hashIp, hashUa, normalizeEmail, normalizePhone } from "./identifiers";

// ── 密码策略（NIST 风格：长优先，不强制复杂度）──
export const PWD_MIN = Number(process.env.PWD_MIN_LENGTH || 15); // 单因素密码 ≥15
export const PWD_MAX = 64;

const COMMON = new Set([
  "password12345", "1234567890abc", "qwertyuiop123", "abc1234567890",
  "iloveyou12345", "passwordpassword", "0000000000000", "1111111111111",
]);

/** 校验新密码策略；返回错误信息或 null */
export function checkPasswordPolicy(pwd: string): string | null {
  if (!pwd || pwd.length < PWD_MIN) return `密码至少 ${PWD_MIN} 个字符`;
  if (pwd.length > PWD_MAX) return `密码最多 ${PWD_MAX} 个字符`;
  if (COMMON.has(pwd.toLowerCase())) return "该密码过于常见，请更换";
  return null;
}

export async function hashPassword(pwd: string): Promise<string> {
  return bcrypt.hash(pwd, 12);
}

export async function verifyPassword(pwd: string, hash: string | null | undefined): Promise<boolean> {
  if (!hash) return false;
  try { return await bcrypt.compare(pwd, hash); } catch { return false; }
}

// ── 身份解析（统一身份系统核心）──

export interface ResolvedUser {
  id: string;
  email: string | null;
  phone: string | null;
  name: string | null;
  role: string;
  authVersion: number;
}

/** 按标识（邮箱或手机号）查找用户：先查 UserIdentity，再回退旧字段（兼容历史用户） */
export async function findUserByIdentifier(raw: string): Promise<ResolvedUser | null> {
  const email = normalizeEmail(raw);
  const phone = email ? null : normalizePhone(raw);
  const identifier = email || phone;
  if (!identifier) return null;

  const ident = await prisma.userIdentity.findUnique({ where: { identifier }, include: { user: true } });
  if (ident) return toResolved(ident.user);

  const legacy = await prisma.user.findFirst({
    where: email ? { email: { equals: email, mode: "insensitive" } } : { phone: { startsWith: phone!.slice(1) } },
  });
  // 历史用户 phone 字段格式可能不统一：先精确，再宽松匹配尾 11 位
  if (!legacy && phone) {
    const tail = phone.slice(3); // 去掉 +86
    const loose = await prisma.user.findFirst({ where: { phone: { endsWith: tail } } });
    if (loose) return toResolved(loose);
  }
  return legacy ? toResolved(legacy) : null;
}

function toResolved(u: { id: string; email: string | null; phone: string | null; name: string | null; role: string; authVersion: number }): ResolvedUser {
  return { id: u.id, email: u.email, phone: u.phone, name: u.name, role: u.role, authVersion: u.authVersion };
}

/** 确保用户的邮箱/手机号身份记录存在且已验证（幂等，用于绑定与历史数据回填） */
export async function ensureIdentity(userId: string, raw: string, verified: boolean): Promise<void> {
  const email = normalizeEmail(raw);
  const phone = email ? null : normalizePhone(raw);
  const identifier = email || phone;
  if (!identifier) return;
  const type = email ? "email" : "phone";

  const existing = await prisma.userIdentity.findUnique({ where: { identifier } });
  if (existing) {
    if (existing.userId !== userId) return; // 冲突不自动合并（安全规则）
    if (verified && !existing.verifiedAt) {
      await prisma.userIdentity.update({ where: { id: existing.id }, data: { verifiedAt: new Date() } });
    }
    return;
  }
  await prisma.userIdentity.create({
    data: { userId, type, identifier, verifiedAt: verified ? new Date() : null, isPrimary: true },
  });
}

/** 使全部会话失效（改密/换绑/退出所有设备时调用） */
export async function revokeAllSessions(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { authVersion: { increment: 1 } } });
}

// ── 审计日志（IP/UA 哈希；meta 禁含验证码/密码/Token）──

export async function logAuth(opts: {
  event: string;
  userId?: string | null;
  ip?: string | null;
  ua?: string | null;
  success?: boolean;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.authAuditLog.create({
      data: {
        event: opts.event,
        userId: opts.userId ?? null,
        ipHash: hashIp(opts.ip),
        uaHash: hashUa(opts.ua),
        success: opts.success ?? true,
        meta: opts.meta ? (opts.meta as object) : undefined,
      },
    });
  } catch { /* 审计失败不阻断主流程 */ }
}

/** 从请求头取真实 IP */
export function clientIp(req: Request): string | null {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0].trim();
  return req.headers.get("x-real-ip");
}
