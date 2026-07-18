// components/ai/ChatHistory.tsx
"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import type { AIMessage } from "@/types/ai";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { TypingIndicator } from "@/components/ai/TypingIndicator";

export interface ChatHistoryProps {
  messages: AIMessage[];
  isAssistantTyping?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

export function ChatHistory({
  messages,
  isAssistantTyping = false,
  emptyStateTitle = "Ask StadiumIQ AI anything",
  emptyStateDescription = "Query crowd density, emergency status, transport, or volunteer coverage in plain language.",
}: ChatHistoryProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isAssistantTyping]);

  if (messages.length === 0 && !isAssistantTyping) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{emptyStateTitle}</h3>
        <p className="max-w-xs text-xs text-muted-foreground">{emptyStateDescription}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 overflow-y-auto px-4 py-4 sm:px-6">
      <AnimatePresence initial={false}>
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
      </AnimatePresence>
      {isAssistantTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
}
