/**
 * SERVER-ONLY environment variable validation.
 *
 * Centralizes and validates all secret/server configuration so the rest of
 * the codebase never touches `process.env` directly. Import `env` from any
 * server-side code (Route Handlers, Server Components, services).
 *
 * Guarded by `server-only`: importing this module from a client component
 * fails the build instead of silently leaking secrets into the browser
 * bundle. Client components and middleware that only need the public
 * Supabase values must import `publicEnv` from `config/env.public.ts`.
 *
 * Add new variables to `envSchema` below as backend features are built.
 * The app fails fast at startup (with a clear message) if a required
 * variable is missing or malformed, instead of failing later at runtime.
 */
import "server-only";
import { z } from "zod";
import { publicEnv } from "./env.public";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  // Base URL of the app, used for building absolute links/callbacks.
  APP_URL: z.string().url().optional(),

  // --- Supabase (server-only secrets) ------------------------------------
  // Bypasses Row Level Security — must never be sent to the browser or
  // referenced from a client component. Optional so the app can run without
  // admin features; lib/supabase/admin.ts throws if used while unset.
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required")
    .optional(),

  // Direct Postgres connection string, used by migration tooling rather
  // than application code (which talks to Supabase via the JS client).
  SUPABASE_DB_URL: z.string().min(1).optional(),

  // --- AI / Gemini (server-only, not yet in use) --------------------------
  // Reserved for the upcoming Gemini integration. The key is read and
  // validated here so that when services/ai is implemented it has exactly
  // one, server-only place to get it from. NEVER prefix with NEXT_PUBLIC_.
  GEMINI_API_KEY: z.string().min(1).optional(),
  // Model is configuration, not code — override per environment.
  AI_MODEL: z.string().default("gemini-2.0-flash"),
  // Hard ceiling on tokens per response, to bound cost.
  AI_MAX_OUTPUT_TOKENS: z.coerce.number().int().positive().default(1024),

  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("info"),
});

export type Env = z.infer<typeof envSchema> & typeof publicEnv;

function loadEnv(): Env {
  // Read each variable explicitly rather than passing the whole `process.env`
  // object (see config/env.public.ts for why).
  const parsed = envSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    APP_URL: process.env.APP_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_DB_URL: process.env.SUPABASE_DB_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    AI_MODEL: process.env.AI_MODEL,
    AI_MAX_OUTPUT_TOKENS: process.env.AI_MAX_OUTPUT_TOKENS,
    LOG_LEVEL: process.env.LOG_LEVEL,
  });

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Invalid environment variables:\n${formatted}\n\nCheck your .env.local against .env.example`
    );
  }

  // Merge in the validated public vars so server code has a single import.
  return { ...parsed.data, ...publicEnv };
}

/**
 * Validated, typed environment variables (server-only).
 * Throws at import time if required variables are missing/invalid.
 */
export const env = loadEnv();
