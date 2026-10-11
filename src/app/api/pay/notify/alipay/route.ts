// @ts-nocheck
// 支付宝异步通知（POST form）：
// RSA2 验签 → 金额/订单号校验 → 幂等 → 改单+开权益 → 应答纯文本 "success"
import { NextRequest, NextResponse } from "next/server";
import { verifyNotifySign, isAlipayConfigured } from "@/lib/payments/alipay";
import { handlePaidNotify } from "@/lib/payments/core";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    if (!isAlipayConfigured()) {
      return new NextResponse("alipay not configured", { status: 503 });
    }
    const form = await request.formData();
    const params: Record<string, string> = {};
    for (const [k, v] of form.entries()) params[k] = String(v);

    const ok = verifyNotifySign(params);
    if (!ok) {
      console.error("[pay/notify/alipay] 验签失败 out_trade_no=%s", params.out_trade_no);
      await prisma.paymentNotifyLog.create({
        data: { provider: "ALIPAY", tradeNo: params.trade_no || "", outTradeNo: params.out_trade_no || "", result: "rejected:bad_signature" },
      }).catch(() => {});
      return new NextResponse("fail", { status: 400 });
    }

    const r = await handlePaidNotify({
      provider: "ALIPAY",
      outTradeNo: params.out_trade_no,
      tradeNo: params.trade_no,
      tradeStatus: params.trade_status || "",
      totalAmountYuan: params.total_amount || "",
      raw: params,
    });

    // 支付宝要求：处理成功应答纯文本 "success"；失败应答其他内容以便重推
    return new NextResponse(
      r.ok && (r.result === "processed" || r.result === "duplicate" || r.result.startsWith("ignored")) ? "success" : "fail",
      { status: 200, headers: { "Content-Type": "text/plain" } }
    );
  } catch (error) {
    console.error("[pay/notify/alipay] error:", error instanceof Error ? error.message : error);
    return new NextResponse("fail", { status: 500 });
  }
}
