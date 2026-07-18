"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { priorityStyles } from "@/lib/operations-ui";
import type { VolunteerTask } from "@/types/operations";

export interface TaskCardProps {
  task: VolunteerTask;
  onAssign?: (taskId: string) => void;
  className?: string;
}

const statusLabel: Record<VolunteerTask["status"], string> = {
  unassigned: "Unassigned",
  assigned: "Assigned",
  "in-progress": "In Progress",
  completed: "Completed",
  blocked: "Blocked",
};

const statusBadgeClass: Record<VolunteerTask["status"], string> = {
  unassigned: "bg-muted text-muted-foreground border-border",
  assigned: "bg-primary/15 text-primary border-primary/30",
  "in-progress": "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  completed: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  blocked: "bg-destructive/15 text-destructive border-destructive/30",
};

/**
 * Individual task card used inside the Volunteer Dashboard task board
 * and reused by the Task Assignment UI.
 */
export function TaskCard({ task, onAssign, className }: TaskCardProps) {
  const priority = priorityStyles[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className={cn("border-border/60 bg-card", className)}>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-sm font-semibold leading-snug text-foreground">{task.title}</h4>
            <Badge variant="outline" className={cn("shrink-0 text-[10px]", priority.badge)}>
              {priority.label}
            </Badge>
          </div>

          <p className="line-clamp-2 text-xs text-muted-foreground">{task.description}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {task.zone}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {task.dueTime} · {task.estimatedMinutes}m
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Badge variant="outline" className={cn("text-[10px]", statusBadgeClass[task.status])}>
              {statusLabel[task.status]}
            </Badge>

            {task.assigneeName ? (
              <div className="flex items-center gap-1.5">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assigneeAvatar} alt={task.assigneeName} />
                  <AvatarFallback className="text-[10px]">
                    {task.assigneeName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-muted-foreground">{task.assigneeName}</span>
              </div>
            ) : (
              <Button
                size="sm"
                variant="secondary"
                className="h-7 gap-1 text-xs"
                onClick={() => onAssign?.(task.id)}
              >
                <UserPlus className="h-3.5 w-3.5" />
                Assign
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default TaskCard;
