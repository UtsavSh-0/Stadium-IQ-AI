/**
 * Request validation helpers built on top of Zod.
 *
 * Parse and validate the JSON body, query string, or route params of an
 * incoming request against a schema. Throws `ValidationError` (caught by
 * the global error handler) on failure, so callers can assume valid,
 * typed data on success.
 */
import { NextRequest } from "next/server";
import { z, ZodSchema } from "zod";
import { ValidationError } from "@/lib/errors";

export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): Promise<T> {
  let json: unknown;

  try {
    json = await request.json();
  } catch {
    throw new ValidationError("Request body must be valid JSON");
  }

  const result = schema.safeParse(json);

  if (!result.success) {
    throw new ValidationError(
      "Invalid request body",
      result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    );
  }

  return result.data;
}

export function validateQuery<T>(
  request: NextRequest,
  schema: ZodSchema<T>
): T {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const result = schema.safeParse(params);

  if (!result.success) {
    throw new ValidationError(
      "Invalid query parameters",
      result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    );
  }

  return result.data;
}

export function validateParams<T>(
  params: Record<string, string | string[]>,
  schema: ZodSchema<T>
): T {
  const result = schema.safeParse(params);

  if (!result.success) {
    throw new ValidationError(
      "Invalid route parameters",
      result.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    );
  }

  return result.data;
}

/** Common reusable schema fragments. */
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
