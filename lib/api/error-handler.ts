/**
 * Global error handler for API routes.
 *
 * Translates any thrown error (AppError subclasses, Zod errors, or
 * unknown exceptions) into the standardized `ApiErrorResponse` shape,
 * and logs it appropriately. Route handlers should not need their own
 * try/catch for this — wrap them with `createApiHandler` (see
 * lib/api/route-handler.ts), which calls this internally.
 */
import { ZodError } from "zod";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger/logger";
import { errorResponse } from "./response";

export function handleApiError(error: unknown) {
  // Known, operational application error.
  if (error instanceof AppError) {
    logger.warn(error.message, { code: error.code, details: error.details });
    return errorResponse(error.message, error.statusCode, error.code, error.details);
  }

  // Request validation error from Zod.
  if (error instanceof ZodError) {
    logger.warn("Validation error", { issues: error.issues });
    return errorResponse(
      "Validation failed",
      422,
      "VALIDATION_ERROR",
      error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }))
    );
  }

  // Unknown/unexpected error — log with full detail, never leak internals to the client.
  const err = error instanceof Error ? error : new Error(String(error));
  logger.error("Unhandled error", { message: err.message, stack: err.stack });

  return errorResponse("An unexpected error occurred", 500, "INTERNAL_ERROR");
}
