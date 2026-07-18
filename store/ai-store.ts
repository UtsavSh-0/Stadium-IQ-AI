// store/ai-store.ts
import { create } from "zustand";
import type { AIChatState, AIMessage, SupportedLanguageCode } from "@/types/ai";
import { MOCK_CONVERSATIONS, MOCK_MESSAGES } from "@/lib/ai/mock-data";

interface AIStoreActions {
  setActiveConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: AIMessage) => void;
  setAssistantTyping: (typing: boolean) => void;
  togglePanel: (open?: boolean) => void;
  setLanguage: (lang: SupportedLanguageCode) => void;
  startNewConversation: () => string;
}

type AIStore = AIChatState & AIStoreActions;

export const useAIStore = create<AIStore>((set, get) => ({
  conversations: MOCK_CONVERSATIONS,
  activeConversationId: MOCK_CONVERSATIONS[0]?.id ?? null,
  messagesByConversation: MOCK_MESSAGES,
  isAssistantTyping: false,
  isPanelOpen: false,
  language: "en",

  setActiveConversation: (id) => set({ activeConversationId: id }),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messagesByConversation: {
        ...state.messagesByConversation,
        [conversationId]: [...(state.messagesByConversation[conversationId] ?? []), message],
      },
      conversations: state.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, preview: message.content.slice(0, 80), updatedAt: message.createdAt, messageCount: c.messageCount + 1 }
          : c
      ),
    })),

  setAssistantTyping: (typing) => set({ isAssistantTyping: typing }),

  togglePanel: (open) =>
    set((state) => ({ isPanelOpen: open ?? !state.isPanelOpen })),

  setLanguage: (lang) => set({ language: lang }),

  startNewConversation: () => {
    const id = `conv-${Date.now()}`;
    set((state) => ({
      conversations: [
        {
          id,
          title: "New conversation",
          preview: "Ask StadiumIQ AI anything about live operations...",
          updatedAt: new Date().toISOString(),
          category: "general",
          messageCount: 0,
        },
        ...state.conversations,
      ],
      messagesByConversation: { ...state.messagesByConversation, [id]: [] },
      activeConversationId: id,
    }));
    return id;
  },
}));
