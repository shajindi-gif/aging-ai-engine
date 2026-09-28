// @ts-nocheck
// 发起支付：真实支付宝 → 302 跳收银台；MOCK 模式 → 返回测试说明
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getOrderWithPayment } from "@/lib/payments/core";
import { buildPagePayUrl, isAlipayConfigured } from "@/lib/payments/alipay";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
  try {
    const { orderNo, origin } = await request.json();
    if (!orderNo) return NextResponse.json({ success: false, error: "缺少订单号" }, { status: 400 });

    const order = await getOrderWithPayment(orderNo, session.user.id || session.user.sub);
    if (!order) return NextResponse.json({ success: false, error: "订单不存在" }, { status: 404 });
    if (order.status !== "PENDING") return NextResponse.json({ success: false, error: `订单状态为 ${order.status}，无法发起支付` }, { status: 400 });

    const base = process.env.ALIPAY_NOTIFY_URL_BASE || process.env.NEXT_PUBLIC_SITE_URL || origin || "";
    if (!isAlipayConfigured()) {
      return NextResponse.json({
        success: false,
        error: "支付宝商户凭证未配置（ALIPAY_APP_ID / ALIPAY_PRIVATE_KEY / ALIPAY_PUBLIC_KEY），当前无法发起真实支付。请联系管理员。",
        mockMode: true,
      }, { status: 503 });
    }
    const url = buildPagePayUrl({
      outTradeNo: order.orderNo,
      totalFen: order.amountFen,
      subject: order.productName,
      notifyUrl: `${base}/api/pay/notify/alipay`,
      returnUrl: `${base}/checkout/${order.orderNo}?paid=return`,
    });
    if (!url) return NextResponse.json({ success: false, error: "支付参数生成失败" }, { status: 500 });
    return NextResponse.json({ success: true, data: { payUrl: url } });
  } catch (error) {
    console.error("[pay/alipay] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "发起支付失败" }, { status: 500 });
  }
}
