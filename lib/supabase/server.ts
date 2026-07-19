/**
 * Server-side Supabase client.
 *
 * Use this from Server Components, Route Handlers, and Server Actions. It
 * still uses the public anon key — RLS still applies — but reads/writes the
 * auth session via Next's `cookies()` API so the server sees the same
 * session as the browser.
 *
 * A new client is created per request (per Supabase's recommendation for
 * server environments); do not cache/reuse this across requests.
 */
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { env } from "@/config/env";

interface CookieToSet {
  name: string;
  value: string;
  options?: CookieOptions;
}

/**
 * Creates a request-scoped Supabase client bound to the current request's
 * cookies. Call this at the top of a Server Component / Route Handler /
 * Server Action — never module-level.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // `setAll` is called from a Server Component in some cases
            // (e.g. rendering, not a Route Handler/Server Action), where
            // Next disallows mutating cookies. Safe to ignore as long as
            // middleware (middleware/supabase-middleware.ts) is also
            // refreshing the session on every request.
          }
        },
      },
    }
  );
}
