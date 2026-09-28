// @ts-nocheck
// 测试专用：模拟支付成功通知（仅 PAY_MODE=mock 环境可用）
// 用于验证 回调→幂等→改单→开权益 闭环；绝不冒充真实支付
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { handlePaidNotify } from "@/lib/payments/core";

export async function POST(request: NextRequest) {
  if (process.env.PAY_MODE !== "mock") {
    return NextResponse.json({ success: false, error: "仅测试模式（PAY_MODE=mock）可用" }, { status: 403 });
  }
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  try {
    const { orderNo } = await request.json();
    if (!orderNo) return NextResponse.json({ success: false, error: "缺少订单号" }, { status: 400 });
    const order = await import("@/lib/payments/core").then((m) => m.getOrderWithPayment(orderNo, session.user.id || session.user.sub));
    if (!order) return NextResponse.json({ success: false, error: "订单不存在" }, { status: 404 });

    const r = await handlePaidNotify({
      provider: "MOCK",
      outTradeNo: order.orderNo,
      tradeNo: `MOCK-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      tradeStatus: "TRADE_SUCCESS",
      totalAmountYuan: String(order.amountFen / 100),
      raw: { source: "mock_simulate", simulated: true },
    });
    return NextResponse.json({ success: r.ok, data: r });
  } catch (error) {
    console.error("[pay/test/simulate] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "模拟失败" }, { status: 500 });
  }
}
