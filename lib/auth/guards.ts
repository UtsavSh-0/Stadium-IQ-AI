/**
 * Authentication / authorization guards for Server Components and Server
 * Actions.
 *
 * The root `middleware.ts` handles redirect-level route protection (sending
 * unauthenticated users to /login and authenticated users away from auth
 * pages). These guards provide request-scoped authorization for Server
 * Components / Server Actions / Route Handlers that need the current user or
 * a required role inside their logic.
 *
 * Usage in a Server Component:
 *
 *   const user = await requireUser();
 *   const user = await requireRole(["admin", "operator"]);
 *
 * Usage for an optional-auth page:
 *
 *   const user = await getCurrentUser(); // null if signed out
 */
import type { AuthenticatedUser, Role } from "@/types/common";
import type { Database } from "@/types/database.types";
import { ForbiddenError, UnauthorizedError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";

/**
 * Returns the current authenticated user's app profile, or `null` if
 * signed out. Never throws on missing auth — use `requireUser` for that.
 */
export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return null;
  }

  const { data: profile } = await supabase
    .from("users")
    .select("id, email, role")
    .eq("auth_user_id", authUser.id)
    .single<Pick<Database["public"]["Tables"]["users"]["Row"], "id" | "email" | "role">>();

  if (!profile) {
    return null;
  }

  return { id: profile.id, email: profile.email, roles: [profile.role] };
}

/** Throws `UnauthorizedError` if there is no signed-in user. */
export async function requireUser(): Promise<AuthenticatedUser> {
  const user = await getCurrentUser();

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

/**
 * Throws `UnauthorizedError` if signed out, `ForbiddenError` if signed in
 * but lacking one of `allowedRoles`.
 */
export async function requireRole(allowedRoles: Role[]): Promise<AuthenticatedUser> {
  const user = await requireUser();

  if (!user.roles.some((role) => allowedRoles.includes(role))) {
    throw new ForbiddenError();
  }

  return user;
}

/** Convenience check that doesn't throw — for conditionally rendering UI. */
export function hasRole(user: AuthenticatedUser | null, allowedRoles: Role[]): boolean {
  return !!user && user.roles.some((role) => allowedRoles.includes(role));
}
