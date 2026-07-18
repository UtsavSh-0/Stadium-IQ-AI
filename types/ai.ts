// types/ai.ts
// Shared TypeScript contracts for the AI Assistant module (components/ai + app/dashboard/assistant)
// NOTE: This module ships with mock data only. No network/backend calls are made here.

export type MessageRole = "user" | "assistant" | "system";

export type MessageStatus = "sending" | "streaming" | "complete" | "error";

export interface AIMessage {
  id: string;
  role: MessageRole;
  content: string; // raw markdown
  createdAt: string; // ISO timestamp
  status: MessageStatus;
  language?: SupportedLanguageCode;
  attachments?: AIAttachment[];
}

export interface AIAttachment {
  id: string;
  type: "image" | "file" | "map-snapshot" | "chart";
  name: string;
  url?: string;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  updatedAt: string; // ISO timestamp
  pinned?: boolean;
  category: ConversationCategory;
  messageCount: number;
}

export type ConversationCategory =
  | "crowd-management"
  | "emergency"
  | "transport"
  | "volunteer"
  | "analytics"
  | "general";

export interface SuggestedQuestion {
  id: string;
  label: string;
  prompt: string;
  category: ConversationCategory;
  icon?: string; // lucide icon name, resolved in component
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  template: string;
  category: ConversationCategory;
  variables?: PromptTemplateVariable[];
}

export interface PromptTemplateVariable {
  key: string;
  label: string;
  placeholder: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string; // lucide icon name
  prompt: string;
}

export type SupportedLanguageCode =
  | "en"
  | "es"
  | "pt"
  | "fr"
  | "ar"
  | "de"
  | "ja"
  | "ko"
  | "hi"
  | "zh";

export interface SupportedLanguage {
  code: SupportedLanguageCode;
  label: string;
  nativeLabel: string;
  flag: string; // emoji flag, avoids extra image assets
}

export interface VoiceInputState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error?: string;
}

export interface AIChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messagesByConversation: Record<string, AIMessage[]>;
  isAssistantTyping: boolean;
  isPanelOpen: boolean;
  language: SupportedLanguageCode;
}
