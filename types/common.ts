/**
 * Cross-cutting types shared across services/repositories/middleware.
 * Feature-specific types stay in their own files (types/crowd.ts,
 * types/analytics.ts, etc.) — this file is only for generic building
 * blocks.
 */

export type ID = string;

export interface AuthenticatedUser {
  id: ID;
  email: string;
  roles: Role[];
}

export type Role = "admin" | "operator" | "volunteer" | "fan";

export interface RequestContext {
  user?: AuthenticatedUser;
  requestId: string;
}
