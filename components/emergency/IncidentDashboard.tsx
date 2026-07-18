"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileWarning, Flame, CloudLightning, Wrench, Users, HeartPulse } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { Timeline } from "@/components/dashboard/Timeline";
import { priorityStyles, relativeTime } from "@/lib/operations-ui";
import type { StatusMetric, Incident, TimelineEvent } from "@/types/operations";

export interface IncidentDashboardProps {
  incidents?: Incident[];
}

const mockIncidents: Incident[] = [
  { id: "i1", title: "Gate C turnstile malfunction", category: "technical", zone: "Gate C", severity: "medium", status: "investigating", reportedAt: new Date(Date.now() - 6 * 60000).toISOString(), description: "Two turnstiles unresponsive, manual entry in effect." },
  { id: "i2", title: "Crowd density spike", category: "crowd", zone: "Section 101", severity: "high", status: "contained", reportedAt: new Date(Date.now() - 15 * 60000).toISOString(), description: "Stewards redirected flow via secondary stairwell." },
  { id: "i3", title: "Kitchen fire alarm triggered", category: "fire", zone: "Hospitality Level 2", severity: "critical", status: "resolved", reportedAt: new Date(Date.now() - 48 * 60000).toISOString(), description: "False alarm confirmed, systems reset." },
  { id: "i4", title: "Lightning proximity alert", category: "weather", zone: "Stadium Perimeter", severity: "high", status: "open", reportedAt: new Date(Date.now() - 2 * 60000).toISOString(), description: "Monitoring storm cell 8km out, delay protocol on standby." },
];

const categoryIcon: Record<Incident["category"], typeof FileWarning> = {
  medical: HeartPulse,
  security: Users,
  crowd: Users,
  fire: Flame,
  technical: Wrench,
  weather: CloudLightning,
};

const statusStyles: Record<Incident["status"], string> = {
  open: "bg-destructive/15 text-destructive border-destructive/30",
  investigating: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  contained: "bg-primary/15 text-primary border-primary/30",
  resolved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
};

/**
 * Incident Dashboard — Operations / Emergency module.
 * Aggregates cross-category incidents (crowd, fire, technical, weather, etc.)
 * with a chronological Timeline view for command-center review.
 */
export function IncidentDashboard({ incidents = mockIncidents }: IncidentDashboardProps) {
  const metrics: StatusMetric[] = useMemo(() => {
    const open = incidents.filter((i) => i.status === "open" || i.status === "investigating").length;
    const critical = incidents.filter((i) => i.severity === "critical" && i.status !== "resolved").length;
    const resolved = incidents.filter((i) => i.status === "resolved").length;

    return [
      { id: "open", label: "Open Incidents", value: open, tone: open > 0 ? "warning" : "success" },
      { id: "critical", label: "Critical", value: critical, tone: critical > 0 ? "critical" : "success" },
      { id: "resolved", label: "Resolved Today", value: resolved, tone: "info" },
    ];
  }, [incidents]);

  const timelineEvents: TimelineEvent[] = useMemo(
    () =>
      [...incidents]
        .sort((a, b) => new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime())
        .map((i) => ({
          id: i.id,
          title: i.title,
          description: `${i.zone} — ${i.description}`,
          timestamp: i.reportedAt,
          tone:
            i.severity === "critical"
              ? "critical"
              : i.severity === "high"
              ? "warning"
              : i.status === "resolved"
              ? "success"
              : "info",
        })),
    [incidents]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard metric={metrics[0]} icon={FileWarning} />
        <StatusCard metric={metrics[1]} icon={Flame} />
        <StatusCard metric={metrics[2]} icon={Wrench} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="border-border/60 bg-card lg:col-span-3">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Active Incidents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {incidents.map((incident) => {
              const Icon = categoryIcon[incident.category];
              const priority = priorityStyles[incident.severity];
              return (
                <motion.div
                  key={incident.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-2 rounded-lg border border-border/60 p-3.5 sm:flex-row sm:items-start sm:justify-between"
                >
                  <div className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{incident.title}</p>
                        <Badge variant="outline" className={cn("text-[10px]", priority.badge)}>
                          {priority.label}
                        </Badge>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {incident.zone} · {relativeTime(incident.reportedAt)}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("w-fit text-[10px] capitalize", statusStyles[incident.status])}>
                    {incident.status}
                  </Badge>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-border/60 bg-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Incident Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <Timeline events={timelineEvents} />
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export default IncidentDashboard;
