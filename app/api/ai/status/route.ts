/**
 * GET /api/ai/status — reports whether the AI provider is configured.
 *
 * Lets the client decide between the real assistant endpoint and the demo
 * mock without hardcoding, and gives ops a quick smoke check after
 * deployment. Reveals only a boolean — never key material or model config.
 */
import { createApiHandler } from "@/lib/api/route-handler";
import { successResponse } from "@/lib/api/response";
import { requireUser } from "@/lib/auth/guards";
import { isAIConfigured } from "@/lib/ai/provider";

export const GET = createApiHandler(async () => {
  await requireUser();

  return successResponse({ configured: isAIConfigured() });
});
