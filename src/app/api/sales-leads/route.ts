// @ts-nocheck
// ═══════════════════════════════════════════════
// 衍策银龄 AI — 销售线索 API (Prisma)
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "50", 10)));

    const where: Record<string, unknown> = {};
    if (status) where.status = status.toUpperCase();
    if (source) where.source = source.toUpperCase();

    const [leads, total] = await Promise.all([
      prisma.salesLead.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { institution: true },
      }),
      prisma.salesLead.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      meta: { total, page, pageSize, totalPages: Math.ceil(total / pageSize), source: "database" },
    }, { headers: corsHeaders });
  } catch (error) {
    console.error("[sales-leads] GET error:", error);
    return NextResponse.json(
      { success: false, error: "获取销售线索失败" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lead = await prisma.salesLead.create({
      data: {
        institutionId: body.institutionId,
        institutionName: body.institutionName || "",
        contactName: body.contactName,
        contactPhone: body.contactPhone,
        contactRole: body.contactRole,
        source: body.source || "REFERRAL",
        status: body.status || "NEW",
        priority: body.priority || "MEDIUM",
        estimatedValue: body.estimatedValue,
        productInterest: body.productInterest || [],
        score: body.score,
        notes: body.notes,
        assignedTo: body.assignedTo,
      },
    });

    return NextResponse.json(
      { success: true, data: lead, message: "线索创建成功" },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("[sales-leads] POST error:", error);
    return NextResponse.json(
      { success: false, error: "创建线索失败" },
      { status: 400, headers: corsHeaders }
    );
  }
}
