"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Volunteer, VolunteerTask } from "@/types/operations";

export interface TaskAssignmentProps {
  task: VolunteerTask | null;
  volunteers: Volunteer[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (taskId: string, volunteerId: string) => void;
}

/**
 * Modal UI for assigning an unassigned VolunteerTask to an available Volunteer.
 * Triggered from TaskCard's "Assign" action inside the Volunteer Dashboard.
 */
export function TaskAssignment({
  task,
  volunteers,
  open,
  onOpenChange,
  onConfirm,
}: TaskAssignmentProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const availableVolunteers = volunteers.filter((v) => v.status === "on-duty");

  const handleConfirm = () => {
    if (task && selectedId) {
      onConfirm(task.id, selectedId);
      setSelectedId(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign task</DialogTitle>
        </DialogHeader>

        {task && (
          <div className="rounded-md border border-border/60 bg-muted/30 p-3">
            <p className="text-sm font-medium text-foreground">{task.title}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {task.zone} · due {task.dueTime}
            </p>
          </div>
        )}

        <div className="max-h-64 space-y-1.5 overflow-y-auto pr-1">
          <AnimatePresence initial={false}>
            {availableVolunteers.map((v) => {
              const isSelected = selectedId === v.id;
              return (
                <motion.button
                  key={v.id}
                  layout
                  onClick={() => setSelectedId(v.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md border p-2.5 text-left transition-colors",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border/60 bg-card hover:bg-accent/50"
                  )}
                >
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage src={v.avatarUrl} alt={v.name} />
                    <AvatarFallback className="text-xs">
                      {v.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{v.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {v.role} · {v.zone}
                    </p>
                  </div>
                  <Badge variant="outline" className="shrink-0 text-[10px]">
                    {v.tasksAssigned} tasks
                  </Badge>
                  {isSelected && <Check className="h-4 w-4 shrink-0 text-primary" />}
                </motion.button>
              );
            })}
            {availableVolunteers.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No on-duty volunteers available
              </p>
            )}
          </AnimatePresence>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedId}>
            Confirm assignment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default TaskAssignment;
