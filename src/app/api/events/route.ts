// @ts-nocheck
// 转化事件埋点（白名单事件名；不记录密码/验证码/Token/健康内容）
import { NextRequest, NextResponse } from "next/server";
import { logAuth, clientIp } from "@/lib/authz/identity";
import { auth } from "@/lib/auth";

const WHITELIST = new Set([
  "auth_page_view", "signup_start", "signup_success", "login_success", "login_failed",
  "verification_sent", "verification_success", "verification_failed",
  "password_reset_success", "onboarding_completed",
]);

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!WHITELIST.has(String(name))) return NextResponse.json({ success: false }, { status: 400 });
    const session = await auth();
    await logAuth({ event: "auth_event", userId: (session?.user as any)?.id ?? null, ip: clientIp(req), meta: { name } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
