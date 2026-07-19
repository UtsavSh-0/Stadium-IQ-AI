/**
 * Server-side AI contracts.
 *
 * These types define the seam between the API layer (app/api/ai/*), the
 * service layer (services/ai/*), and the provider adapter (lib/ai/*).
 * They are intentionally provider-agnostic: nothing here mentions Gemini
 * specifics, so swapping providers (or adding a second one) only touches
 * lib/ai/.
 *
 * The UI-facing chat types (AIMessage, Conversation, etc.) live in
 * `types/ai.ts` — do not mix the two: UI types follow component needs,
 * these follow the wire protocol.
 */
import type { ConversationCategory, SupportedLanguageCode } from "@/types/ai";

/** A single turn in the model conversation, provider-agnostic. */
export interface AIChatTurn {
  role: "user" | "assistant";
  content: string;
}

/** What the API route hands to the AI service after validation + auth. */
export interface AIChatRequest {
  /** The user's new message (already validated + length-capped). */
  message: string;
  /** Prior turns for context, oldest first. Capped by the service. */
  history: AIChatTurn[];
  /** Which assistant persona/prompt to use. */
  category: ConversationCategory;
  /** Language the reply should be written in. */
  language: SupportedLanguageCode;
  /** App-level user id — for logging, rate limiting, and history writes. */
  userId: string;
  /** Roles of the caller — prompts may differ for staff vs fans. */
  roles: string[];
}

export interface AIChatResponse {
  /** Assistant reply, markdown. */
  content: string;
  /** Provider + model that produced the reply (for observability). */
  model: string;
  /** Token usage when the provider reports it. */
  usage?: AIUsage;
}

export interface AIUsage {
  inputTokens: number;
  outputTokens: number;
}

/**
 * The provider adapter contract. `lib/ai/` exposes exactly one
 * implementation of this at a time (Gemini, once integrated).
 */
export interface AIProvider {
  readonly name: string;
  /**
   * Generates one assistant reply. Implementations must:
   *  - read the API key ONLY from `config/env.ts` (server-only)
   *  - enforce `AI_MAX_OUTPUT_TOKENS` from env
   *  - throw AppError subclasses on failure (never leak provider errors)
   */
  generate(input: AIGenerateInput): Promise<AIChatResponse>;
}

export interface AIGenerateInput {
  /** Fully-assembled system prompt (from prompts/). */
  systemPrompt: string;
  /** Conversation turns, oldest first, ending with the new user message. */
  turns: AIChatTurn[];
  /** Optional per-call overrides; defaults come from env config. */
  options?: {
    maxOutputTokens?: number;
    temperature?: number;
  };
}
