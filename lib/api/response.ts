/**
 * Helpers for building consistent `ApiResponse` payloads from route
 * handlers. Use these instead of hand-rolling `NextResponse.json(...)`
 * so every endpoint returns the same envelope shape.
 */
import { NextResponse } from "next/server";
import type { ApiMeta, ApiResponse } from "@/types/api";

export function successResponse<T>(
  data: T,
  status = 200,
  meta?: ApiMeta
): NextResponse<ApiResponse<T>> {
  return NextResponse.json(
    {
      success: true,
      data,
      ...(meta ? { meta } : {}),
    },
    { status }
  );
}

export function errorResponse(
  message: string,
  status = 500,
  code = "INTERNAL_ERROR",
  details?: unknown
): NextResponse<ApiResponse<never>> {
  return NextResponse.json(
    {
      success: false,
      error: { code, message, details },
    },
    { status }
  );
}
