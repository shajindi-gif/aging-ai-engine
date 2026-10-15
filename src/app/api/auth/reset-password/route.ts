// @ts-nocheck
// 忘记密码：验证码 + 新密码一步完成；成功后撤销所有旧会话
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { normalizeEmail, normalizePhone } from "@/lib/authz/identifiers";
import { verifyCode } from "@/lib/authz/codes";
import { checkPasswordPolicy, hashPassword, findUserByIdentifier, revokeAllSessions, logAuth, clientIp } from "@/lib/authz/identity";
import { RL } from "@/lib/authz/ratelimit";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req) || "unknown";
    if (!RL.reset(ip).allowed) return NextResponse.json({ error: "操作过于频繁，请稍后再试" }, { status: 429 });

    const { identifier, code, newPassword } = await req.json();
    const email = normalizeEmail(String(identifier || ""));
    const phone = email ? null : normalizePhone(String(identifier || ""));
    const target = email || phone;
    if (!target) return NextResponse.json({ error: "请输入正确的邮箱或手机号" }, { status: 400 });

    const r = await verifyCode({ purpose: "password_reset", identifier: target, code: String(code || "") });
    if (r !== "ok") {
      const msg = r === "expired" ? "验证码已过期，请重新获取" : r === "locked" ? "尝试次数过多，请重新获取验证码" : "验证码不正确";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const pwdErr = checkPasswordPolicy(String(newPassword || ""));
    if (pwdErr) return NextResponse.json({ error: pwdErr }, { status: 400 });

    const user = await findUserByIdentifier(target);
    if (!user) return NextResponse.json({ error: "验证码不正确" }, { status: 400 }); // 不暴露账户存在性

    await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(String(newPassword)) } });
    await revokeAllSessions(user.id); // 重置密码后旧会话全部失效
    await logAuth({ event: "password_reset", userId: user.id, ip, meta: { via: email ? "email" : "sms" } });

    return NextResponse.json({ success: true, message: "密码已重置，请使用新密码登录" });
  } catch (e) {
    console.error("[reset-password] error");
    return NextResponse.json({ error: "操作失败，请稍后重试" }, { status: 500 });
  }
}
