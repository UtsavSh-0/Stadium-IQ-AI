"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldAlert, Shield, Users2, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { priorityStyles, relativeTime } from "@/lib/operations-ui";
import type { StatusMetric, SecurityAlert } from "@/types/operations";

export interface SecurityDashboardProps {
  alerts?: SecurityAlert[];
}

const mockAlerts: SecurityAlert[] = [
  { id: "sec1", title: "Unauthorized access attempt", zone: "Gate B Service Entrance", severity: "high", status: "investigating", reportedAt: new Date(Date.now() - 3 * 60000).toISOString(), unitsAssigned: 2 },
  { id: "sec2", title: "Suspicious package reported", zone: "Concourse C", severity: "critical", status: "contained", reportedAt: new Date(Date.now() - 9 * 60000).toISOString(), unitsAssigned: 4 },
  { id: "sec3", title: "Crowd surge risk", zone: "Section 101 entry", severity: "medium", status: "open", reportedAt: new Date(Date.now() - 2 * 60000).toISOString(), unitsAssigned: 1 },
  { id: "sec4", title: "Ticket fraud detected", zone: "Gate A", severity: "low", status: "resolved", reportedAt: new Date(Date.now() - 40 * 60000).toISOString(), unitsAssigned: 1 },
];

const statusStyles: Record<SecurityAlert["status"], string> = {
  open: "bg-destructive/15 text-destructive border-destructive/30",
  investigating: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  contained: "bg-primary/15 text-primary border-primary/30",
  resolved: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
};

/**
 * Security Dashboard — Operations / Emergency module.
 * Surfaces active security alerts, severity, and unit deployment.
 */
export function SecurityDashboard({ alerts = mockAlerts }: SecurityDashboardProps) {
  const metrics: StatusMetric[] = useMemo(() => {
    const open = alerts.filter((a) => a.status === "open" || a.status === "investigating").length;
    const unitsDeployed = alerts.reduce((s, a) => (a.status !== "resolved" ? s + a.unitsAssigned : s), 0);
    const critical = alerts.filter((a) => a.severity === "critical" && a.status !== "resolved").length;

    return [
      { id: "open", label: "Open Alerts", value: open, tone: open > 0 ? "warning" : "success" },
      { id: "units", label: "Units Deployed", value: unitsDeployed, tone: "info" },
      { id: "critical", label: "Critical Alerts", value: critical, tone: critical > 0 ? "critical" : "success" },
    ];
  }, [alerts]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard metric={metrics[0]} icon={ShieldAlert} />
        <StatusCard metric={metrics[1]} icon={Users2} />
        <StatusCard metric={metrics[2]} icon={CheckCircle2} />
      </div>

      <Card className="border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Shield className="h-4 w-4 text-primary" />
            Security Alerts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {alerts.map((a) => {
            const priority = priorityStyles[a.severity];
            return (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-2 rounded-lg border border-border/60 p-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <Badge variant="outline" className={cn("text-[10px]", priority.badge)}>
                      {priority.label}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {a.zone} · {a.unitsAssigned} units · {relativeTime(a.reportedAt)}
                  </p>
                </div>
                <Badge variant="outline" className={cn("w-fit text-[10px] capitalize", statusStyles[a.status])}>
                  {a.status}
                </Badge>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default SecurityDashboard;
