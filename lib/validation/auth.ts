/**
 * Zod schemas for authentication forms and requests.
 *
 * Shared between the client (auth screen validates before calling
 * Supabase, so users get instant, consistent feedback) and any future
 * server-side auth endpoints. Keep messages user-facing.
 */
import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required")
  .max(254, "Email is too long")
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password is too long");

export const fullNameSchema = z
  .string()
  .trim()
  .min(1, "Please enter your name")
  .max(120, "Name is too long")
  // Strip control characters; names never need them and it keeps stored
  // profile data clean for later display.
  .regex(/^[^\p{C}]+$/u, "Name contains invalid characters");

export const loginSchema = z.object({
  email: emailSchema,
  // Login only checks presence — never reveal password *rules* on login,
  // and existing demo accounts may predate the signup policy.
  password: z.string().min(1, "Password is required"),
});

export const signupSchema = z.object({
  fullName: fullNameSchema,
  email: emailSchema,
  password: passwordSchema,
});

export const resetPasswordSchema = z.object({
  password: passwordSchema,
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
