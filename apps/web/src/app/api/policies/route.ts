// ═══════════════════════════════════════════════
// 衍策银龄 AI — 政策数据 API
// GET: 查询政策列表,支持 category 和 province 过滤
// POST: 创建新政策(模拟)
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockPolicies } from "@/lib/mock";
import type { Policy } from "@/lib/types";

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

/** GET /api/policies — 获取政策列表 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const province = searchParams.get("province");

    let filtered: Policy[] = [...mockPolicies];

    if (category) {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (province) {
      filtered = filtered.filter(
        (p) => p.province === province || p.province === "全国"
      );
    }

    return NextResponse.json(
      { data: filtered, total: filtered.length },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[policies] GET error:", error);
    return NextResponse.json(
      { error: "获取政策列表失败,请稍后重试" },
      { status: 500, headers: corsHeaders }
    );
  }
}

/** POST /api/policies — 创建新政策(模拟) */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 模拟创建政策,返回生成的 ID
    const newPolicy = {
      ...body,
      id: `pol-${Date.now()}`,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { data: newPolicy, message: "政策创建成功" },
      { status: 201, headers: corsHeaders }
    );
  } catch (error) {
    console.error("[policies] POST error:", error);
    return NextResponse.json(
      { error: "创建政策失败,请检查请求参数" },
      { status: 400, headers: corsHeaders }
    );
  }
}
