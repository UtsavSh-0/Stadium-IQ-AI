// services/ai-service.ts
// Mock service layer for the AI module. No backend/network calls are made.
// This is the seam to swap in a real API (OpenAI/LangChain) later without
// touching any component code — components only depend on this module's shape.

import type { AIMessage } from "@/types/ai";
import { getMockAssistantReply } from "@/lib/ai/mock-data";

export interface SendMessageResult {
  message: AIMessage;
}

function generateId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * Simulates sending a message to the AI assistant and streaming back a reply.
 * Resolves once the full (mock) reply text is ready.
 */
export async function sendMessageMock(prompt: string): Promise<SendMessageResult> {
  const delay = 700 + Math.random() * 900;
  await new Promise((resolve) => setTimeout(resolve, delay));

  const message: AIMessage = {
    id: generateId(),
    role: "assistant",
    content: getMockAssistantReply(prompt),
    createdAt: new Date().toISOString(),
    status: "complete",
  };

  return { message };
}

export function createUserMessage(content: string): AIMessage {
  return {
    id: generateId(),
    role: "user",
    content,
    createdAt: new Date().toISOString(),
    status: "complete",
  };
}
