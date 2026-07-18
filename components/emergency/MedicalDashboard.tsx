"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, Ambulance, Activity, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { priorityStyles, relativeTime } from "@/lib/operations-ui";
import type { StatusMetric, MedicalCase } from "@/types/operations";

export interface MedicalDashboardProps {
  cases?: MedicalCase[];
}

const mockCases: MedicalCase[] = [
  { id: "m1", patientRef: "MED-2031", zone: "Section 214", severity: "high", status: "responding", reportedAt: new Date(Date.now() - 4 * 60000).toISOString(), responderTeam: "Team Alpha" },
  { id: "m2", patientRef: "MED-2032", zone: "Concourse A", severity: "low", status: "on-site", reportedAt: new Date(Date.now() - 12 * 60000).toISOString(), responderTeam: "Team Bravo" },
  { id: "m3", patientRef: "MED-2033", zone: "Gate D", severity: "critical", status: "transported", reportedAt: new Date(Date.now() - 26 * 60000).toISOString(), responderTeam: "Team Charlie" },
  { id: "m4", patientRef: "MED-2034", zone: "Section 108", severity: "medium", status: "resolved", reportedAt: new Date(Date.now() - 55 * 60000).toISOString(), responderTeam: "Team Alpha" },
];

const statusStyles: Record<MedicalCase["status"], string> = {
  reported: "bg-muted text-muted-foreground border-border",
  responding: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  "on-site": "bg-primary/15 text-primary border-primary/30",
  transported: "bg-destructive/15 text-destructive border-destructive/30",
  resolved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
};

/**
 * Medical Dashboard — Operations / Emergency module.
 * Live view of medical cases, severity and responder team assignment.
 */
export function MedicalDashboard({ cases = mockCases }: MedicalDashboardProps) {
  const metrics: StatusMetric[] = useMemo(() => {
    const active = cases.filter((c) => c.status !== "resolved").length;
    const critical = cases.filter((c) => c.severity === "critical" && c.status !== "resolved").length;
    const resolved = cases.filter((c) => c.status === "resolved").length;

    return [
      { id: "active", label: "Active Cases", value: active, tone: active > 0 ? "warning" : "success" },
      { id: "critical", label: "Critical Cases", value: critical, tone: critical > 0 ? "critical" : "success" },
      { id: "resolved", label: "Resolved Today", value: resolved, tone: "info" },
    ];
  }, [cases]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard metric={metrics[0]} icon={Activity} />
        <StatusCard metric={metrics[1]} icon={HeartPulse} />
        <StatusCard metric={metrics[2]} icon={CheckCircle2} />
      </div>

      <Card className="border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Ambulance className="h-4 w-4 text-primary" />
            Medical Cases
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cases.map((c) => {
            const priority = priorityStyles[c.severity];
            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 rounded-lg border border-border/60 p-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{c.patientRef}</p>
                    <Badge variant="outline" className={cn("text-[10px]", priority.badge)}>
                      {priority.label}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {c.zone} · {c.responderTeam} · {relativeTime(c.reportedAt)}
                  </p>
                </div>
                <Badge variant="outline" className={cn("w-fit text-[10px] capitalize", statusStyles[c.status])}>
                  {c.status.replace("-", " ")}
                </Badge>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default MedicalDashboard;
