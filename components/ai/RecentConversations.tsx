// components/ai/RecentConversations.tsx
"use client";

import { MessageSquare, Pin } from "lucide-react";
import type { Conversation } from "@/types/ai";
import { cn } from "@/lib/utils";

export interface RecentConversationsProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  limit?: number;
}

const CATEGORY_LABEL: Record<Conversation["category"], string> = {
  "crowd-management": "Crowd",
  emergency: "Emergency",
  transport: "Transport",
  volunteer: "Volunteer",
  analytics: "Analytics",
  general: "General",
};

export function RecentConversations({
  conversations,
  activeConversationId,
  onSelect,
  limit = 6,
}: RecentConversationsProps) {
  const items = conversations
    .slice()
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit);

  return (
    <ul className="flex flex-col gap-1">
      {items.map((c) => (
        <li key={c.id}>
          <button
            type="button"
            onClick={() => onSelect(c.id)}
            className={cn(
              "flex w-full items-start gap-2 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-accent",
              activeConversationId === c.id && "bg-accent"
            )}
          >
            <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1.5">
                <span className="truncate text-xs font-medium text-foreground">{c.title}</span>
                {c.pinned && <Pin className="h-3 w-3 shrink-0 text-primary" />}
              </span>
              <span className="line-clamp-1 text-[11px] text-muted-foreground">{c.preview}</span>
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">
                {CATEGORY_LABEL[c.category]}
              </span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
