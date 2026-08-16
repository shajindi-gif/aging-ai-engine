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

    const institution = await prisma.institution.findUnique({
      where: { id },
      include: { digitalMaturity: true },
    });

    if (!institution) {
      return NextResponse.json(
        { success: false, error: `Institution ${id} not found` },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // Authenticated users get contact details; public users don't
    const session = await auth();

    if (!session?.user) {
      const { contactName, contactPhone, licenseNo, ...publicInstitution } =
        institution;
      return NextResponse.json(
        { success: true, data: publicInstitution },
        { headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { success: true, data: institution },
      { headers: CORS_HEADERS }
    );
  } catch (error) {
    console.error("GET /api/institutions/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch institution details" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
