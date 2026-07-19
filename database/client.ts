/**
 * Database client entry point.
 *
 * The concrete provider is Supabase. Repositories should get their client
 * through the helpers here (never instantiate `@supabase/*` directly)
 * so the provider stays swappable and every access point stays subject to
 * the same auth/service-role rules.
 *
 * - `getServerDatabaseClient()` — Server Components, Route Handlers,
 *   Server Actions. RLS-scoped to the current user's session.
 * - `getAdminDatabaseClient()` — trusted server-only code that must bypass
 *   RLS (background jobs, webhooks). Throws if the service role key isn't
 *   configured.
 *
 * Client components should import `createClient` from
 * `@/lib/supabase/client` directly rather than going through this file,
 * since browser code cannot use `next/headers`.
 */
import { createClient as createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database.types";

export type DatabaseClient = Awaited<ReturnType<typeof createServerSupabaseClient>>;
export type { Database };

/**
 * Returns a request-scoped, RLS-respecting Supabase client. Call this
 * fresh per request — do not cache the result across requests.
 */
export async function getServerDatabaseClient(): Promise<DatabaseClient> {
  return createServerSupabaseClient();
}

/**
 * Returns the shared service-role Supabase client, which bypasses RLS.
 * Restricted to trusted server-only code paths — see lib/supabase/admin.ts.
 */
export function getAdminDatabaseClient() {
  return createAdminClient();
}
