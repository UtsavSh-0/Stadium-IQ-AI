// components/ai/TypingIndicator.tsx
"use client";

import { motion } from "framer-motion";

export interface TypingIndicatorProps {
  label?: string;
}

export function TypingIndicator({ label = "StadiumIQ AI is thinking" }: TypingIndicatorProps) {
  return (
    <div className="flex items-center gap-2 rounded-2xl bg-muted px-4 py-3 w-fit">
      <span className="sr-only">{label}</span>
      <div className="flex items-center gap-1" aria-hidden="true">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-primary/70"
            animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-muted-foreground">{label}...</span>
    </div>
  );
}
