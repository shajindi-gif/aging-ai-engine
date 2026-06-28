// ═══════════════════════════════════════════════
// 衍策银龄 AI — 销售线索 API
// GET: 获取线索列表,支持 status 过滤
// POST: 创建新线索(模拟)
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockSalesLeads } from "@/lib/mock";
import type { SalesLead } from "@/lib/types";

/** CORS 通用响应头 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/** 处理 OPTIONS 预检请求 */
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/** GET /api/sales-leads — 获取销售线索列表 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let filtered: SalesLead[] = [...mockSalesLeads];

    if (status) {
      filtered = filtered.filter((l) => l.status === status);
    }

    return NextResponse.json(
      { data: filtered, total: filtered.length },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[sales-leads] GET error:", error);
    return NextResponse.json(
      { error: "获取销售线索失败,请稍后重试" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/** POST /api/sales-leads — 创建新线索(模拟) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const newLead = {
      ...body,
      id: `lead-${Date.now()}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { data: newLead, message: "线索创建成功" },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("[sales-leads] POST error:", error);
    return NextResponse.json(
      { error: "创建线索失败,请检查请求参数" },
      { status: 400, headers: corsHeaders }
    );
  }
}
