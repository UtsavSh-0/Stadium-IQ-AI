"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Siren, Megaphone, ShieldAlert, RadioTower } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusCard } from "@/components/dashboard/StatusCard";
import { relativeTime } from "@/lib/operations-ui";
import type { StatusMetric, EmergencyAlert } from "@/types/operations";

export interface EmergencyDashboardProps {
  alerts?: EmergencyAlert[];
  onBroadcast?: () => void;
}

const mockAlerts: EmergencyAlert[] = [
  {
    id: "e1",
    title: "Severe Weather Watch",
    level: "watch",
    zone: "Stadium-wide",
    message: "Storm cell tracking toward venue. Monitor for evacuation guidance.",
    issuedAt: new Date(Date.now() - 5 * 60000).toISOString(),
    active: true,
  },
  {
    id: "e2",
    title: "Section 101 Crowd Advisory",
    level: "warning",
    zone: "Section 101",
    message: "Elevated crowd density — stewards deployed to redirect flow.",
    issuedAt: new Date(Date.now() - 11 * 60000).toISOString(),
    active: true,
  },
];

const levelStyles: Record<EmergencyAlert["level"], string> = {
  watch: "bg-primary/15 text-primary border-primary/30",
  warning: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  critical: "bg-destructive/15 text-destructive border-destructive/30",
};

/**
 * Emergency Dashboard — top-level crisis control surface for Operations.
 * Distinct from IncidentDashboard: this focuses on stadium-wide alert levels
 * and the broadcast/PA action rather than per-incident case tracking.
 */
export function EmergencyDashboard({ alerts = mockAlerts, onBroadcast }: EmergencyDashboardProps) {
  const activeAlerts = alerts.filter((a) => a.active);

  const metrics: StatusMetric[] = useMemo(() => {
    const critical = alerts.filter((a) => a.level === "critical" && a.active).length;
    const warning = alerts.filter((a) => a.level === "warning" && a.active).length;

    return [
      { id: "active", label: "Active Alerts", value: activeAlerts.length, tone: activeAlerts.length > 0 ? "warning" : "success" },
      { id: "critical", label: "Critical Level", value: critical, tone: critical > 0 ? "critical" : "success" },
      { id: "warning", label: "Warning Level", value: warning, tone: warning > 0 ? "warning" : "success" },
    ];
  }, [alerts, activeAlerts.length]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard metric={metrics[0]} icon={Siren} />
        <StatusCard metric={metrics[1]} icon={ShieldAlert} />
        <StatusCard metric={metrics[2]} icon={RadioTower} />
      </div>

      <Card className="border-destructive/30 bg-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <Siren className="h-4 w-4 text-destructive" />
            Stadium-wide Emergency Alerts
          </CardTitle>
          <Button size="sm" variant="destructive" className="gap-1.5" onClick={onBroadcast}>
            <Megaphone className="h-3.5 w-3.5" />
            Broadcast PA Alert
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          <AnimatePresence initial={false}>
            {activeAlerts.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No active stadium-wide alerts
              </p>
            )}
            {activeAlerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-lg border border-border/60 p-3.5"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{alert.title}</p>
                    <Badge variant="outline" className={cn("text-[10px] capitalize", levelStyles[alert.level])}>
                      {alert.level}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">{relativeTime(alert.issuedAt)}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{alert.message}</p>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">Zone: {alert.zone}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default EmergencyDashboard;
