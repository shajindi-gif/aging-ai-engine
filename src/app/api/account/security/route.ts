// @ts-nocheck
// 账户安全信息：已绑定身份、最近登录、当前会话版本
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireFreshSession } from "@/lib/authz/guard";
import { maskIdentifier } from "@/lib/authz/identifiers";

export async function GET() {
  const ctx = await requireFreshSession();
  if (!ctx) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { user } = ctx;

  const [identities, recent] = await Promise.all([
    prisma.userIdentity.findMany({ where: { userId: user.id }, orderBy: { createdAt: "asc" } }),
    prisma.authAuditLog.findMany({
      where: { userId: user.id, event: { in: ["login_success", "login_failed", "password_reset", "logout_all"] } },
      orderBy: { createdAt: "desc" }, take: 10,
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      profile: { name: user.name, nickname: user.nickname, avatarUrl: user.avatarUrl, createdAt: user.createdAt, lastLoginAt: user.lastLoginAt },
      identities: identities.map((i) => ({
        type: i.type, masked: maskIdentifier(i.identifier), verified: !!i.verifiedAt, primary: i.isPrimary,
      })),
      emailVerified: !!user.emailVerified,
      recentEvents: recent.map((r) => ({ event: r.event, success: r.success, at: r.createdAt })),
    },
  });
}
