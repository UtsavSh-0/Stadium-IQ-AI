// components/dashboard/crowd/CrowdFlowChart.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeftRight } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { CongestionDataPoint } from "@/types/crowd";
import { cn } from "@/lib/utils";

export interface CrowdFlowChartProps {
  data: CongestionDataPoint[];
  className?: string;
}

export function CrowdFlowChart({ data, className }: CrowdFlowChartProps) {
  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ArrowLeftRight className="h-4 w-4 text-primary" />
          Inflow vs Outflow
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border/50" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "0.5rem",
                fontSize: "12px",
                color: "hsl(var(--popover-foreground))",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Bar
              dataKey="inflow"
              name="Inflow"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={500}
            />
            <Bar
              dataKey="outflow"
              name="Outflow"
              fill="hsl(var(--muted-foreground))"
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={500}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
