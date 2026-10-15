// @ts-nocheck
// 发送验证码：登录/验证/重置统一入口。全局限流 + IP/标识维度限流 + 冷却。
import { NextRequest, NextResponse } from "next/server";
import { issueCode } from "@/lib/authz/codes";
import { normalizeEmail, normalizePhone, hashIp, maskIdentifier } from "@/lib/authz/identifiers";
import { sendEmail, sendSms } from "@/lib/authz/channels";
import { RL } from "@/lib/authz/ratelimit";
import { logAuth, clientIp } from "@/lib/authz/identity";

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req) || "unknown";
    if (!RL.codeIp(ip).allowed) return NextResponse.json({ success: false, error: "发送过于频繁，请稍后再试" }, { status: 429 });
    if (!RL.codeGlobal().allowed) return NextResponse.json({ success: false, error: "系统繁忙，请稍后再试" }, { status: 429 });

    const body = await req.json();
    const purpose = String(body.purpose || "login");
    if (!["login", "email_verify", "phone_verify", "password_reset"].includes(purpose)) {
      return NextResponse.json({ success: false, error: "参数不合法" }, { status: 400 });
    }
    const raw = String(body.identifier || "");
    const email = normalizeEmail(raw);
    const phone = email ? null : normalizePhone(raw);
    const target = email || phone;
    if (!target) return NextResponse.json({ success: false, error: "请输入正确的邮箱或手机号" }, { status: 400 });
    if (!RL.codeIdentifier(target).allowed) return NextResponse.json({ success: false, error: "该账号发送次数过多，请 1 小时后再试" }, { status: 429 });

    const issued = await issueCode({ channel: email ? "email" : "sms", purpose, identifier: target, ipHash: hashIp(ip) });
    if (!issued.ok) {
      if (issued.error === "cooldown") return NextResponse.json({ success: false, error: `发送太快了，请 ${issued.waitSec} 秒后重试` }, { status: 429 });
      return NextResponse.json({ success: false, error: "今日发送次数已达上限" }, { status: 429 });
    }

    try {
      if (email) await sendEmail({ to: email, purpose, code: issued.code });
      else await sendSms(phone, purpose, issued.code);
    } catch (e: any) {
      console.error("[send-code] channel error:", String(e?.message || e).slice(0, 120));
      await logAuth({ event: "code_send_failed", ip, success: false, meta: { purpose, channel: email ? "email" : "sms" } });
      return NextResponse.json({ success: false, error: "发送失败，请稍后重试或换用其他验证方式" }, { status: 502 });
    }

    await logAuth({ event: "code_sent", ip, meta: { purpose, channel: email ? "email" : "sms", masked: maskIdentifier(target) } });
    return NextResponse.json({ success: true, message: "验证码已发送，请注意查收" });
  } catch (e) {
    console.error("[send-code] error");
    return NextResponse.json({ success: false, error: "请求异常" }, { status: 500 });
  }
}
