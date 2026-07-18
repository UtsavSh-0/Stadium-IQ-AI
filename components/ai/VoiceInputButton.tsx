// components/ai/VoiceInputButton.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface VoiceInputButtonProps {
  onTranscript?: (text: string) => void;
  disabled?: boolean;
}

/**
 * Voice input UI. Mic capture is mocked — after a short "listening" window it
 * emits a sample transcript. Wire up the Web Speech API (or a provider SDK)
 * behind the same onTranscript callback when ready.
 */
export function VoiceInputButton({ onTranscript, disabled }: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);

  function handleToggle() {
    if (disabled) return;

    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    window.setTimeout(() => {
      setIsListening(false);
      onTranscript?.("Show me the crowd density near the north concourse.");
    }, 1800);
  }

  return (
    <div className="relative">
      {isListening && (
        <motion.span
          className="absolute inset-0 rounded-full bg-destructive/30"
          animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
          aria-hidden="true"
        />
      )}
      <Button
        type="button"
        size="icon"
        variant={isListening ? "destructive" : "outline"}
        onClick={handleToggle}
        disabled={disabled}
        aria-pressed={isListening}
        aria-label={isListening ? "Stop voice input" : "Start voice input"}
        className={cn("relative z-10 rounded-full", isListening && "animate-none")}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      </Button>
    </div>
  );
}
