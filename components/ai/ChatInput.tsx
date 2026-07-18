// components/ai/ChatInput.tsx
"use client";

import { useState, type KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInputButton } from "@/components/ai/VoiceInputButton";

export interface ChatInputProps {
  onSend: (text: string) => void;
  isSending?: boolean;
  placeholder?: string;
}

export function ChatInput({
  onSend,
  isSending = false,
  placeholder = "Ask about crowd flow, emergencies, transport, or volunteers...",
}: ChatInputProps) {
  const [value, setValue] = useState("");

  function handleSend() {
    if (!value.trim() || isSending) return;
    onSend(value.trim());
    setValue("");
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-border bg-background p-3 sm:p-4">
      <VoiceInputButton onTranscript={(text) => setValue((prev) => (prev ? `${prev} ${text}` : text))} disabled={isSending} />

      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={1}
        className="max-h-32 min-h-[40px] flex-1 resize-none rounded-2xl"
        disabled={isSending}
      />

      <Button
        type="button"
        size="icon"
        onClick={handleSend}
        disabled={!value.trim() || isSending}
        aria-label="Send message"
        className="rounded-full"
      >
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
}
