/**
 * Supabase session refresh for Next.js middleware.
 *
 * Server Components cannot write cookies, so an expired auth token can only
 * be refreshed from middleware (which runs before the response is sent and
 * can set cookies) or from a Route Handler/Server Action. This helper is
 * called once from the root `middleware.ts` on every matched request to
 * keep the session cookie fresh for both Server Components and the browser.
 *
 * IMPORTANT: keep the `getUser()` call — do not remove it or replace it
 * with `getSession()`. `getSession()` reads the (possibly stale) cookie
 * without revalidating against Supabase Auth; `getUser()` round-trips to
 * the auth server so an authenticated user is actually still valid.
 */
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { Database } from "@/types/database.types";
import { publicEnv } from "@/config/env.public";

interface CookieToSet {
  name: string;
  value: string;
  options?: CookieOptions;
}

type Role = Database["public"]["Enums"]["user_role"];

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Revalidates the session against Supabase Auth and refreshes the token
  // if needed.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: Role | undefined;

  if (user) {
    // Resolve the app-level role so route protection can redirect signed-in
    // users away from auth pages to their correct landing area. The lookup
    // is indexed (idx_users_auth_user_id) and only runs for authenticated
    // requests.
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("auth_user_id", user.id)
      .maybeSingle<{ role: Role }>();

    role = profile?.role;
  }

  return { response, user, role };
}
