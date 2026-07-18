"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Bus, Train, Navigation, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusCard } from "@/components/dashboard/StatusCard";
import type { StatusMetric, TransportRoute } from "@/types/operations";

export interface TransportDashboardProps {
  routes?: TransportRoute[];
}

const mockRoutes: TransportRoute[] = [
  { id: "r1", name: "Shuttle Line 1", type: "shuttle", from: "Downtown Hub", to: "Stadium Gate A", status: "on-time", capacityPercent: 62, nextDeparture: "14:10", etaMinutes: 8 },
  { id: "r2", name: "Metro Red Line", type: "metro", from: "Central Station", to: "Stadium Metro", status: "delayed", capacityPercent: 91, nextDeparture: "14:05", etaMinutes: 14 },
  { id: "r3", name: "Fan Bus Express", type: "bus", from: "Airport Terminal 2", to: "Stadium Gate C", status: "on-time", capacityPercent: 44, nextDeparture: "14:20", etaMinutes: 22 },
  { id: "r4", name: "Regional Rail", type: "rail", from: "North Junction", to: "Stadium Rail Link", status: "disrupted", capacityPercent: 78, nextDeparture: "—", etaMinutes: 0 },
  { id: "r5", name: "Shuttle Line 2", type: "shuttle", from: "Park & Ride East", to: "Stadium Gate B", status: "on-time", capacityPercent: 55, nextDeparture: "14:12", etaMinutes: 6 },
];

const typeIcon: Record<TransportRoute["type"], typeof Bus> = {
  shuttle: Bus,
  bus: Bus,
  metro: Train,
  rail: Train,
};

const statusStyles: Record<TransportRoute["status"], string> = {
  "on-time": "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  delayed: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  disrupted: "bg-destructive/15 text-destructive border-destructive/30",
  cancelled: "bg-muted text-muted-foreground border-border",
};

/**
 * Transport Dashboard — Operations module.
 * Monitors shuttle, metro, bus and rail routes feeding the stadium precinct.
 */
export function TransportDashboard({ routes = mockRoutes }: TransportDashboardProps) {
  const metrics: StatusMetric[] = useMemo(() => {
    const onTime = routes.filter((r) => r.status === "on-time").length;
    const disrupted = routes.filter((r) => r.status === "disrupted" || r.status === "cancelled").length;
    const avgCapacity = Math.round(
      routes.reduce((sum, r) => sum + r.capacityPercent, 0) / (routes.length || 1)
    );

    return [
      { id: "on-time", label: "Routes On Time", value: onTime, unit: `/ ${routes.length}`, tone: "success" },
      { id: "capacity", label: "Avg. Capacity", value: avgCapacity, unit: "%", tone: avgCapacity > 85 ? "warning" : "info" },
      { id: "disrupted", label: "Disrupted Routes", value: disrupted, tone: disrupted > 0 ? "critical" : "success" },
    ];
  }, [routes]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard metric={metrics[0]} icon={Navigation} />
        <StatusCard metric={metrics[1]} icon={Bus} />
        <StatusCard metric={metrics[2]} icon={AlertCircle} />
      </div>

      <Card className="border-border/60 bg-card">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Route Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {routes.map((route) => {
            const Icon = typeIcon[route.type];
            return (
              <motion.div
                key={route.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-3 rounded-lg border border-border/60 p-3.5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-4.5 w-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{route.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {route.from} → {route.to}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:w-1/3">
                  <div className="flex-1">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
                      <span>Capacity</span>
                      <span>{route.capacityPercent}%</span>
                    </div>
                    <Progress value={route.capacityPercent} className="h-1.5" />
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:w-auto">
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Next: {route.nextDeparture}</p>
                    <p>ETA {route.etaMinutes}m</p>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] capitalize", statusStyles[route.status])}>
                    {route.status.replace("-", " ")}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default TransportDashboard;
