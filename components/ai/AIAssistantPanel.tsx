// components/ai/AIAssistantPanel.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAIStore } from "@/store/ai-store";
import { useAIChat } from "@/hooks/use-ai-chat";
import { ChatHistory } from "@/components/ai/ChatHistory";
import { ChatInput } from "@/components/ai/ChatInput";
import { QuickActions } from "@/components/ai/QuickActions";
import { PromptTemplates } from "@/components/ai/PromptTemplates";
import { RecentConversations } from "@/components/ai/RecentConversations";

/**
 * Floating/dockable AI assistant panel — reusable from any dashboard route
 * (e.g. a global "Ask AI" launcher). Distinct from AIChatInterface, which is
 * the full-page assistant experience.
 */
export function AIAssistantPanel() {
  const isPanelOpen = useAIStore((s) => s.isPanelOpen);
  const togglePanel = useAIStore((s) => s.togglePanel);
  const conversations = useAIStore((s) => s.conversations);
  const activeConversationId = useAIStore((s) => s.activeConversationId);
  const setActiveConversation = useAIStore((s) => s.setActiveConversation);
  const isAssistantTyping = useAIStore((s) => s.isAssistantTyping);

  const { messages, sendMessage, isSending } = useAIChat(activeConversationId);

  return (
    <AnimatePresence>
      {isPanelOpen && (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-50 flex h-[min(38rem,calc(100vh-2rem))] w-[min(24rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
          role="dialog"
          aria-label="StadiumIQ AI Assistant"
        >
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </span>
              <p className="text-sm font-semibold text-foreground">StadiumIQ AI</p>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => togglePanel(false)}
              aria-label="Close assistant panel"
            >
              <X className="h-4 w-4" />
            </Button>
          </header>

          <Tabs defaultValue="chat" className="flex min-h-0 flex-1 flex-col">
            <TabsList className="mx-4 mt-2 grid grid-cols-3">
              <TabsTrigger value="chat" className="text-xs">Chat</TabsTrigger>
              <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">History</TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex min-h-0 flex-1 flex-col data-[state=inactive]:hidden">
              <div className="min-h-0 flex-1 overflow-y-auto">
                <ChatHistory messages={messages} isAssistantTyping={isAssistantTyping} />
              </div>
              <ChatInput onSend={sendMessage} isSending={isSending} />
            </TabsContent>

            <TabsContent value="actions" className="flex-1 overflow-y-auto p-4 data-[state=inactive]:hidden">
              <div className="flex flex-col gap-4">
                <QuickActions onSelect={sendMessage} />
                <PromptTemplates onUse={sendMessage} />
              </div>
            </TabsContent>

            <TabsContent value="history" className="flex-1 overflow-y-auto p-2 data-[state=inactive]:hidden">
              <RecentConversations
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelect={setActiveConversation}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function AIAssistantLauncher() {
  const togglePanel = useAIStore((s) => s.togglePanel);
  const isPanelOpen = useAIStore((s) => s.isPanelOpen);

  if (isPanelOpen) return null;

  return (
    <Button
      onClick={() => togglePanel(true)}
      className="fixed bottom-4 right-4 z-40 h-12 w-12 rounded-full p-0 shadow-lg"
      aria-label="Open StadiumIQ AI assistant"
    >
      <Bot className="h-5 w-5" />
    </Button>
  );
}
