/**
 * Admin (service-role) Supabase client.
 *
 * Bypasses Row Level Security entirely. Only ever import this from trusted
 * server-only code paths (background jobs, webhooks, admin-only route
 * handlers that have already performed their own authorization check) —
 * never from a client component, and never return this client or its
 * results directly to an unprivileged caller without filtering.
 *
 * Guarded by an explicit check so accidentally bundling this into client
 * code fails loudly (missing service role key) rather than silently
 * leaking privileged access.
 */
import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { env } from "@/config/env";

let adminClient: ReturnType<typeof createSupabaseClient<Database>> | undefined;

export function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not set. The admin client must not be used without it."
    );
  }

  if (adminClient) {
    return adminClient;
  }

  adminClient = createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return adminClient;
}
