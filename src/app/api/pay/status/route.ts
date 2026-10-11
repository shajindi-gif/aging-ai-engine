// @ts-nocheck
// 支付状态查询（前端轮询）+ 双渠道丢单兜底（主动查支付宝/微信）
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrderWithPayment, handlePaidNotify } from "@/lib/payments/core";
import { isAlipayConfigured, queryTrade } from "@/lib/payments/alipay";
import { isWechatConfigured, queryWechatOrder } from "@/lib/payments/wechat";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const orderNo = new URL(request.url).searchParams.get("orderNo");
  if (!orderNo) return NextResponse.json({ success: false, error: "缺少订单号" }, { status: 400 });

  let order = await getOrderWithPayment(orderNo, session.user.id || session.user.sub);
  if (!order) return NextResponse.json({ success: false, error: "订单不存在" }, { status: 404 });

  // 丢单兜底：本地仍 PENDING 时主动查单补状态
  if (order.status === "PENDING") {
    const payment = order.payments[0];
    if (payment?.provider === "WECHAT_PAY" && isWechatConfigured()) {
      const q = await queryWechatOrder(order.orderNo);
      if (q && q.tradeState === "SUCCESS" && q.transactionId && !payment.providerTransactionId) {
        await handlePaidNotify({
          provider: "WECHAT_PAY",
          outTradeNo: order.orderNo,
          tradeNo: q.transactionId,
          tradeStatus: "TRADE_SUCCESS",
          totalAmountYuan: ((q.payerTotal ?? order.amountFen) / 100).toFixed(2),
          raw: { source: "query_fallback", trade_state: q.tradeState },
        });
        order = (await getOrderWithPayment(orderNo, session.user.id || session.user.sub))!;
      }
    } else if (isAlipayConfigured()) {
      const q = await queryTrade(order.orderNo);
      if (q && (q.tradeStatus === "TRADE_SUCCESS" || q.tradeStatus === "TRADE_FINISHED") && q.tradeNo && !payment?.providerTransactionId) {
        await handlePaidNotify({
          provider: "ALIPAY",
          outTradeNo: order.orderNo,
          tradeNo: q.tradeNo,
          tradeStatus: q.tradeStatus,
          totalAmountYuan: q.totalAmountYuan || String(order.amountFen / 100),
          raw: { source: "query_fallback", trade_status: q.tradeStatus },
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
      provider: payment?.provider,
    },
  });
}
