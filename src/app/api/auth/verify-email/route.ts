// @ts-nocheck
// 邮箱验证：消费 email_verify 验证码，标记身份已验证
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeEmail } from "@/lib/authz/identifiers";
import { verifyCode } from "@/lib/authz/codes";
import { logAuth, clientIp } from "@/lib/authz/identity";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    const target = normalizeEmail(String(email || ""));
    if (!target) return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });

    const r = await verifyCode({ purpose: "email_verify", identifier: target, code: String(code || "") });
    if (r !== "ok") {
      const msg = r === "expired" ? "验证码已过期，请重新获取" : r === "locked" ? "尝试次数过多，请重新获取" : "验证码不正确";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const user = await prisma.user.findFirst({ where: { email: { equals: target, mode: "insensitive" } } });
    if (!user) return NextResponse.json({ error: "验证码不正确" }, { status: 400 });

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { emailVerified: new Date() } }),
      prisma.userIdentity.updateMany({ where: { userId: user.id, type: "email", identifier: target }, data: { verifiedAt: new Date() } }),
    ]);
    await logAuth({ event: "email_verified", userId: user.id, ip: clientIp(req) });
    return NextResponse.json({ success: true, message: "邮箱已验证" });
  } catch (e) {
    console.error("[verify-email] error");
    return NextResponse.json({ error: "验证失败" }, { status: 500 });
  }
}
