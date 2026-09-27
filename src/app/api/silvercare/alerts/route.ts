// @ts-nocheck
// SilverCare 异常事件中心 API
// GET ?elderlyId=&status=&level= : 提醒列表（不传 elderlyId 时返回全部，供机构视图）
// PATCH: 确认/解决提醒
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

async function requireSession() {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  const sp = new URL(request.url).searchParams;
  const elderlyId = sp.get("elderlyId");
  const status = sp.get("status");
  const level = sp.get("level");
  const alerts = await prisma.healthAlert.findMany({
    where: {
      ...(elderlyId ? { elderlyId } : {}),
      ...(status ? { status } : {}),
      ...(level ? { level: Number(level) } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ success: true, data: alerts });
}

export async function PATCH(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  try {
    const b = await request.json();
    if (!b.id) return NextResponse.json({ success: false, error: "缺少提醒 id" }, { status: 400 });
    const status = ["OPEN", "ACKNOWLEDGED", "RESOLVED"].includes(b.status) ? b.status : "ACKNOWLEDGED";
    const alert = await prisma.healthAlert.update({
      where: { id: b.id },
      data: { status, acknowledgedAt: status !== "OPEN" ? new Date() : null },
    });
    return NextResponse.json({ success: true, data: alert });
  } catch (error) {
    console.error("[alerts PATCH] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "更新失败" }, { status: 500 });
  }
}
