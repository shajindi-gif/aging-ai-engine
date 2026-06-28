// ═══════════════════════════════════════════════
// 衍策银龄 AI — 护理订单 API
// GET: 获取订单列表,支持 status 过滤
// POST: 创建新订单(模拟)
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockCareOrders } from "@/lib/mock";
import type { CareOrder } from "@/lib/types";

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

/** GET /api/care-orders — 获取订单列表 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    let filtered: CareOrder[] = [...mockCareOrders];

    if (status) {
      filtered = filtered.filter((o) => o.status === status);
    }

    return NextResponse.json(
      { data: filtered, total: filtered.length },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[care-orders] GET error:", error);
    return NextResponse.json(
      { error: "获取订单列表失败,请稍后重试" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/** POST /api/care-orders — 创建新订单(模拟) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 生成订单号和 ID
    const now = new Date();
    const orderNo = `CO${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}${String(Math.floor(Math.random() * 999)).padStart(3, "0")}`;

    const newOrder = {
      ...body,
      id: `ord-${Date.now()}`,
      orderNo,
      status: "pending",
      familyNotified: false,
      riskEvents: [],
      createdAt: now.toISOString(),
    };

    return NextResponse.json(
      { data: newOrder, message: "订单创建成功" },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("[care-orders] POST error:", error);
    return NextResponse.json(
      { error: "创建订单失败,请检查请求参数" },
      { status: 400, headers: corsHeaders }
    );
  }
}
