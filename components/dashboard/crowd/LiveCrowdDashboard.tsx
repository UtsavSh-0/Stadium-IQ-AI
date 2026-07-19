// components/dashboard/crowd/LiveCrowdDashboard.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Radio, Pause, Play, RefreshCcw } from "lucide-react";
import { useCrowdSimulation } from "@/hooks/use-crowd-simulation";
import { CrowdStatistics } from "@/components/dashboard/crowd/CrowdStatistics";
import { CrowdHeatmapCard } from "@/components/dashboard/crowd/CrowdHeatmapCard";
import { CongestionChart } from "@/components/dashboard/crowd/CongestionChart";
import { CrowdFlowChart } from "@/components/dashboard/crowd/CrowdFlowChart";
import { OccupancyCard } from "@/components/dashboard/crowd/OccupancyCard";
import { QueueCard } from "@/components/dashboard/crowd/QueueCard";
import { PredictionCard } from "@/components/dashboard/crowd/PredictionCard";
import { CrowdTimeline } from "@/components/dashboard/crowd/CrowdTimeline";
import { AlertCard } from "@/components/dashboard/crowd/AlertCard";
import { cn } from "@/lib/utils";

export interface LiveCrowdDashboardProps {
  className?: string;
}

export function LiveCrowdDashboard({ className }: LiveCrowdDashboardProps) {
  const { data, isLive, toggleLive, refresh } = useCrowdSimulation({ intervalMs: 4000 });
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());

  const visibleAlerts = data.alerts.filter((a) => !acknowledgedIds.has(a.id));

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Crowd Intelligence
            </h1>
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                !isLive && "border-muted-foreground/30 bg-muted text-muted-foreground"
              )}
            >
              <motion.span
                animate={isLive ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
                transition={{ duration: 1.4, repeat: isLive ? Infinity : 0 }}
                className={cn("h-1.5 w-1.5 rounded-full", isLive ? "bg-emerald-500" : "bg-muted-foreground")}
              />
              <Radio className="h-3 w-3" />
              {isLive ? "Live" : "Paused"}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Real-time density, flow, and predictive monitoring across all stadium zones · Updated{" "}
            {data.lastUpdated}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={refresh} className="gap-1.5">
            <RefreshCcw className="h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button size="sm" variant={isLive ? "secondary" : "default"} onClick={toggleLive} className="gap-1.5">
            {isLive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
            {isLive ? "Pause" : "Resume"}
          </Button>
        </div>
      </div>

      {/* Stats */}
      <CrowdStatistics stats={data.stats} />

      {/* Heatmap + Predictions */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <CrowdHeatmapCard zones={data.zones} className="xl:col-span-2" />
        <PredictionCard predictions={data.predictions} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CongestionChart data={data.congestionHistory} />
        <CrowdFlowChart data={data.congestionHistory} />
      </div>

      {/* Occupancy + Queues */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <OccupancyCard occupancy={data.occupancyData} />
        <QueueCard queues={data.queues} />
      </div>

      {/* Timeline + Alerts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CrowdTimeline events={data.timeline} />
        <AlertCard
          alerts={visibleAlerts}
          onAcknowledge={(id) => setAcknowledgedIds((prev) => new Set(prev).add(id))}
        />
      </div>
    </div>
  );
}
