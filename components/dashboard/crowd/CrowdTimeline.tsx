// components/dashboard/crowd/CrowdTimeline.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History } from "lucide-react";
import type { CrowdTimelineEvent } from "@/types/crowd";
import { riskDotClasses } from "@/lib/crowd-risk-styles";
import { cn } from "@/lib/utils";

export interface CrowdTimelineProps {
  events: CrowdTimelineEvent[];
  className?: string;
}

export function CrowdTimeline({ events, className }: CrowdTimelineProps) {
  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <History className="h-4 w-4 text-primary" />
          Crowd Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="relative ml-2 border-l border-border/60 pl-5">
          {events.map((event, i) => (
            <motion.li
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="mb-5 last:mb-0"
            >
              <span
                className={cn(
                  "absolute -left-[7px] mt-1.5 h-3 w-3 rounded-full ring-4 ring-background",
                  riskDotClasses[event.riskLevel]
                )}
              />
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">{event.time}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
            </motion.li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
