// @ts-nocheck
// 我的发票申请列表
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireFreshSession } from "@/lib/authz/guard";

export async function GET() {
  const ctx = await requireFreshSession();
  if (!ctx) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  const list = await prisma.invoiceRequest.findMany({
    where: { userId: ctx.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json({
    success: true,
    data: list.map((i) => ({
      invoiceNo: i.invoiceNo, orderNo: i.orderNo, amountFen: i.amountFen,
      titleType: i.titleType, title: i.title, status: i.status,
      invoiceCode: i.invoiceCode, issuedAt: i.issuedAt, rejectReason: i.rejectReason, createdAt: i.createdAt,
    })),
  });
}
