// 服务订单状态机 PATCH（P0 业务闭环：状态转换服务端强制，前端不可任意改写终态）
// 允许流转：PENDING→CONFIRMED|CANCELLED；CONFIRMED→IN_PROGRESS|CANCELLED；
//          IN_PROGRESS→COMPLETED|CANCELLED；COMPLETED/CANCELLED 为终态（如需争议走人工客服）。
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { canAccessElder } from "@/lib/authz/elder-access";

const TRANSITIONS: Record<string, string[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const next = String(body.status || "");

    const order = await prisma.careOrder.findUnique({
      where: { id },
      select: { id: true, status: true, elderlyId: true, orderNo: true },
    });
    if (!order) return NextResponse.json({ success: false, error: "订单不存在" }, { status: 404 });

    if (!(await canAccessElder(session as any, order.elderlyId))) {
      return NextResponse.json({ success: false, error: "无权操作该订单" }, { status: 403 });
    }

    // 幂等：重复提交同一目标状态直接返回成功
    if (order.status === next) {
      return NextResponse.json({ success: true, data: { id: order.id, status: order.status, unchanged: true } });
    }
    const allowed = TRANSITIONS[String(order.status)] || [];
    if (!allowed.includes(next)) {
      return NextResponse.json(
        { success: false, error: `不允许的状态流转：${order.status} → ${next || "(空)"}。终态订单请联系客服处理。` },
        { status: 400 },
      );
    }

    const updated = await prisma.careOrder.update({
      where: { id },
      data: { status: next as any, ...(next === "COMPLETED" ? { completedAt: new Date() } : {}) },
      select: { id: true, orderNo: true, status: true },
    });
    return NextResponse.json({ success: true, data: { ...updated, previousStatus: order.status } });
  } catch (error) {
    console.error("[care-orders/:id PATCH] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "更新失败" }, { status: 500 });
  }
}
