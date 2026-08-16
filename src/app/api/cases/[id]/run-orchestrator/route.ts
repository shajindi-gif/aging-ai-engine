import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { runSilverCareOrchestrator } from "@/lib/agents/orchestrator";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

// Allow up to 150s for the orchestrator (Next.js route timeout)
export const maxDuration = 150;

/**
 * POST /api/cases/[id]/run-orchestrator
 * Trigger the SilverCare orchestrator for a case.
 *
 * Runs all 7 agents end-to-end and returns the full OrchestrationResult.
 * Includes a 120-second timeout safeguard — returns partial results if exceeded.
 */
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Verify case exists and belongs to the authenticated user
    const caseRecord = await prisma.case.findUnique({
      where: { id },
      select: { id: true, userId: true, elderlyId: true },
    });

    if (!caseRecord) {
      return NextResponse.json(
        { success: false, error: "Case not found" },
        { status: 404 }
      );
    }

    if (caseRecord.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Forbidden: case does not belong to you" },
        { status: 403 }
      );
    }

    if (!caseRecord.elderlyId) {
      return NextResponse.json(
        { success: false, error: "Case has no associated elderly profile" },
        { status: 400 }
      );
    }

    // Run orchestrator with a 120-second timeout safeguard
    const TIMEOUT_MS = 120_000;

    const orchestratorPromise = runSilverCareOrchestrator(
      session.user.id,
      caseRecord.elderlyId,
      { existingCaseId: caseRecord.id }
    );

    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(
        () => reject(new Error("ORCHESTRATOR_TIMEOUT")),
        TIMEOUT_MS
      );
    });

    try {
      const result = await Promise.race([orchestratorPromise, timeoutPromise]);

      return NextResponse.json({
        success: true,
        data: result,
      });
    } catch (timeoutError: unknown) {
      if (
        timeoutError instanceof Error &&
        timeoutError.message === "ORCHESTRATOR_TIMEOUT"
      ) {
        // Return partial results: fetch whatever the orchestrator has saved so far
        const partialCase = await prisma.case.findUnique({
          where: { id: caseRecord.id },
          include: {
            elderly: true,
            agentRuns: {
              orderBy: { startTime: "desc" },
              take: 20,
            },
          },
        });

        return NextResponse.json(
          {
            success: false,
            error: "Orchestrator timed out after 120 seconds",
            data: {
              caseId: caseRecord.id,
              status: "PARTIAL",
              partialCase,
              message:
                "The orchestrator did not complete within the time limit. " +
                "Some agent steps may have completed — check agentRuns for details.",
            },
          },
          { status: 408 }
        );
      }

      // Re-throw unexpected errors
      throw timeoutError;
    }
  } catch (error) {
    console.error("POST /api/cases/[id]/run-orchestrator error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to run orchestrator" },
      { status: 500 }
    );
  }
}
