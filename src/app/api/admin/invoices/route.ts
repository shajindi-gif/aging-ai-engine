// @ts-nocheck
// 管理员：发票申请列表 + 处理（开具回填发票号 / 驳回）
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { requireFreshSession, sameOriginOk } from "@/lib/authz/guard";

async function requireAdmin() {
  const ctx = await requireFreshSession();
  if (!ctx) return { denied: NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 }) };
  if (!["ADMIN", "OPERATOR"].includes(ctx.user.role)) {
    return { denied: NextResponse.json({ success: false, error: "仅管理员可访问" }, { status: 403 }) };
  }
  return { user: ctx.user };
}

export async function GET() {
  const { denied } = await requireAdmin();
  if (denied) return denied;
  const list = await prisma.invoiceRequest.findMany({
    orderBy: { createdAt: "desc" }, take: 200,
  });
  // 批量取申请人邮箱（InvoiceRequest 无关系字段，避免新增外键约束）
  const uids = [...new Set(list.map((i) => i.userId))];
  const users = await prisma.user.findMany({ where: { id: { in: uids } }, select: { id: true, email: true, name: true } });
  const umap = Object.fromEntries(users.map((u) => [u.id, u]));
  return NextResponse.json({
    success: true,
    data: list.map((i) => ({
      id: i.id, invoiceNo: i.invoiceNo, orderNo: i.orderNo, amountFen: i.amountFen,
      titleType: i.titleType, title: i.title, taxNo: i.taxNo, email: i.email, remark: i.remark,
      status: i.status, invoiceCode: i.invoiceCode, issuedAt: i.issuedAt, rejectReason: i.rejectReason,
      createdAt: i.createdAt, applicant: umap[i.userId]?.email || umap[i.userId]?.name || i.userId,
    })),
    stats: {
      pending: list.filter((i) => i.status === "PENDING").length,
      issued: list.filter((i) => i.status === "ISSUED").length,
    },
  });
}

export async function PATCH(req: NextRequest) {
  if (!sameOriginOk(req)) return NextResponse.json({ success: false, error: "非法请求来源" }, { status: 403 });
  const { denied } = await requireAdmin();
  if (denied) return denied;
  try {
    const { id, action, invoiceCode, rejectReason } = await req.json();
    if (!id || !["ISSUE", "REJECT"].includes(action)) {
      return NextResponse.json({ success: false, error: "参数不合法" }, { status: 400 });
    }
    const cur = await prisma.invoiceRequest.findUnique({ where: { id } });
    if (!cur) return NextResponse.json({ success: false, error: "申请不存在" }, { status: 404 });
    if (cur.status !== "PENDING") return NextResponse.json({ success: false, error: "该申请已处理" }, { status: 409 });

    if (action === "ISSUE") {
      if (!String(invoiceCode || "").trim()) return NextResponse.json({ success: false, error: "请填写发票号码" }, { status: 400 });
      const updated = await prisma.invoiceRequest.update({
        where: { id }, data: { status: "ISSUED", invoiceCode: String(invoiceCode).trim().slice(0, 60), issuedAt: new Date() },
      });
      await prisma.authAuditLog.create({ data: { event: "invoice_issued", userId: cur.userId, success: true, meta: { invoiceNo: cur.invoiceNo } } });
      return NextResponse.json({ success: true, data: { status: updated.status } });
    }
    // REJECT
    if (!String(rejectReason || "").trim()) return NextResponse.json({ success: false, error: "请填写驳回原因" }, { status: 400 });
    const updated = await prisma.invoiceRequest.update({
      where: { id }, data: { status: "REJECTED", rejectReason: String(rejectReason).trim().slice(0, 200) },
    });
    await prisma.authAuditLog.create({ data: { event: "invoice_rejected", userId: cur.userId, success: true, meta: { invoiceNo: cur.invoiceNo } } });
    return NextResponse.json({ success: true, data: { status: updated.status } });
  } catch (e) {
    console.error("[admin/invoices] error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ success: false, error: "操作失败" }, { status: 500 });
  }
}
