// @ts-nocheck
// 微信支付异步通知：
// 验签(微信支付公钥) → AES-GCM 解密 → 金额校验 → 幂等 → 改单+开权益
// 应答规范：成功 {"code":"SUCCESS"}，失败非 200（微信将重推）
import { NextRequest, NextResponse } from "next/server";
import { verifyWechatNotifySignature, decryptWechatResource } from "@/lib/payments/wechat";
import { handlePaidNotify } from "@/lib/payments/core";
import prisma from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const timestamp = request.headers.get("wechatpay-timestamp") || "";
    const nonce = request.headers.get("wechatpay-nonce") || "";
    const signature = request.headers.get("wechatpay-signature") || "";
    const serial = request.headers.get("wechatpay-serial") || "";
    const body = await request.text(); // 原文验签，勿先 JSON.parse

    if (!timestamp || !nonce || !signature) {
      return NextResponse.json({ code: "FAIL", message: "missing headers" }, { status: 400 });
    }

    const ok = verifyWechatNotifySignature(timestamp, nonce, body, signature, serial);
    if (!ok) {
      console.error("[pay/notify/wechat] 验签失败");
      await prisma.paymentNotifyLog.create({
        data: { provider: "WECHAT_PAY", tradeNo: "", outTradeNo: "", result: "rejected:bad_signature" },
      }).catch(() => {});
      return NextResponse.json({ code: "FAIL", message: "signature verify failed" }, { status: 401 });
    }

    const notify = JSON.parse(body);
    const resource = notify?.resource;
    if (!resource?.ciphertext) {
      return NextResponse.json({ code: "FAIL", message: "bad payload" }, { status: 400 });
    }

    const decrypted = decryptWechatResource(resource);
    // 关键字段：out_trade_no, transaction_id, trade_state, amount.total(分)
    const outTradeNo = decrypted.out_trade_no as string;
    const tradeNo = decrypted.transaction_id as string;
    const tradeState = decrypted.trade_state as string;
    const totalFen = (decrypted.amount as { total?: number })?.total;
    if (!outTradeNo || !tradeNo || totalFen == null) {
      return NextResponse.json({ code: "FAIL", message: "missing fields" }, { status: 400 });
    }

    const r = await handlePaidNotify({
      provider: "WECHAT_PAY",
      outTradeNo,
      tradeNo,
      tradeStatus: tradeState === "SUCCESS" ? "TRADE_SUCCESS" : tradeState, // 复用统一状态机
      totalAmountYuan: (totalFen / 100).toFixed(2),
      raw: { ...decrypted, event_type: notify.event_type },
    });

    if (r.ok) {
      return NextResponse.json({ code: "SUCCESS", message: r.result });
    }
    return NextResponse.json({ code: "FAIL", message: r.result }, { status: 500 });
  } catch (error) {
    console.error("[pay/notify/wechat] error:", error instanceof Error ? error.message : error);
    return NextResponse.json({ code: "FAIL", message: "internal error" }, { status: 500 });
  }
}
