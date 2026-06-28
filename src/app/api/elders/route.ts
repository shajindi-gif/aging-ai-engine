// @ts-nocheck
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { mockElders } from "@/lib/mock";

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
    const careLevel = searchParams.get("careLevel");
    const livingStatus = searchParams.get("livingStatus");
    const region = searchParams.get("region");

    let filtered = (mockElders ?? []) as any[];

    if (careLevel) {
      filtered = filtered.filter((e) => e.careLevel === careLevel);
    }

    if (livingStatus) {
      filtered = filtered.filter((e) => e.serviceType === livingStatus);
    }

    if (region) {
      filtered = filtered.filter(
        (e) => e.province === region || e.city === region
      );
    }

    return apiSuccess(filtered);
  } catch (error) {
    return apiError("获取老人列表失败", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newElder = {
      ...body,
      id: `eld-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return apiSuccess(newElder, { source: "mock" });
  } catch (error) {
    return apiError("创建老人档案失败", 400);
  }
}
