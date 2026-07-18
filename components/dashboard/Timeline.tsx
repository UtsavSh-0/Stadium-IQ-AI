"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toneStyles } from "@/lib/operations-ui";
import { formatClock } from "@/lib/operations-ui";
import type { TimelineEvent } from "@/types/operations";

export interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
  emptyMessage?: string;
}

/**
 * Vertical event timeline shared by Incident, Emergency, Medical and Security dashboards.
 */
export function Timeline({ events, className, emptyMessage = "No activity yet" }: TimelineProps) {
  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-lg border border-dashed border-border py-8 text-sm text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ol className={cn("relative space-y-0", className)}>
      {events.map((event, idx) => {
        const tone = toneStyles[event.tone];
        const isLast = idx === events.length - 1;
        return (
          <motion.li
            key={event.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: idx * 0.03 }}
            className="relative flex gap-3 pb-6 last:pb-0"
          >
            <div className="flex flex-col items-center">
              <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", tone.dot)} />
              {!isLast && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className="flex-1 pb-1">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium text-foreground">{event.title}</p>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatClock(event.timestamp)}
                </span>
              </div>
              {event.description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
              )}
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}

export default Timeline;
