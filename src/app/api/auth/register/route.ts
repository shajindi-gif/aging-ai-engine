// @ts-nocheck
// 注册升级：邮箱+密码（姓名改为可选，低摩擦）；密码策略 NIST 风格；发送验证邮件
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { z } from "zod";
import { normalizeEmail } from "@/lib/authz/identifiers";
import { checkPasswordPolicy, hashPassword, logAuth, clientIp, ensureIdentity } from "@/lib/authz/identity";
import { issueCode } from "@/lib/authz/codes";
import { sendEmail } from "@/lib/authz/channels";
import { RL } from "@/lib/authz/ratelimit";

const schema = z.object({
  email: z.string().min(3),
  password: z.string().min(1).max(128),
  name: z.string().max(50).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req) || "unknown";
    if (!RL.register(ip).allowed) {
      return NextResponse.json({ error: "注册过于频繁，请稍后再试" }, { status: 429 });
    }
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ error: "请检查填写内容" }, { status: 400 });

    const email = normalizeEmail(parsed.data.email);
    if (!email) return NextResponse.json({ error: "邮箱格式不正确" }, { status: 400 });
    const pwdErr = checkPasswordPolicy(parsed.data.password);
    if (pwdErr) return NextResponse.json({ error: pwdErr }, { status: 400 });

    const existing = await prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } });
    if (existing) return NextResponse.json({ error: "该邮箱已注册，请直接登录" }, { status: 409 });

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: { email, passwordHash, name: parsed.data.name?.trim() || null, role: "FAMILY" },
    });
    await ensureIdentity(user.id, email, false);
    await logAuth({ event: "register", userId: user.id, ip, meta: { via: "email_password" } });

    // 发送验证邮件（失败不阻断注册，可稍后重发）
    try {
      const issued = await issueCode({ channel: "email", purpose: "email_verify", identifier: email, ipHash: null });
      if (issued.ok && issued.code) {
        await sendEmail({
          to: email, purpose: "email_verify", code: issued.code,
          subject: "验证你的邮箱 — 衍策银龄",
          body: `欢迎使用衍策银龄。您的邮箱验证码：${issued.code}（5 分钟内有效）。\n在「账户设置」页输入验证码即可完成邮箱验证。`,
        });
      }
    } catch { /* 邮件失败静默，用户可重发 */ }

    return NextResponse.json({ success: true, email }, { status: 201 });
  } catch (e) {
    console.error("[register] error");
    return NextResponse.json({ error: "注册失败，请稍后重试" }, { status: 500 });
  }
}
