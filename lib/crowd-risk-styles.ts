// lib/crowd-risk-styles.ts
import type { CrowdRiskLevel } from "@/types/crowd";

// Maps risk levels to Tailwind utility classes built on theme CSS variables
// (e.g. bg-destructive, text-primary) — never raw hex/rgb values.
export const riskBadgeClasses: Record<CrowdRiskLevel, string> = {
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  moderate: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  high: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  critical: "bg-destructive/15 text-destructive border-destructive/30",
};

export const riskDotClasses: Record<CrowdRiskLevel, string> = {
  low: "bg-emerald-500",
  moderate: "bg-amber-500",
  high: "bg-orange-500",
  critical: "bg-destructive",
};

export const riskBarClasses: Record<CrowdRiskLevel, string> = {
  low: "bg-emerald-500",
  moderate: "bg-amber-500",
  high: "bg-orange-500",
  critical: "bg-destructive",
};

export const riskLabel: Record<CrowdRiskLevel, string> = {
  low: "Low",
  moderate: "Moderate",
  high: "High",
  critical: "Critical",
};
