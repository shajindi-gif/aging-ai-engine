// @ts-nocheck
// 修改密码：需旧密码或验证码；成功后撤销全部会话
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireFreshSession, sameOriginOk } from "@/lib/authz/guard";
import { checkPasswordPolicy, hashPassword, verifyPassword, revokeAllSessions, logAuth, clientIp } from "@/lib/authz/identity";
import { verifyCode } from "@/lib/authz/codes";
import { normalizeEmail, normalizePhone } from "@/lib/authz/identifiers";

export async function POST(req: NextRequest) {
  if (!sameOriginOk(req)) return NextResponse.json({ success: false, error: "非法请求来源" }, { status: 403 });
  const ctx = await requireFreshSession();
  if (!ctx) return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
  const { user } = ctx;

  try {
    const { oldPassword, newPassword, code } = await req.json();
    const pwdErr = checkPasswordPolicy(String(newPassword || ""));
    if (pwdErr) return NextResponse.json({ success: false, error: pwdErr }, { status: 400 });

    // 身份再验证：旧密码 或 发到已绑定邮箱/手机的验证码
    let verified = false;
    if (user.passwordHash) {
      verified = await verifyPassword(String(oldPassword || ""), user.passwordHash);
    }
    if (!verified && code) {
      for (const t of [user.email, user.phone]) {
        if (!t) continue;
        const purpose = normalizeEmail(t) ? "email_verify" : "phone_verify";
        const r = await verifyCode({ purpose: purpose as any, identifier: t, code: String(code) });
        if (r === "ok") { verified = true; break; }
      }
    }
    if (!verified) return NextResponse.json({ success: false, error: "身份验证未通过，请输入原密码或验证码" }, { status: 403 });

    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(String(newPassword)) } });
    await revokeAllSessions(user.id);
    await logAuth({ event: "password_reset", userId: user.id, ip: clientIp(req), meta: { via: "change_password" } });
    return NextResponse.json({ success: true, message: "密码已修改，请在各设备重新登录", reauthRequired: true });
  } catch (e) {
    console.error("[change-password] error");
    return NextResponse.json({ success: false, error: "操作失败" }, { status: 500 });
  }
}
