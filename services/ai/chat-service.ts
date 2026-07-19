/**
 * AI chat service — orchestration between the API route and the provider.
 *
 * Responsibilities (all server-side):
 *  - assemble the system prompt for the conversation category/language
 *  - cap history length so a client can't inflate token spend
 *  - call the provider adapter (lib/ai/provider.ts)
 *  - (post-integration) persist turns to `chat_history` under RLS
 *
 * This module contains NO provider-specific code and NO mock responses.
 * Until lib/ai/provider.ts has a real implementation, `chat()` throws
 * ServiceUnavailable so the API returns an honest 503 — the client-side
 * mock in services/ai-service.ts keeps the demo UI working meanwhile.
 */
import "server-only";
import { AppError } from "@/lib/errors";
import { logger } from "@/lib/logger/logger";
import { getAIProvider, isAIConfigured } from "@/lib/ai/provider";
import { buildSystemPrompt } from "@/prompts/system-prompts";
import type { AIChatRequest, AIChatResponse } from "@/types/ai-server";

/** Max prior turns forwarded to the model — bounds cost and context size. */
const MAX_HISTORY_TURNS = 20;

export async function chat(request: AIChatRequest): Promise<AIChatResponse> {
  if (!isAIConfigured()) {
    throw new AppError(
      "The AI assistant is not available yet.",
      503,
      "AI_NOT_CONFIGURED"
    );
  }

  const systemPrompt = buildSystemPrompt(request.category, request.language);
  const history = request.history.slice(-MAX_HISTORY_TURNS);

  const provider = getAIProvider();

  logger.info("AI chat request", {
    userId: request.userId,
    category: request.category,
    historyTurns: history.length,
    // Never log message content — prompts may contain personal data.
  });

  const response = await provider.generate({
    systemPrompt,
    turns: [...history, { role: "user", content: request.message }],
  });

  logger.info("AI chat response", {
    userId: request.userId,
    model: response.model,
    usage: response.usage,
  });

  return response;
}
