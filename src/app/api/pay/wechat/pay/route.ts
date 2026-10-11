// @ts-nocheck
// 发起微信 Native 支付：调微信下单接口 → code_url → 二维码（真实调用，无支付不扣款）
import { NextRequest, NextResponse } from "next/server";
import QRCode from "qrcode";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { getOrderWithPayment } from "@/lib/payments/core";
import { createNativeOrder, isWechatConfigured, getWechatNotifyUrl } from "@/lib/payments/wechat";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
  try {
    const { orderNo } = await request.json();
    if (!orderNo) return NextResponse.json({ success: false, error: "缺少订单号" }, { status: 400 });

    const order = await getOrderWithPayment(orderNo, session.user.id || session.user.sub);
    if (!order) return NextResponse.json({ success: false, error: "订单不存在" }, { status: 404 });
    if (order.status !== "PENDING") return NextResponse.json({ success: false, error: `订单状态为 ${order.status}，无法发起支付` }, { status: 400 });

    if (!isWechatConfigured()) {
      return NextResponse.json({
        success: false,
        error: "微信支付商户凭证未配置（WXPAY_MCH_ID / WXPAY_SERIAL_NO / WXPAY_PRIVATE_KEY / WXPAY_APIV3_KEY），当前无法发起真实支付。",
        mockMode: process.env.PAY_MODE === "mock",
      }, { status: 503 });
    }

    const r = await createNativeOrder(order.orderNo, order.amountFen, order.productName, getWechatNotifyUrl());
    if ("error" in r) {
      return NextResponse.json({ success: false, error: `微信下单失败（${r.error}），请稍后重试或改用支付宝` }, { status: 502 });
    }

    // code_url → 二维图（base64 PNG）
    const qrDataUrl = await QRCode.toDataURL(r.codeUrl, { width: 220, margin: 1 });

    // 标记支付渠道为微信
    const payment = order.payments.find((p) => p.provider === "WECHAT_PAY") ?? order.payments[0];
    if (payment) await prisma.payment.update({ where: { id: payment.id }, data: { provider: "WECHAT_PAY", channel: "NATIVE", prepayRef: r.codeUrl } });

    return NextResponse.json({ success: true, data: { codeUrl: r.codeUrl, qrDataUrl } });
  } catch (error) {
    console.error("[pay/wechat] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ success: false, error: "发起支付失败" }, { status: 500 });
  }
}
