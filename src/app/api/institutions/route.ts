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

    const type = searchParams.get("type");
    const province = searchParams.get("province");
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const minRating = searchParams.get("minRating");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10))
    );

    // Build Prisma where clause
    const where: Record<string, unknown> = {};

    if (type) where.type = type;
    if (province) where.province = province;
    if (city) where.city = city;
    if (search) where.name = { contains: search, mode: "insensitive" };
    if (minRating) {
      const min = parseFloat(minRating);
      if (!isNaN(min)) where.rating = { gte: min };
    }

    const [total, institutions] = await Promise.all([
      prisma.institution.count({ where }),
      prisma.institution.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          type: true,
          province: true,
          city: true,
          district: true,
          address: true,
          beds: true,
          occupancyRate: true,
          priceMin: true,
          priceMax: true,
          priceUnit: true,
          services: true,
          rating: true,
          website: true,
          establishedYear: true,
          tags: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    // If authenticated, include contact details
    const session = await auth();
    let data: unknown = institutions;

    if (session?.user) {
      data = await prisma.institution.findMany({
        where: { id: { in: institutions.map((i) => i.id) } },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json(
      { success: true, data, meta: { page, pageSize, total } },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("GET /api/institutions error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch institutions" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
