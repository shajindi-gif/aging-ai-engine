// @ts-nocheck
// 发票申请：用户提交（仅已支付订单，金额服务端取，一单一票）
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import crypto from "crypto";
import { requireFreshSession, sameOriginOk } from "@/lib/authz/guard";

export async function POST(req: NextRequest) {
  if (!sameOriginOk(req)) return NextResponse.json({ success: false, error: "非法请求来源" }, { status: 403 });
  const ctx = await requireFreshSession();
  if (!ctx) return NextResponse.json({ success: false, error: "请先登录" }, { status: 401 });
  const { user } = ctx;

  try {
    const { orderNo, titleType, title, taxNo, email, remark } = await req.json();
    if (!orderNo || !title || !email) {
      return NextResponse.json({ success: false, error: "请填写发票抬头和接收邮箱" }, { status: 400 });
    }
    if (!["personal", "company"].includes(titleType)) {
      return NextResponse.json({ success: false, error: "抬头类型不合法" }, { status: 400 });
    }
    if (titleType === "company" && !(taxNo || "").trim()) {
      return NextResponse.json({ success: false, error: "企业抬头需填写税号" }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email))) {
      return NextResponse.json({ success: false, error: "接收邮箱格式不正确" }, { status: 400 });
    }

    // 校验订单：属于本人、已支付
    const order = await prisma.order.findFirst({ where: { orderNo, userId: user.id } });
    if (!order) return NextResponse.json({ success: false, error: "订单不存在" }, { status: 404 });
    if (order.status !== "PAID") return NextResponse.json({ success: false, error: "仅已支付订单可申请发票" }, { status: 400 });

    // 一单一票
    const exist = await prisma.invoiceRequest.findFirst({ where: { orderId: order.id } });
    if (exist) return NextResponse.json({ success: false, error: "该订单已申请过发票" }, { status: 409 });

    const invoiceNo = "INV" + Date.now().toString(36).toUpperCase() + crypto.randomBytes(3).toString("hex").toUpperCase();
    const inv = await prisma.invoiceRequest.create({
      data: {
        invoiceNo, userId: user.id, orderId: order.id, orderNo: order.orderNo,
        amountFen: order.amountFen, titleType, title: String(title).slice(0, 100),
        taxNo: taxNo ? String(taxNo).slice(0, 40) : null, email: String(email).toLowerCase().trim().slice(0, 120),
        remark: remark ? String(remark).slice(0, 200) : null, status: "PENDING",
      },
    });
    return NextResponse.json({ success: true, data: { invoiceNo: inv.invoiceNo, amountFen: inv.amountFen }, message: "申请已提交，电子发票将在 3-5 个工作日内发送至你的邮箱" }, { status: 201 });
  } catch (e) {
    console.error("[invoice/request] error:", e instanceof Error ? e.message : e);
    return NextResponse.json({ success: false, error: "提交失败，请稍后重试" }, { status: 500 });
  }
}
