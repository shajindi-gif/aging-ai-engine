// @ts-nocheck
// 更新基本资料（昵称等，渐进式补充）
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireFreshSession, sameOriginOk } from "@/lib/authz/guard";
import { logAuth, clientIp } from "@/lib/authz/identity";

export async function POST(req: NextRequest) {
  if (!sameOriginOk(req)) return NextResponse.json({ success: false, error: "非法请求来源" }, { status: 403 });
  const ctx = await requireFreshSession();
  if (!ctx) return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
  try {
    const { name, nickname } = await req.json();
    const data: Record<string, string> = {};
    if (typeof name === "string" && name.trim()) data.name = name.trim().slice(0, 50);
    if (typeof nickname === "string" && nickname.trim()) data.nickname = nickname.trim().slice(0, 50);
    if (!Object.keys(data).length) return NextResponse.json({ success: false, error: "没有需要更新的内容" }, { status: 400 });
    await prisma.user.update({ where: { id: ctx.user.id }, data });
    await logAuth({ event: "profile_updated", userId: ctx.user.id, ip: clientIp(req) });
    return NextResponse.json({ success: true, message: "已保存" });
  } catch (e) {
    console.error("[profile] error");
    return NextResponse.json({ success: false, error: "保存失败" }, { status: 500 });
  }
}
