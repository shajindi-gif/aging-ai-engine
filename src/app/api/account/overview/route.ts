// @ts-nocheck
// 我的订单 + 会员权益（当前登录用户）
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id || session.user.sub;

  const [orders, entitlements] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { payments: true },
    }),
    prisma.entitlement.findMany({
      where: { userId, status: "ACTIVE" },
      orderBy: { expiresAt: "asc" },
    }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      orders: orders.map((o) => ({
        orderNo: o.orderNo,
        productName: o.productName,
        amountFen: o.amountFen,
        status: o.status,
        createdAt: o.createdAt,
        paidAt: o.paidAt,
        provider: o.payments[0]?.provider,
        paymentStatus: o.payments[0]?.status,
        txnId: o.payments[0]?.providerTransactionId,
      })),
      entitlements: entitlements.map((e) => ({
        featureKey: e.featureKey,
        status: e.status,
        expiresAt: e.expiresAt,
        orderId: e.orderId,
      })),
    },
  });
}
