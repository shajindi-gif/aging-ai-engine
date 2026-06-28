// @ts-nocheck
import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/api-response";
import { mockSalesLeads } from "@/lib/mock";

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

    let filtered = (mockSalesLeads ?? []) as any[];

    if (followUpStatus) {
      filtered = filtered.filter((l) => l.status === followUpStatus);
    }

    if (leadType) {
      filtered = filtered.filter((l) => l.source === leadType);
    }

    return apiSuccess(filtered);
  } catch (error) {
    return apiError("获取线索列表失败", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newLead = {
      ...body,
      id: `lead-${Date.now()}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };

    return apiSuccess(newLead);
  } catch (error) {
    return apiError("创建线索失败", 400);
  }
}
