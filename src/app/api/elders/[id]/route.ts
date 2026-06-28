import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { mockElders, mockCareOrders } from "@/lib/mock";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const elders = (mockElders ?? []) as any[];
    const elder = elders.find((e) => e.id === id);

    if (!elder) {
      return apiError(`老人 ${id} 未找到`, 404);
    }

    // Attach recent care records
    const orders = (mockCareOrders ?? []) as any[];
    const recentRecords = orders.filter((o) => o.elderlyId === id).slice(0, 5);

    return apiSuccess({
      ...elder,
      recentCareRecords: recentRecords,
    });
  } catch (error) {
    return apiError("获取老人详情失败", 500);
  }
}
