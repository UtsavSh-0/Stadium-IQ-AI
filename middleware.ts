/**
 * Root Next.js middleware.
 *
 * Refreshes the Supabase auth session cookie on every matched request (see
 * lib/supabase/middleware.ts for why this has to happen here rather than
 * in a Server Component), then enforces route protection:
 *
 *   - Unauthenticated users hitting a protected route are redirected to
 *     /login (with a ?redirect= back-link).
 *   - Authenticated users hitting an auth page (/login, /signup) are
 *     redirected to their role's landing area.
 *   - Users lacking the required role for a section (e.g. a fan opening
 *     /dashboard) are redirected to their own landing area.
 *
 * Defense in depth: this redirect layer is UX-level protection only. The
 * real enforcement is (1) Row Level Security in Postgres and (2) the
 * `requireRole` guards in Server Components / Route Handlers
 * (lib/auth/guards.ts). Never rely on middleware alone for authorization.
 */
import { NextResponse, type NextRequest } from "next/server";
import type { Role } from "@/types/common";
import { updateSession } from "@/lib/supabase/middleware";
import { ROLE_HOME, homeForRole } from "@/lib/constants/auth";

const AUTH_PAGES = ["/login", "/signup"];

/** Routes that require any authenticated user. */
const PROTECTED_PREFIXES = [
  "/dashboard",
  "/fan",
  "/admin",
  "/volunteer",
  "/operations",
];

/**
 * Role allow-list per section. A prefix not listed here only requires
 * authentication. Staff roles may access the operations dashboard; fans
 * are limited to the fan companion.
 */
const ROLE_PROTECTED_PREFIXES: Record<string, Role[]> = {
  "/dashboard": ["admin", "operator", "volunteer"],
  "/admin": ["admin"],
  "/operations": ["admin", "operator"],
  "/volunteer": ["admin", "operator", "volunteer"],
};

function isExactOrUnder(pathname: string, base: string): boolean {
  return pathname === base || pathname.startsWith(`${base}/`);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { response, user, role } = await updateSession(request);

  const isAuthPage = AUTH_PAGES.some((p) => isExactOrUnder(pathname, p));
  const isProtected = PROTECTED_PREFIXES.some((p) =>
    isExactOrUnder(pathname, p)
  );

  // Unauthenticated → protected route: send to login.
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?redirect=${encodeURIComponent(pathname)}`;
    return NextResponse.redirect(url);
  }

  // Authenticated → auth page: send to their landing area.
  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = role && ROLE_HOME[role] ? ROLE_HOME[role] : "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Authenticated but wrong role for this section → send to their own home.
  if (user) {
    const requiredRoles = Object.entries(ROLE_PROTECTED_PREFIXES).find(
      ([prefix]) => isExactOrUnder(pathname, prefix)
    )?.[1];

    // A signed-in auth user with no app profile row yet (trigger lag or
    // deleted profile) gets no role — treat as insufficient for staff areas
    // and fall back to the least-privileged area, not the staff default.
    if (requiredRoles && (!role || !requiredRoles.includes(role))) {
      const url = request.nextUrl.clone();
      url.pathname = role ? homeForRole(role) : "/fan";
      url.search = "";
      // Avoid a redirect loop if their own home is the page they were denied.
      if (url.pathname !== pathname && !isExactOrUnder(pathname, url.pathname)) {
        return NextResponse.redirect(url);
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static, _next/image (Next.js internals)
     * - favicon.ico and common static asset extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
