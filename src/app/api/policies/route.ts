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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const level = searchParams.get("level");
    const province = searchParams.get("province");
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10))
    );

    // Build Prisma where clause
    const where: Record<string, unknown> = {};

    if (category) where.category = category;
    if (level) where.level = level;
    if (province) where.province = province;
    if (status) where.status = status;
    if (search) where.title = { contains: search, mode: "insensitive" };

    const [total, policies] = await Promise.all([
      prisma.policy.count({ where }),
      prisma.policy.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          category: true,
          level: true,
          province: true,
          city: true,
          department: true,
          effectiveDate: true,
          expiryDate: true,
          status: true,
          summary: true,
          tags: true,
          sourceUrl: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    // If authenticated, return full data including fullText, eligibility, etc.
    const session = await auth();
    let data: unknown = policies;

    if (session?.user) {
      data = await prisma.policy.findMany({
        where: { id: { in: policies.map((p) => p.id) } },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(
      { success: true, data, meta: { page, pageSize, total } },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("GET /api/policies error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch policies" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
