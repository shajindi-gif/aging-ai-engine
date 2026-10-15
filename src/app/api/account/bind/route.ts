// @ts-nocheck
// 绑定/更换 邮箱或手机号：需验证码验证；冲突拒绝（不自动合并账户）；关键变更后撤销全部会话
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireFreshSession, sameOriginOk } from "@/lib/authz/guard";
import { normalizeEmail, normalizePhone } from "@/lib/authz/identifiers";
import { verifyCode } from "@/lib/authz/codes";
import { ensureIdentity, revokeAllSessions, logAuth, clientIp } from "@/lib/authz/identity";

export async function POST(req: NextRequest) {
  if (!sameOriginOk(req)) return NextResponse.json({ success: false, error: "非法请求来源" }, { status: 403 });
  const ctx = await requireFreshSession();
  if (!ctx) return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
  const { user } = ctx;

  try {
    const { target, code } = await req.json();
    const email = normalizeEmail(String(target || ""));
    const phone = email ? null : normalizePhone(String(target || ""));
    const identifier = email || phone;
    if (!identifier) return NextResponse.json({ success: false, error: "格式不正确" }, { status: 400 });

    const purpose = email ? "email_verify" : "phone_verify";
    const r = await verifyCode({ purpose: purpose as any, identifier, code: String(code || "") });
    if (r !== "ok") {
      const msg = r === "expired" ? "验证码已过期" : r === "locked" ? "尝试过多，请重新获取" : "验证码不正确";
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    // 冲突检查：该标识已属于其他账户 → 拒绝（绝不自动合并）
    const owner = await prisma.userIdentity.findUnique({ where: { identifier } });
    if (owner && owner.userId !== user.id) {
      return NextResponse.json({ success: false, error: "该联系方式已绑定其他账户；如需处理请联系客服" }, { status: 409 });
    }

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: email ? { email: identifier, emailVerified: new Date() } : { phone: identifier } }),
      prisma.userIdentity.updateMany({ where: { userId: user.id, type: owner?.type || (email ? "email" : "phone"), isPrimary: true }, data: { isPrimary: false } }),
    ]);
    await ensureIdentity(user.id, identifier, true);
    await revokeAllSessions(user.id); // 关键变更：其他设备需重新登录
    await logAuth({ event: "identity_bound", userId: user.id, ip: clientIp(req), meta: { type: email ? "email" : "phone" } });

    return NextResponse.json({ success: true, message: "绑定成功，出于安全考虑请在各设备重新登录", reauthRequired: true });
  } catch (e) {
    console.error("[bind] error");
    return NextResponse.json({ success: false, error: "操作失败" }, { status: 500 });
  }
}
