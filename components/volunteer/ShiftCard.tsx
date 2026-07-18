"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Shift } from "@/types/operations";

export interface ShiftCardProps {
  shift: Shift;
  className?: string;
}

const statusStyles: Record<Shift["status"], string> = {
  upcoming: "bg-muted text-muted-foreground border-border",
  active: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  completed: "bg-primary/10 text-primary border-primary/20",
};

/**
 * Shift roster entry used in the Volunteer Dashboard shift schedule.
 */
export function ShiftCard({ shift, className }: ShiftCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("border-border/60 bg-card", className)}>
        <CardContent className="flex items-center gap-3 p-3.5">
          <Avatar className="h-9 w-9 shrink-0">
            <AvatarImage src={shift.volunteerAvatar} alt={shift.volunteerName} />
            <AvatarFallback className="text-xs">
              {shift.volunteerName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{shift.volunteerName}</p>
            <p className="truncate text-xs text-muted-foreground">
              {shift.role} · {shift.zone}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 text-right">
            <Badge variant="outline" className={cn("text-[10px] capitalize", statusStyles[shift.status])}>
              {shift.status}
            </Badge>
            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <CalendarClock className="h-3 w-3" />
              {shift.startTime}–{shift.endTime}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ShiftCard;
