// @ts-nocheck
// 创建支付订单 → 返回 orderNo，前端跳 /checkout/[orderNo]
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createOrder } from "@/lib/payments/core";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "请先登录后再购买" }, { status: 401 });
  try {
    const body = await request.json();
    const productId = String(body?.productId || "");
    if (!productId) return NextResponse.json({ success: false, error: "缺少商品 ID" }, { status: 400 });

    // userId：NextAuth JWT 里的数据库用户 id
    const userId = session.user.id || session.user.sub;
    if (!userId) return NextResponse.json({ success: false, error: "无法识别当前用户" }, { status: 401 });

    const r = await createOrder(userId, productId);
    if ("error" in r) return NextResponse.json({ success: false, error: r.error }, { status: 400 });

    return NextResponse.json({ success: true, data: { orderNo: r.order.orderNo, amountFen: r.order.amountFen, productName: r.order.productName } }, { status: 201 });
  } catch (error) {
    console.error("[pay/order] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "下单失败，请稍后重试" }, { status: 500 });
  }
}
