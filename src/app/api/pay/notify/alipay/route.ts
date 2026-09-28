// @ts-nocheck
// 支付宝异步通知（POST form）：
// RSA2 验签 → 金额/订单号校验 → 幂等 → 改单+开权益 → 应答 "success"
import { NextRequest, NextResponse } from "next/server";
import { verifyNotify, getAlipayConfig } from "@/lib/payments/alipay";
import { handlePaidNotify } from "@/lib/payments/core";

export async function POST(request: NextRequest) {
  try {
    const cfg = getAlipayConfig();
    if (!cfg) {
      return new NextResponse("alipay not configured", { status: 503 });
    }
    const form = await request.formData();
    const params: Record<string, string> = {};
    for (const [k, v] of form.entries()) params[k] = String(v);

    const { ok, params: clean } = verifyNotify(params, cfg.alipayPublicKey);
    if (!ok) {
      console.error("[pay/notify/alipay] 验签失败 out_trade_no=%s", params.out_trade_no);
      await import("@/lib/db").then((m) => m.default.paymentNotifyLog.create({
        data: { provider: "ALIPAY", tradeNo: params.trade_no || "", outTradeNo: params.out_trade_no || "", result: "rejected:bad_signature" },
      })).catch(() => {});
      return new NextResponse("fail", { status: 400 });
    }

    const r = await handlePaidNotify({
      provider: "ALIPAY",
      outTradeNo: clean.out_trade_no,
      tradeNo: clean.trade_no,
      tradeStatus: clean.trade_status || "",
      totalAmountYuan: clean.total_amount || "",
      raw: clean,
    });

    // 支付宝要求：处理成功应答纯文本 "success"；失败应答其他内容以便重推（金额不符等拒绝场景不重推也需人工）
    return new NextResponse(r.ok && (r.result === "processed" || r.result === "duplicate" || r.result.startsWith("ignored")) ? "success" : "fail", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("[pay/notify/alipay] error:", error instanceof Error ? error.message : error);
    return new NextResponse("fail", { status: 500 });
  }
}
