import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";

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

    const policy = await prisma.policy.findUnique({
      where: { id },
    });

    if (!policy) {
      return NextResponse.json(
        { success: false, error: `Policy ${id} not found` },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Authenticated users get full details; public users skip fullText
    const session = await auth();

    if (!session?.user) {
      const { fullText, ...publicPolicy } = policy;
      return NextResponse.json(
        { success: true, data: publicPolicy },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, data: policy },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("GET /api/policies/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch policy details" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
