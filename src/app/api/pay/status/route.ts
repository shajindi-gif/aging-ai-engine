// @ts-nocheck
// 支付状态查询（前端轮询）+ 丢单兜底（主动查支付宝）
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrderWithPayment } from "@/lib/payments/core";
import { isAlipayConfigured, queryTrade } from "@/lib/payments/alipay";
import { handlePaidNotify } from "@/lib/payments/core";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const orderNo = new URL(request.url).searchParams.get("orderNo");
  if (!orderNo) return NextResponse.json({ success: false, error: "缺少订单号" }, { status: 400 });

  let order = await getOrderWithPayment(orderNo, session.user.id || session.user.sub);
  if (!order) return NextResponse.json({ success: false, error: "订单不存在" }, { status: 404 });

  // 丢单兜底：本地仍 PENDING 且支付宝已配置时，主动查单补状态
  if (order.status === "PENDING" && isAlipayConfigured()) {
    const q = await queryTrade(order.orderNo);
    if (q && (q.tradeStatus === "TRADE_SUCCESS" || q.tradeStatus === "TRADE_FINISHED")) {
      const payment = order.payments.find((p) => p.provider === "ALIPAY");
      if (payment && !payment.providerTransactionId) {
        await handlePaidNotify({
          provider: "ALIPAY",
          outTradeNo: order.orderNo,
          tradeNo: payment.providerTransactionId || `QUERY-${order.orderNo}`,
          tradeStatus: q.tradeStatus,
          totalAmountYuan: q.totalAmount || String(order.amountFen / 100),
          raw: { source: "query_fallback", trade_status: q.tradeStatus, total_amount: q.totalAmount },
        });
        order = (await getOrderWithPayment(orderNo, session.user.id || session.user.sub))!;
      }
    }
  }

  const payment = order.payments[0];
  return NextResponse.json({
    success: true,
    data: {
      orderNo: order.orderNo,
      status: order.status,
      amountFen: order.amountFen,
      productName: order.productName,
      paidAt: order.paidAt,
      paymentStatus: payment?.status,
    },
  });
}
