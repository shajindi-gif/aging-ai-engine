// @ts-nocheck
// ═══════════════════════════════════════════════
// 衍策银龄 AI — 健康档案 API
// GET: 获取老人列表,支持 ?id=X 获取单个档案
// ═══════════════════════════════════════════════

import { NextRequest, NextResponse } from "next/server";
import { mockElderly } from "@/lib/mock";

/** CORS 通用响应头 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

/** 处理 OPTIONS 预检请求 */
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

/** GET /api/health-records — 获取老人档案 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // 按 ID 查询单个档案
    if (id) {
      const elderly = mockElderly.find((e) => e.id === id);
      if (!elderly) {
        return NextResponse.json(
          { error: `未找到 ID 为 ${id} 的老人档案` },
          { status: 404, headers: corsHeaders }
        );
      }
      return NextResponse.json(
        { data: elderly },
        { headers: corsHeaders }
      );
    }

    // 返回所有档案列表
    return NextResponse.json(
      { data: mockElderly, total: mockElderly.length },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[health-records] GET error:", error);
    return NextResponse.json(
      { error: "获取健康档案失败,请稍后重试" },
      { status: 500, headers: corsHeaders }
    );
  }
}
