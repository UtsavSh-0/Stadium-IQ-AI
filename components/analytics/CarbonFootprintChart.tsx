"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Leaf } from "lucide-react";
import type { CarbonDataPoint } from "@/types/analytics";

export interface CarbonFootprintChartProps {
  data: CarbonDataPoint[];
  className?: string;
}

/** Emissions vs. offsets vs. sustainability target, per match. */
export function CarbonFootprintChart({ data }: CarbonFootprintChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Leaf className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
          <CardTitle>Carbon Footprint</CardTitle>
        </div>
        <CardDescription>Emissions vs. carbon offsets against target (metric tons CO₂e)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="emissionsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-4))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--chart-4))" stopOpacity={0.03} />
                </linearGradient>
                <linearGradient id="offsetFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0.03} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="date"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                tickLine={false}
                width={48}
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
              <Area
                type="monotone"
                dataKey="emissionsTons"
                name="Emissions (t)"
                stroke="hsl(var(--chart-4))"
                fill="url(#emissionsFill)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="offsetTons"
                name="Offset (t)"
                stroke="hsl(var(--chart-2))"
                fill="url(#offsetFill)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="targetTons"
                name="Target (t)"
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
