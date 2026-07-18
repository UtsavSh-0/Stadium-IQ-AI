// components/dashboard/crowd/QueueCard.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock3, Users, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { QueueData } from "@/types/crowd";
import { riskBadgeClasses, riskLabel } from "@/lib/crowd-risk-styles";
import { cn } from "@/lib/utils";

export interface QueueCardProps {
  queues: QueueData[];
  className?: string;
}

const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
} as const;

export function QueueCard({ queues, className }: QueueCardProps) {
  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Clock3 className="h-4 w-4 text-primary" />
          Queue Monitor
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {queues.map((q, i) => {
          const TrendIcon = TREND_ICON[q.trend];
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="rounded-lg border border-border/60 bg-card/50 p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{q.label}</p>
                <Badge variant="outline" className={cn("shrink-0 text-[10px]", riskBadgeClasses[q.status])}>
                  {riskLabel[q.status]}
                </Badge>
              </div>
              <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {q.peopleInQueue} waiting
                </span>
                <span className="flex items-center gap-1 font-medium text-foreground">
                  <TrendIcon className="h-3 w-3" />
                  {q.waitTimeMinutes} min
                </span>
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
