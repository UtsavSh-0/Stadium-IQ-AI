/**
 * Shared auth/routing constants.
 *
 * Single source of truth for role → landing-page mapping and demo
 * credentials, used by both the middleware (server) and the auth screen
 * (client). Keep the two sides in sync by editing only this file.
 */
import type { Role } from "@/types/common";

/** Where each role lands after a successful sign-in. */
export const ROLE_HOME: Record<Role, string> = {
  admin: "/dashboard",
  operator: "/dashboard",
  volunteer: "/dashboard",
  fan: "/fan",
};

export const DEFAULT_HOME = "/dashboard";

export function homeForRole(role: Role | null | undefined): string {
  return role && ROLE_HOME[role] ? ROLE_HOME[role] : DEFAULT_HOME;
}

export interface DemoAccountCredentials {
  label: string;
  email: string;
  password: string;
}

/** Demo accounts surfaced on the login screen for judges/reviewers. */
export const DEMO_ACCOUNTS: readonly DemoAccountCredentials[] = [
  {
    label: "Operations Manager",
    email: "ops.demo@stadiumiq.ai",
    password: "Demo@123",
  },
  { label: "Fan", email: "fan.demo@stadiumiq.ai", password: "Demo@123" },
];
