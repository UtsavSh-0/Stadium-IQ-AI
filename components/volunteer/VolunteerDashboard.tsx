"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, ClipboardList, CheckCircle2, AlertTriangle } from "lucide-react";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { TaskCard } from "./TaskCard";
import { ShiftCard } from "./ShiftCard";
import { TaskAssignment } from "./TaskAssignment";
import type { StatusMetric, Volunteer, VolunteerTask, Shift } from "@/types/operations";

export interface VolunteerDashboardProps {
  volunteers?: Volunteer[];
  tasks?: VolunteerTask[];
  shifts?: Shift[];
}

const mockVolunteers: Volunteer[] = [
  { id: "v1", name: "Ana Torres", role: "Gate Steward", zone: "Gate A", shiftStart: "08:00", shiftEnd: "16:00", status: "on-duty", tasksCompleted: 12, tasksAssigned: 2 },
  { id: "v2", name: "Marcus Lee", role: "Fan Guide", zone: "Concourse B", shiftStart: "09:00", shiftEnd: "17:00", status: "on-duty", tasksCompleted: 8, tasksAssigned: 3 },
  { id: "v3", name: "Priya Nair", role: "Accessibility Aide", zone: "Section 114", shiftStart: "10:00", shiftEnd: "18:00", status: "on-break", tasksCompleted: 5, tasksAssigned: 1 },
  { id: "v4", name: "Diego Alvarez", role: "Info Desk", zone: "Main Concourse", shiftStart: "07:00", shiftEnd: "15:00", status: "on-duty", tasksCompleted: 15, tasksAssigned: 0 },
];

const mockTasks: VolunteerTask[] = [
  { id: "t1", title: "Restock first-aid kiosk", description: "Replenish supplies at kiosk near Gate C before gates open.", zone: "Gate C", priority: "high", status: "unassigned", dueTime: "14:30", estimatedMinutes: 20 },
  { id: "t2", title: "Guide VIP arrivals", description: "Escort VIP guests from Gate A to Suite Level 3.", zone: "Gate A", priority: "critical", status: "assigned", assigneeId: "v1", assigneeName: "Ana Torres", dueTime: "15:00", estimatedMinutes: 30 },
  { id: "t3", title: "Wheelchair assistance", description: "Assist fan with wheelchair access to Section 114.", zone: "Section 114", priority: "medium", status: "in-progress", assigneeId: "v3", assigneeName: "Priya Nair", dueTime: "15:15", estimatedMinutes: 15 },
  { id: "t4", title: "Crowd flow monitoring", description: "Monitor and direct crowd flow at Concourse B pinch point.", zone: "Concourse B", priority: "medium", status: "unassigned", dueTime: "16:00", estimatedMinutes: 45 },
  { id: "t5", title: "Lost & found handoff", description: "Deliver recovered item to Info Desk for fan pickup.", zone: "Main Concourse", priority: "low", status: "completed", assigneeId: "v4", assigneeName: "Diego Alvarez", dueTime: "13:00", estimatedMinutes: 10 },
];

const mockShifts: Shift[] = [
  { id: "s1", volunteerName: "Ana Torres", role: "Gate Steward", zone: "Gate A", startTime: "08:00", endTime: "16:00", status: "active" },
  { id: "s2", volunteerName: "Marcus Lee", role: "Fan Guide", zone: "Concourse B", startTime: "09:00", endTime: "17:00", status: "active" },
  { id: "s3", volunteerName: "Priya Nair", role: "Accessibility Aide", zone: "Section 114", startTime: "10:00", endTime: "18:00", status: "upcoming" },
  { id: "s4", volunteerName: "Diego Alvarez", role: "Info Desk", zone: "Main Concourse", startTime: "07:00", endTime: "15:00", status: "completed" },
];

/**
 * Volunteer Dashboard — Operations module.
 * Composes StatusCard, TaskCard, ShiftCard and TaskAssignment for
 * end-to-end volunteer workforce visibility during the tournament.
 */
export function VolunteerDashboard({
  volunteers = mockVolunteers,
  tasks = mockTasks,
  shifts = mockShifts,
}: VolunteerDashboardProps) {
  const [taskList, setTaskList] = useState(tasks);
  const [assignTarget, setAssignTarget] = useState<VolunteerTask | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const metrics: StatusMetric[] = useMemo(() => {
    const onDuty = volunteers.filter((v) => v.status === "on-duty").length;
    const unassigned = taskList.filter((t) => t.status === "unassigned").length;
    const completed = taskList.filter((t) => t.status === "completed").length;
    const critical = taskList.filter((t) => t.priority === "critical" && t.status !== "completed").length;

    return [
      { id: "on-duty", label: "Volunteers On Duty", value: onDuty, tone: "success", trend: "up", trendValue: `${volunteers.length} total` },
      { id: "unassigned", label: "Unassigned Tasks", value: unassigned, tone: unassigned > 0 ? "warning" : "success" },
      { id: "completed", label: "Tasks Completed", value: completed, unit: "today", tone: "info" },
      { id: "critical", label: "Critical Tasks", value: critical, tone: critical > 0 ? "critical" : "success" },
    ];
  }, [volunteers, taskList]);

  const handleAssignClick = (taskId: string) => {
    const found = taskList.find((t) => t.id === taskId) ?? null;
    setAssignTarget(found);
    setDialogOpen(true);
  };

  const handleConfirmAssign = (taskId: string, volunteerId: string) => {
    const volunteer = volunteers.find((v) => v.id === volunteerId);
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status: "assigned",
              assigneeId: volunteerId,
              assigneeName: volunteer?.name,
              assigneeAvatar: volunteer?.avatarUrl,
            }
          : t
      )
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatusCard metric={metrics[0]} icon={Users} />
        <StatusCard metric={metrics[1]} icon={ClipboardList} />
        <StatusCard metric={metrics[2]} icon={CheckCircle2} />
        <StatusCard metric={metrics[3]} icon={AlertTriangle} />
      </div>

      <Tabs defaultValue="tasks" className="w-full">
        <TabsList>
          <TabsTrigger value="tasks">Task Board</TabsTrigger>
          <TabsTrigger value="shifts">Shift Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="tasks" className="mt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {taskList.map((task) => (
              <TaskCard key={task.id} task={task} onAssign={handleAssignClick} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {shifts.map((shift) => (
              <ShiftCard key={shift.id} shift={shift} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <TaskAssignment
        task={assignTarget}
        volunteers={volunteers}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmAssign}
      />
    </motion.div>
  );
}

export default VolunteerDashboard;
