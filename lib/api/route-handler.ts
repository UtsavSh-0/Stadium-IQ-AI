/**
 * Wraps a Next.js App Router API handler with centralized try/catch,
 * error handling, and response formatting.
 *
 * Usage:
 *   export const GET = createApiHandler(async (req, ctx) => {
 *     const data = await someService.doSomething();
 *     return successResponse(data);
 *   });
 */
import { NextRequest, NextResponse } from "next/server";
import type { ApiResponse } from "@/types/api";
import { handleApiError } from "./error-handler";

export type RouteContext<Params = Record<string, string>> = {
  params: Promise<Params>;
};

export type ApiHandler<Params = Record<string, string>> = (
  request: NextRequest,
  context: RouteContext<Params>
) => Promise<NextResponse<ApiResponse<unknown>>>;

export function createApiHandler<Params = Record<string, string>>(
  handler: ApiHandler<Params>
): ApiHandler<Params> {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleApiError(error);
    }
  };
}
