"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { chartAxisLine, chartAxisTick, chartGridProps, chartTooltipContentStyle } from "@/lib/chart-theme";
import type { CrowdZoneDensity } from "@/types/analytics";

export interface CrowdAnalysisChartProps {
  zones: CrowdZoneDensity[];
  className?: string;
}

const STATUS_COLOR_VAR: Record<CrowdZoneDensity["status"], string> = {
  normal: "hsl(var(--chart-2))",
  moderate: "hsl(var(--chart-3))",
  high: "hsl(var(--chart-4))",
  critical: "hsl(var(--destructive))",
};

const STATUS_BADGE_CLASS: Record<CrowdZoneDensity["status"], string> = {
  normal: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15",
  moderate: "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15",
  high: "bg-orange-500/15 text-orange-600 dark:text-orange-400 hover:bg-orange-500/15",
  critical: "bg-destructive/15 text-destructive hover:bg-destructive/15",
};

/**
 * Real-time crowd density breakdown by stadium zone.
 * Bars are colored by status severity; a legend list gives exact figures.
 */
export function CrowdAnalysisChart({ zones }: CrowdAnalysisChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Crowd Density Analysis</CardTitle>
        <CardDescription>Live occupancy by stadium zone</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={zones} layout="vertical" margin={{ top: 0, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid {...chartGridProps} horizontal={false} />
              <XAxis
                type="number"
                domain={[0, 100]}
                tick={chartAxisTick}
                axisLine={chartAxisLine}
                tickLine={false}
                unit="%"
              />
              <YAxis
                type="category"
                dataKey="zone"
                width={130}
                tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                axisLine={chartAxisLine}
                tickLine={false}
              />
              <Tooltip contentStyle={chartTooltipContentStyle} formatter={(value: number) => [`${value}%`, "Density"]} />
              <Bar dataKey="densityPercent" radius={[0, 6, 6, 0]} barSize={18}>
                {zones.map((z) => (
                  <Cell key={z.zone} fill={STATUS_COLOR_VAR[z.status]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {zones.map((z) => (
            <li
              key={z.zone}
              className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm"
            >
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{z.zone}</span>
                <span className="text-xs text-muted-foreground">
                  {z.currentOccupancy.toLocaleString()} / {z.maxCapacity.toLocaleString()}
                </span>
              </div>
              <Badge className={cn("border-none capitalize", STATUS_BADGE_CLASS[z.status])}>
                {z.status}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
