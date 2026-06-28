import { NextResponse } from "next/server";

export function apiSuccess(data: unknown, meta?: Partial<ApiResponseMeta>) {
  return NextResponse.json({
    success: true,
    data,
    meta: {
      project: "Aging AI Engine",
      source: "mock",
      generatedAt: new Date().toISOString(),
      humanReviewRequired: false,
      ...meta,
    },
  });
}

export function apiError(message: string, status: number = 500) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      meta: {
        project: "Aging AI Engine",
        source: "mock",
        generatedAt: new Date().toISOString(),
      },
    },
    { status }
  );
}

export interface ApiResponseMeta {
  project: string;
  source: string;
  generatedAt: string;
  humanReviewRequired: boolean;
  disclaimer?: string;
}
