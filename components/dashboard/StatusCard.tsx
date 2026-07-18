"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, Minus, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneStyles } from "@/lib/operations-ui";
import type { StatusMetric } from "@/types/operations";

export interface StatusCardProps {
  metric: StatusMetric;
  icon?: LucideIcon;
  className?: string;
}

/**
 * Compact KPI/status tile used across all Operations dashboards
 * (Volunteer, Transport, Parking, Medical, Security, Incident, Emergency).
 */
export function StatusCard({ metric, icon: Icon, className }: StatusCardProps) {
  const tone = toneStyles[metric.tone];

  const TrendIcon =
    metric.trend === "up" ? ArrowUp : metric.trend === "down" ? ArrowDown : Minus;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className={cn("border-border/60 bg-card", className)}>
        <CardContent className="flex items-start justify-between gap-3 p-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-semibold text-foreground">{metric.value}</span>
              {metric.unit && (
                <span className="text-sm text-muted-foreground">{metric.unit}</span>
              )}
            </div>
            {metric.trendValue && (
              <div className={cn("flex items-center gap-1 text-xs", tone.text)}>
                <TrendIcon className="h-3 w-3" />
                <span>{metric.trendValue}</span>
              </div>
            )}
          </div>
          {Icon && (
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border",
                tone.badge
              )}
            >
              <Icon className="h-4.5 w-4.5" />
            </span>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default StatusCard;
