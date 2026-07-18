// components/ai/QuickActions.tsx
"use client";

import * as Icons from "lucide-react";
import { motion } from "framer-motion";
import type { QuickAction } from "@/types/ai";
import { QUICK_ACTIONS } from "@/lib/ai/mock-data";

export interface QuickActionsProps {
  actions?: QuickAction[];
  onSelect: (prompt: string) => void;
}

export function QuickActions({ actions = QUICK_ACTIONS, onSelect }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {actions.map((action, i) => {
        const Icon = (Icons[action.icon as keyof typeof Icons] as Icons.LucideIcon) ?? Icons.Zap;
        return (
          <motion.button
            key={action.id}
            type="button"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.04 }}
            whileHover={{ y: -2 }}
            onClick={() => onSelect(action.prompt)}
            className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-accent/40"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" />
            </span>
            <span>
              <span className="block text-xs font-semibold text-foreground">{action.label}</span>
              <span className="block text-[11px] text-muted-foreground">{action.description}</span>
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
