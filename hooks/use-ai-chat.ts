// hooks/use-ai-chat.ts
"use client";

import { useCallback } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAIStore } from "@/store/ai-store";
import { sendMessageMock, createUserMessage } from "@/services/ai-service";

export function useAIChat(conversationId: string | null) {
  const addMessage = useAIStore((s) => s.addMessage);
  const setAssistantTyping = useAIStore((s) => s.setAssistantTyping);
  const messagesByConversation = useAIStore((s) => s.messagesByConversation);

  const messages = conversationId ? messagesByConversation[conversationId] ?? [] : [];

  const mutation = useMutation({
    mutationFn: (prompt: string) => sendMessageMock(prompt),
    onMutate: () => setAssistantTyping(true),
    onSuccess: (result) => {
      if (conversationId) addMessage(conversationId, result.message);
    },
    onSettled: () => setAssistantTyping(false),
  });

  const sendMessage = useCallback(
    (prompt: string) => {
      if (!conversationId || !prompt.trim()) return;
      addMessage(conversationId, createUserMessage(prompt.trim()));
      mutation.mutate(prompt.trim());
    },
    [conversationId, addMessage, mutation]
  );

  return {
    messages,
    sendMessage,
    isSending: mutation.isPending,
  };
}
