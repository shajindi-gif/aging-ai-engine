// @ts-nocheck
// ═══════════════════════════════════════════════
// 衍策银龄 AI — 线索 API (Prisma)
// GET: 获取线索列表 (alias for sales-leads)
// POST: 创建新线索
// ═══════════════════════════════════════════════

import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import prisma from "@/lib/db";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const followUpStatus = searchParams.get("followUpStatus");
    const leadType = searchParams.get("leadType");

    const where: Record<string, unknown> = {};
    if (followUpStatus) where.status = followUpStatus.toUpperCase();
    if (leadType) where.source = leadType.toUpperCase();

    const leads = await prisma.salesLead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { institution: true },
    });

    return apiSuccess(leads, { source: "database" });
  } catch (error) {
    console.error("[leads] GET error:", error);
    return apiError("获取线索列表失败", 500);
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

    return apiSuccess(lead, { source: "database" });
  } catch (error) {
    console.error("[leads] POST error:", error);
    return apiError("创建线索失败", 400);
  }
}
