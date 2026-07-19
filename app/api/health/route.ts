/**
 * Health-check endpoint.
 *
 * This is a reference implementation showing how future API routes
 * should be composed: `createApiHandler` for centralized error handling,
 * `successResponse` for the standardized envelope. It contains no
 * business logic — it only reports that the API layer is reachable.
 */
import { createApiHandler } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";
import { checkDatabaseConnection } from "@/database/connection";

export const GET = createApiHandler(async () => {
  const database = await checkDatabaseConnection();

  return successResponse({
    status: database.ok ? "ok" : "degraded",
    timestamp: new Date().toISOString(),
    database,
  });
});
