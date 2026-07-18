// lib/operations-ui.ts
// Shared presentation helpers for the Operations module.
// All colors resolve through Tailwind theme tokens / CSS variables — never hardcoded hex values.

import type { StatusTone, PriorityLevel } from "@/types/operations";

export const toneStyles: Record<
  StatusTone,
  { badge: string; dot: string; text: string; ring: string }
> = {
  success: {
    badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    ring: "ring-emerald-500/30",
  },
  warning: {
    badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    ring: "ring-amber-500/30",
  },
  critical: {
    badge: "bg-destructive/15 text-destructive border-destructive/30",
    dot: "bg-destructive",
    text: "text-destructive",
    ring: "ring-destructive/30",
  },
  info: {
    badge: "bg-primary/15 text-primary border-primary/30",
    dot: "bg-primary",
    text: "text-primary",
    ring: "ring-primary/30",
  },
  neutral: {
    badge: "bg-muted text-muted-foreground border-border",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    ring: "ring-border",
  },
};

export const priorityStyles: Record<PriorityLevel, { badge: string; label: string }> = {
  low: { badge: "bg-muted text-muted-foreground border-border", label: "Low" },
  medium: { badge: "bg-primary/15 text-primary border-primary/30", label: "Medium" },
  high: { badge: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30", label: "High" },
  critical: { badge: "bg-destructive/15 text-destructive border-destructive/30", label: "Critical" },
};

export function formatClock(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

export function relativeTime(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  return `${diffHr}h ago`;
}
