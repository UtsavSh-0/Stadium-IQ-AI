// components/ai/ConversationSidebar.tsx
"use client";

import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Conversation } from "@/types/ai";
import { RecentConversations } from "@/components/ai/RecentConversations";

export interface ConversationSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelect: (id: string) => void;
  onNewConversation: () => void;
  className?: string;
}

export function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelect,
  onNewConversation,
  className,
}: ConversationSidebarProps) {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? conversations.filter((c) =>
        `${c.title} ${c.preview}`.toLowerCase().includes(query.trim().toLowerCase())
      )
    : conversations;

  return (
    <aside
      className={`flex h-full w-full flex-col border-r border-border bg-card/50 sm:w-72 ${className ?? ""}`}
    >
      <div className="flex flex-col gap-3 p-3">
        <Button onClick={onNewConversation} className="w-full justify-start gap-2" variant="default">
          <Plus className="h-4 w-4" />
          New conversation
        </Button>
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search conversations"
            className="h-9 pl-8 text-xs"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 pb-3">
        <RecentConversations
          conversations={filtered}
          activeConversationId={activeConversationId}
          onSelect={onSelect}
          limit={filtered.length}
        />
      </ScrollArea>
    </aside>
  );
}
