/**
 * POST /api/ai/chat — the single server-side entry point for the AI
 * assistant.
 *
 * The Gemini API key never leaves the server: the browser calls this
 * route with its Supabase session cookie, and the route holds the entire
 * auth → validate → service → provider chain:
 *
 *   requireUser()            session check (401 if signed out)
 *   validateBody(zod)        request shape + length caps (422)
 *   services/ai chat()       prompt assembly, history cap
 *   lib/ai provider          Gemini adapter (not yet implemented → 503)
 *
 * Until the provider is implemented this route honestly returns
 * 503 AI_NOT_CONFIGURED — it does NOT fake a response. The demo UI keeps
 * using the client-side mock until the swap.
 */
import { createApiHandler } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";
import { validateBody } from "@/lib/validation/validate";
import { aiChatRequestSchema } from "@/lib/validation/ai";
import { requireUser } from "@/lib/auth/guards";
import { chat } from "@/services/ai/chat-service";

export const POST = createApiHandler(async (request) => {
  const user = await requireUser();
  const body = await validateBody(request, aiChatRequestSchema);

  const response = await chat({
    message: body.message,
    history: body.history,
    category: body.category,
    language: body.language,
    userId: user.id,
    roles: user.roles,
  });

  return successResponse(response);
});
