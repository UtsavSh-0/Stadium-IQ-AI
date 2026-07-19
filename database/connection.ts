/**
 * Database connection lifecycle / health helpers.
 *
 * Supabase's JS client manages its own HTTP/WebSocket connections
 * internally — there's no explicit connect/disconnect step like a
 * traditional connection pool. `checkDatabaseConnection` instead performs
 * a cheap query to confirm the configured project is reachable and
 * credentials are valid, which is what `/api/health` (see
 * app/api/health/route.ts) should call.
 */
import { logger } from "@/lib/logger/logger";
import { getServerDatabaseClient } from "./client";

export interface DatabaseHealth {
  ok: boolean;
  latencyMs: number;
  error?: string;
}

/**
 * Performs a lightweight round trip to Supabase to confirm connectivity.
 * Safe to call from the health check route; does not throw.
 */
export async function checkDatabaseConnection(): Promise<DatabaseHealth> {
  const startedAt = Date.now();

  try {
    const supabase = await getServerDatabaseClient();
    const { error } = await supabase.from("stadiums").select("id", { head: true, count: "exact" });

    if (error) {
      throw error;
    }

    return { ok: true, latencyMs: Date.now() - startedAt };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    logger.error("Database health check failed", { error: message });

    // Full detail stays in the server log; callers (e.g. the public
    // /api/health route) only learn that the database is unreachable.
    return { ok: false, latencyMs: Date.now() - startedAt, error: "unreachable" };
  }
}
