/**
 * PUBLIC environment variables — safe for the browser bundle.
 *
 * Only NEXT_PUBLIC_* values may live here. This module is imported by
 * client components, middleware, and server code alike; anything secret
 * belongs in `config/env.ts` (which is guarded by `server-only` and can
 * never be bundled into client code).
 */
import { z } from "zod";

const publicEnvSchema = z.object({
  // Public (browser-safe) values. Exposed to the client bundle by Next.js
  // because of the NEXT_PUBLIC_ prefix — never put secrets here. Data
  // access with the anon key is protected by Row Level Security.
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required"),
});

export type PublicEnv = z.infer<typeof publicEnvSchema>;

function loadPublicEnv(): PublicEnv {
  // Each variable must be referenced as a literal `process.env.NEXT_PUBLIC_X`
  // expression — Next.js inlines NEXT_PUBLIC_* into the browser bundle by
  // string replacement, and passing `process.env` wholesale defeats it.
  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });

  if (!parsed.success) {
    const formatted = parsed.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");

    throw new Error(
      `Invalid public environment variables:\n${formatted}\n\nCheck your .env.local against .env.example`
    );
  }

  return parsed.data;
}

/** Validated, browser-safe environment variables. */
export const publicEnv = loadPublicEnv();
