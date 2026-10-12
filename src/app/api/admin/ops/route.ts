// @ts-nocheck
// 管理后台数据：订单/支付/通知日志（仅 ADMIN 角色）
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  // 角色校验：ADMIN 或 OPERATOR
  const role = (session.user as any).role || (session.user as any).userRole;
  if (!["ADMIN", "OPERATOR"].includes(role)) {
    return NextResponse.json({ success: false, error: "仅管理员可访问" }, { status: 403 });
  }

  const [orders, payments, notifyLogs, userCount, activeEntitlements] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { payments: true, user: { select: { email: true, name: true } } } }),
    prisma.payment.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.paymentNotifyLog.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    prisma.user.count(),
    prisma.entitlement.count({ where: { status: "ACTIVE" } }),
  ]);

  return NextResponse.json({
    success: true,
    data: {
      stats: {
        totalOrders: orders.length,
        paidOrders: orders.filter((o) => o.status === "PAID").length,
        revenueFen: orders.filter((o) => o.status === "PAID").reduce((s, o) => s + o.amountFen, 0),
        users: userCount,
        activeEntitlements,
      },
      orders: orders.map((o) => ({
        orderNo: o.orderNo,
        user: o.user?.email || o.user?.name || o.userId,
        productName: o.productName,
        amountFen: o.amountFen,
        status: o.status,
        createdAt: o.createdAt,
        provider: o.payments[0]?.provider,
        txnId: o.payments[0]?.providerTransactionId,
      })),
      notifyLogs: notifyLogs.map((l) => ({
        provider: l.provider,
        outTradeNo: l.outTradeNo,
        tradeNo: l.tradeNo,
        result: l.result,
        handled: l.handled,
        createdAt: l.createdAt,
      })),
    },
  });
}
