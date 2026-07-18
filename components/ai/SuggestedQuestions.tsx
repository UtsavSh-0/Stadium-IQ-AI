// components/ai/SuggestedQuestions.tsx
"use client";

import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import type { SuggestedQuestion } from "@/types/ai";
import { SUGGESTED_QUESTIONS } from "@/lib/ai/mock-data";

export interface SuggestedQuestionsProps {
  questions?: SuggestedQuestion[];
  onSelect: (prompt: string) => void;
}

export function SuggestedQuestions({
  questions = SUGGESTED_QUESTIONS,
  onSelect,
}: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-4 pb-3 sm:px-6">
      {questions.map((q, i) => {
        const Icon = (Icons[q.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Sparkles;
        return (
          <motion.button
            key={q.id}
            type="button"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={() => onSelect(q.prompt)}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <Icon className="h-3.5 w-3.5 text-primary" />
            {q.label}
          </motion.button>
        );
      })}
    </div>
  );
}
