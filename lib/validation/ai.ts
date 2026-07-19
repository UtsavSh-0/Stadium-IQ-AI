/**
 * Zod schemas for the AI API surface (app/api/ai/*).
 *
 * These are the trust boundary between the browser and the AI service:
 * everything is length-capped so a malicious client can't inflate token
 * spend or smuggle megabytes into a prompt.
 */
import { z } from "zod";

export const conversationCategorySchema = z.enum([
  "crowd-management",
  "emergency",
  "transport",
  "volunteer",
  "analytics",
  "general",
]);

export const supportedLanguageSchema = z.enum([
  "en",
  "es",
  "pt",
  "fr",
  "ar",
  "de",
  "ja",
  "ko",
  "hi",
  "zh",
]);

/** One prior conversation turn as sent by the client. */
export const chatTurnSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(8_000),
});

export const aiChatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message cannot be empty")
    .max(4_000, "Message is too long (max 4000 characters)"),
  history: z.array(chatTurnSchema).max(50).default([]),
  category: conversationCategorySchema.default("general"),
  language: supportedLanguageSchema.default("en"),
});

export type AIChatRequestBody = z.infer<typeof aiChatRequestSchema>;
