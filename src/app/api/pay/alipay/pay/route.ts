// @ts-nocheck
// 发起支付宝支付：构建收银台跳转 URL（SDK 本地签名，无网络调用）
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
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

    if (!isAlipayConfigured()) {
      return NextResponse.json({
        success: false,
        error: "支付宝商户凭证未配置（ALIPAY_APP_ID / ALIPAY_PRIVATE_KEY / ALIPAY_PUBLIC_KEY），当前无法发起真实支付。",
        mockMode: process.env.PAY_MODE === "mock",
      }, { status: 503 });
    }
    const base = process.env.ALIPAY_NOTIFY_URL_BASE || process.env.SITE_URL || origin || "";
    const url = buildPagePayUrl({
      outTradeNo: order.orderNo,
      totalFen: order.amountFen,
      subject: order.productName,
      returnUrl: `${base}/checkout/${order.orderNo}?paid=return`,
    });
    if (!url) return NextResponse.json({ success: false, error: "支付参数生成失败" }, { status: 500 });

    // 标记支付渠道为支付宝
    const payment = order.payments.find((p) => p.provider === "ALIPAY") ?? order.payments[0];
    if (payment) await prisma.payment.update({ where: { id: payment.id }, data: { provider: "ALIPAY", channel: "PAGE_PAY" } });

    return NextResponse.json({ success: true, data: { payUrl: url } });
  } catch (error) {
    console.error("[pay/alipay] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "发起支付失败" }, { status: 500 });
  }
}
