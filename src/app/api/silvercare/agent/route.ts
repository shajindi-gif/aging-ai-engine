// @ts-nocheck
// SilverCare AI Care Agent API
// POST {elderlyId}: 运行 Agent（数据→风险→判断→任务→提醒→报告）
// GET ?elderlyId=: 最近一次运行结果
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

import { canAccessElder, elderScopeWhere } from "@/lib/authz/elder-access";
async function assertElder(elderlyId: string) {
  const s = await auth();
  if (!s) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  if (!(await canAccessElder(s as any, elderlyId))) return NextResponse.json({ success: false, error: "老人档案不存在或无权访问" }, { status: 404 });
  return null;
}
import { runCareAgent } from "@/lib/silvercare/agent";

async function requireSession() {
  const session = await auth();
  if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  return null;
}

export async function GET(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  const elderlyId = new URL(request.url).searchParams.get("elderlyId");
  if (!elderlyId) return NextResponse.json({ success: false, error: "缺少 elderlyId" }, { status: 400 });
  const __g = await assertElder(elderlyId); if (__g) return __g;
  const run = await prisma.careAgentRun.findFirst({
    where: { elderlyId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data: run });
}

export async function POST(request: NextRequest) {
  const denied = await requireSession();
  if (denied) return denied;
  try {
    const b = await request.json();
    if (!b.elderlyId) return NextResponse.json({ success: false, error: "缺少 elderlyId" }, { status: 400 });
    const __gp = await assertElder(b.elderlyId); if (__gp) return __gp;
    const result = await runCareAgent(b.elderlyId);
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch (error) {
    console.error("[agent] error:", error instanceof Error ? error.message : error);
    return NextResponse.json(
      { success: false, error: error instanceof Error && error.message.includes("不存在") ? "老人档案不存在" : "Agent 运行失败，请稍后重试" },
      { status: 500 }
    );
  }
}
