"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Zap } from "lucide-react";
import type { ElectricityUsageDataPoint } from "@/types/analytics";

export interface ElectricityUsageChartProps {
  data: ElectricityUsageDataPoint[];
  className?: string;
}

/** Renewable vs. grid electricity draw, stacked per match. */
export function ElectricityUsageChart({ data }: ElectricityUsageChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
          <CardTitle>Electricity Usage</CardTitle>
        </div>
        <CardDescription>Renewable vs. grid electricity draw (kWh)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
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
              <Bar
                dataKey="renewableKwh"
                name="Renewable (kWh)"
                stackId="electricity"
                fill="hsl(var(--chart-2))"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="gridKwh"
                name="Grid (kWh)"
                stackId="electricity"
                fill="hsl(var(--chart-4))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
