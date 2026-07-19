/**
 * Browser-side Supabase client.
 *
 * Use this from client components ("use client") only. It uses the public
 * anon key, so all data access it performs is subject to Row Level
 * Security — this client can never bypass RLS regardless of what code
 * calls it, which is what makes it safe to use in the browser bundle.
 *
 * Session storage/refresh is handled automatically by @supabase/ssr using
 * browser cookies, kept in sync with the server via middleware/supabase.ts.
 */
import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { publicEnv } from "@/config/env.public";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | undefined;

/**
 * Returns a singleton Supabase client for use in client components.
 * Safe to call repeatedly — the underlying client is created once per
 * page load and reused.
 */
export function createClient() {
  if (browserClient) {
    return browserClient;
  }

  browserClient = createBrowserClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return browserClient;
}
