// components/ai/AIChatInterface.tsx
"use client";

import { Bot } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useAIStore } from "@/store/ai-store";
import { useAIChat } from "@/hooks/use-ai-chat";
import { ConversationSidebar } from "@/components/ai/ConversationSidebar";
import { ChatHistory } from "@/components/ai/ChatHistory";
import { ChatInput } from "@/components/ai/ChatInput";
import { SuggestedQuestions } from "@/components/ai/SuggestedQuestions";
import { LanguageSelector } from "@/components/ai/LanguageSelector";

export interface AIChatInterfaceProps {
  className?: string;
  showSidebar?: boolean;
}

/**
 * Full-page AI chat experience: conversation sidebar + active thread.
 * Intended for app/dashboard/assistant/page.tsx.
 */
export function AIChatInterface({ className, showSidebar = true }: AIChatInterfaceProps) {
  const conversations = useAIStore((s) => s.conversations);
  const activeConversationId = useAIStore((s) => s.activeConversationId);
  const setActiveConversation = useAIStore((s) => s.setActiveConversation);
  const startNewConversation = useAIStore((s) => s.startNewConversation);
  const isAssistantTyping = useAIStore((s) => s.isAssistantTyping);
  const language = useAIStore((s) => s.language);
  const setLanguage = useAIStore((s) => s.setLanguage);

  const { messages, sendMessage, isSending } = useAIChat(activeConversationId);

  const activeConversation = conversations.find((c) => c.id === activeConversationId);

  return (
    <Card className={`flex h-[calc(100vh-8rem)] w-full overflow-hidden p-0 ${className ?? ""}`}>
      {showSidebar && (
        <ConversationSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelect={setActiveConversation}
          onNewConversation={startNewConversation}
          className="hidden sm:flex"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Bot className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-foreground">
                {activeConversation?.title ?? "StadiumIQ AI Assistant"}
              </h2>
              <p className="text-[11px] text-muted-foreground">Live operations intelligence</p>
            </div>
          </div>
          <LanguageSelector value={language} onChange={setLanguage} />
        </header>

        <div className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ChatHistory messages={messages} isAssistantTyping={isAssistantTyping} />
          </div>

          {messages.length === 0 && (
            <SuggestedQuestions onSelect={(prompt) => sendMessage(prompt)} />
          )}

          <ChatInput onSend={sendMessage} isSending={isSending} />
        </div>
      </div>
    </Card>
  );
}
