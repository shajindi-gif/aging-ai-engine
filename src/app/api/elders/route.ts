import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { apiSuccess, apiError } from "@/lib/api-response";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// Zod schema for creating a new elderly profile
const createElderSchema = z.object({
  name: z.string().min(1, "Name is required"),
  gender: z.enum(["MALE", "FEMALE"]).default("MALE"),
  birthDate: z.coerce.date(),
  idCard: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  careLevel: z
    .enum(["INDEPENDENT", "SEMI_DEPENDENT", "DEPENDENT", "CRITICAL"])
    .default("INDEPENDENT"),
  serviceType: z.enum(["HOME", "COMMUNITY", "INSTITUTION"]).default("HOME"),
  livingStatus: z.string().optional(),
  incomeLevel: z.string().optional(),
  disabilityLevel: z.string().optional(),
  tags: z.array(z.string()).default([]),
  organizationId: z.string().optional(),
  userId: z.string().optional(),
});

/**
 * GET /api/elders
 * List elderly profiles with filtering, search, and pagination.
 *
 * Query params:
 *  - careLevel: INDEPENDENT | SEMI_DEPENDENT | DEPENDENT | CRITICAL
 *  - province: string
 *  - city: string
 *  - search: string (partial name match)
 *  - page: number (default 1)
 *  - pageSize: number (default 20)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const careLevel = searchParams.get("careLevel");
    const province = searchParams.get("province");
    const city = searchParams.get("city");
    const search = searchParams.get("search");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("pageSize") || "20", 10)),
    );

    // Build dynamic where clause
    const where: Record<string, unknown> = {};

    if (careLevel) {
      where.careLevel = careLevel;
    }

    if (province) {
      where.province = province;
    }

    if (city) {
      where.city = city;
    }

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    const [elders, total] = await Promise.all([
      prisma.elderlyProfile.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          healthSummary: true,
          emergencyContact: true,
        },
      }),
      prisma.elderlyProfile.count({ where }),
    ]);

    return apiSuccess(elders, {
      source: "database",
      ...(({
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      }) as any),
    });
  } catch (error) {
    console.error("GET /api/elders error:", error);
    return apiError("Failed to fetch elders list", 500);
  }
}

/**
 * POST /api/elders
 * Create a new elderly profile.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return apiError("Unauthorized", 401);
    }

    const body = await request.json();

    // Validate request body with Zod
    const parsed = createElderSchema.safeParse(body);
    if (!parsed.success) {
      return apiError(
        `Validation failed: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
        400,
      );
    }

    const data = parsed.data;

    const elder = await prisma.elderlyProfile.create({
      data: {
        name: data.name,
        gender: data.gender,
        birthDate: data.birthDate,
        idCard: data.idCard,
        phone: data.phone,
        address: data.address,
        city: data.city,
        province: data.province,
        careLevel: data.careLevel,
        serviceType: data.serviceType,
        livingStatus: data.livingStatus,
        incomeLevel: data.incomeLevel,
        disabilityLevel: data.disabilityLevel,
        tags: data.tags,
        organizationId: data.organizationId,
        userId: data.userId,
      },
    });

    return apiSuccess(elder, { source: "database" });
  } catch (error) {
    console.error("POST /api/elders error:", error);
    return apiError("Failed to create elder profile", 500);
  }
}
