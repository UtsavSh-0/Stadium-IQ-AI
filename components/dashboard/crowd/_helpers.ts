// components/dashboard/crowd/_helpers.ts
import type { CrowdRiskLevel } from "@/types/crowd";

export function riskFromPercentageLocal(pct: number): CrowdRiskLevel {
  if (pct >= 92) return "critical";
  if (pct >= 78) return "high";
  if (pct >= 55) return "moderate";
  return "low";
}
