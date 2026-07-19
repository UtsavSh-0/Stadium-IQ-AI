/**
 * AI provider adapter layer.
 *
 * This is the ONLY module allowed to talk to an AI provider SDK/API.
 * Everything above it (services/ai, app/api/ai) depends on the
 * `AIProvider` interface from `types/ai-server.ts`, never on a concrete
 * SDK — so integrating Gemini (or swapping it later) touches this
 * directory alone.
 *
 * Integration plan (do NOT implement until the Gemini step):
 *   1. `npm install @google/genai`
 *   2. Implement `GeminiProvider` in lib/ai/gemini.ts using
 *      `env.GEMINI_API_KEY`, `env.AI_MODEL`, `env.AI_MAX_OUTPUT_TOKENS`.
 *   3. Return it from `getAIProvider()` below.
 *
 * `server-only` guard: an AI provider holds an API key, so this module
 * must never reach the client bundle.
 */
import "server-only";
import { env } from "@/config/env";
import type { AIProvider } from "@/types/ai-server";

/** True once GEMINI_API_KEY is configured; lets callers degrade gracefully. */
export function isAIConfigured(): boolean {
  return Boolean(env.GEMINI_API_KEY);
}

/**
 * Returns the active AI provider.
 *
 * Placeholder: throws until the Gemini adapter is implemented. Callers
 * (services/ai) already handle this by returning 503 SERVICE_UNAVAILABLE,
 * so the API contract is stable before and after integration.
 */
export function getAIProvider(): AIProvider {
  throw new Error(
    "AI provider not implemented yet. Implement lib/ai/gemini.ts and wire it up here."
  );
}
