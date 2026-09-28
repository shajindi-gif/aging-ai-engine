// ═══════════════════════════════════════════════
// 支付核心逻辑：下单 / 回调落库（幂等）/ 权益开通
// 服务端可信：金额只取商品目录；回调必须校验金额与订单号
// ═══════════════════════════════════════════════

import crypto from "crypto";
import prisma from "@/lib/db";
import { getProduct, type PayProduct } from "./products";

export function generateOrderNo(): string {
  const t = Date.now().toString(36).toUpperCase();
  const r = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `YL${t}${r}`; // 支付宝 out_trade_no 要求 64 位内，字母数字
}

export async function createOrder(userId: string, productId: string) {
  const product: PayProduct | null = getProduct(productId);
  if (!product || !product.active) return { error: "商品不存在或未开放购买" as const };

  const orderNo = generateOrderNo();
  const order = await prisma.order.create({
    data: {
      orderNo,
      userId,
      type: "ONE_TIME",
      productName: product.name,
      amount: product.amountFen / 100,
      amountFen: product.amountFen,
      status: "PENDING",
      items: { productId: product.id, featureKey: product.featureKey, durationDays: product.durationDays },
      expireAt: new Date(Date.now() + 15 * 60 * 1000),
    },
  });
  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      provider: "ALIPAY",
      amount: product.amountFen / 100,
      amountFen: product.amountFen,
      status: "PENDING",
      channel: "PAGE_PAY",
    },
  });
  return { order, payment, product };
}

export interface NotifyHandleInput {
  provider: "ALIPAY" | "WECHAT_PAY" | "MOCK";
  outTradeNo: string;
  tradeNo: string;
  tradeStatus: string;        // 支付宝: TRADE_SUCCESS / TRADE_FINISHED
  totalAmountYuan: string;    // 回调金额（元，字符串）
  raw: Record<string, unknown>;
}

/**
 * 处理支付成功通知：
 * 1. 幂等（PaymentNotifyLog 去重 + Payment 状态判断）
 * 2. 金额校验（回调金额 === 订单 amountFen/100）
 * 3. 订单 PAID → Payment SUCCESS → 开通 Entitlement
 * 返回给渠道的应答语义：ok=true 应答 success
 */
export async function handlePaidNotify(input: NotifyHandleInput): Promise<{ ok: boolean; result: string; reason?: string }> {
  const order = await prisma.order.findUnique({ where: { orderNo: input.outTradeNo }, include: { payments: true } });
  if (!order) {
    await prisma.paymentNotifyLog.create({ data: { provider: input.provider, tradeNo: input.tradeNo, outTradeNo: input.outTradeNo, result: "rejected:order_not_found" } });
    return { ok: true, result: "rejected:order_not_found" }; // 应答成功避免无限重推，但记录拒绝原因
  }

  // 金额校验
  const expectYuan = order.amountFen / 100;
  const gotYuan = Number(input.totalAmountYuan);
  if (!Number.isFinite(gotYuan) || Math.abs(gotYuan - expectYuan) > 0.001) {
    await prisma.paymentNotifyLog.create({ data: { provider: input.provider, tradeNo: input.tradeNo, outTradeNo: input.outTradeNo, result: `rejected:amount_mismatch(expect=${expectYuan},got=${input.totalAmountYuan})` } });
    return { ok: false, result: "rejected:amount_mismatch", reason: `金额不符 期望${expectYuan} 实收${input.totalAmountYuan}` };
  }

  const success = input.tradeStatus === "TRADE_SUCCESS" || input.tradeStatus === "TRADE_FINISHED";
  if (!success) {
    await prisma.paymentNotifyLog.create({ data: { provider: input.provider, tradeNo: input.tradeNo, outTradeNo: input.outTradeNo, result: `ignored:status_${input.tradeStatus}` } });
    return { ok: true, result: `ignored:${input.tradeStatus}` };
  }

  // 幂等：该交易号已处理过
  const payment = order.payments.find((p) => p.provider === input.provider) ?? order.payments[0];
  if (!payment) {
    await prisma.paymentNotifyLog.create({ data: { provider: input.provider, tradeNo: input.tradeNo, outTradeNo: input.outTradeNo, result: "rejected:payment_not_found" } });
    return { ok: false, result: "rejected:payment_not_found" };
  }
  const dupByTxn = await prisma.payment.findFirst({ where: { providerTransactionId: input.tradeNo, status: "SUCCESS" } });
  const alreadyPaid = payment.status === "SUCCESS" || order.status === "PAID" || !!dupByTxn;
  if (alreadyPaid) {
    await prisma.paymentNotifyLog.create({ data: { provider: input.provider, tradeNo: input.tradeNo, outTradeNo: input.outTradeNo, result: "duplicate", payloadHash: hash(input.raw) } });
    return { ok: true, result: "duplicate" };
  }

  // 事务：改单 + 开权益 + 记录通知
  const items = (order.items ?? {}) as { featureKey?: string; durationDays?: number };
  const featureKey = items.featureKey || "silvercare.pro";
  const durationDays = items.durationDays || 30;

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        providerTransactionId: input.tradeNo,
        paidAt: new Date(),
        notifyRaw: input.raw as object,
      },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: { status: "PAID", paidAt: new Date() },
    }),
    prisma.entitlement.create({
      data: {
        userId: order.userId,
        productId: (order.items as { productId?: string })?.productId ?? null,
        orderId: order.id,
        featureKey,
        status: "ACTIVE",
        expiresAt: new Date(Date.now() + durationDays * 86400000),
      },
    }),
    prisma.paymentNotifyLog.create({
      data: { provider: input.provider, tradeNo: input.tradeNo, outTradeNo: input.outTradeNo, handled: true, result: "processed", payloadHash: hash(input.raw) },
    }),
  ]);

  return { ok: true, result: "processed" };
}

function hash(obj: unknown): string {
  try {
    return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex").slice(0, 32);
  } catch {
    return "";
  }
}

export async function getOrderWithPayment(orderNo: string, userId?: string) {
  const order = await prisma.order.findUnique({ where: { orderNo }, include: { payments: true } });
  if (!order) return null;
  if (userId && order.userId !== userId) return null; // 越权防护
  return order;
}
