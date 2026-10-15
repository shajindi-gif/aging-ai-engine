// @ts-nocheck
// 退出所有设备：authVersion++，旧 JWT 立即失效
import { NextRequest, NextResponse } from "next/server";
import { requireFreshSession, sameOriginOk } from "@/lib/authz/guard";
import { revokeAllSessions, logAuth, clientIp } from "@/lib/authz/identity";

export async function POST(req: NextRequest) {
  if (!sameOriginOk(req)) return NextResponse.json({ success: false, error: "非法请求来源" }, { status: 403 });
  const ctx = await requireFreshSession();
  if (!ctx) return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
  await revokeAllSessions(ctx.user.id);
  await logAuth({ event: "logout_all", userId: ctx.user.id, ip: clientIp(req) });
  return NextResponse.json({ success: true, message: "已退出所有设备" });
}
