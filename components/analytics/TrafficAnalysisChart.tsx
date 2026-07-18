"use client";

import {
  Line,
  LineChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TrafficDataPoint } from "@/types/analytics";

export interface TrafficAnalysisChartProps {
  data: TrafficDataPoint[];
  className?: string;
}

const CONGESTION_BADGE_CLASS: Record<TrafficDataPoint["congestionLevel"], string> = {
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/15",
  medium: "bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15",
  high: "bg-orange-500/15 text-orange-600 dark:text-orange-400 hover:bg-orange-500/15",
  severe: "bg-destructive/15 text-destructive hover:bg-destructive/15",
};

/**
 * Inbound/outbound vehicle flow and transit ridership over the match-day
 * timeline, with a current congestion badge.
 */
export function TrafficAnalysisChart({ data }: TrafficAnalysisChartProps) {
  const latest = data[data.length - 1];

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Traffic &amp; Transit Analysis</CardTitle>
          <CardDescription>Vehicle flow and transit ridership by match-day hour</CardDescription>
        </div>
        {latest && (
          <Badge className={cn("border-none capitalize", CONGESTION_BADGE_CLASS[latest.congestionLevel])}>
            {latest.congestionLevel} congestion
          </Badge>
        )}
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="time"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                width={56}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "hsl(var(--popover-foreground))",
                }}
              />
              <Legend wrapperStyle={{ fontSize: 12, color: "hsl(var(--muted-foreground))" }} />
              <Line
                type="monotone"
                dataKey="inboundVehicles"
                name="Inbound Vehicles"
                stroke="hsl(var(--chart-1))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="outboundVehicles"
                name="Outbound Vehicles"
                stroke="hsl(var(--chart-4))"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="transitRiders"
                name="Transit Riders"
                stroke="hsl(var(--chart-2))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
