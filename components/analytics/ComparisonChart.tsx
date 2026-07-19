"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { chartGridProps, chartLegendStyle, chartTooltipContentStyle, xAxisProps, yAxisProps } from "@/lib/chart-theme";
import type { ComparisonDataPoint } from "@/types/analytics";

export interface ComparisonChartProps {
  data: ComparisonDataPoint[];
  title?: string;
  description?: string;
  /** Unit suffix appended to tooltip/axis values, e.g. "M" for millions */
  unit?: string;
  className?: string;
}

/**
 * Reusable current-vs-previous comparison bar chart.
 * Driven entirely by props so it can compare revenue, attendance,
 * emissions, or any other metric pair.
 */
export function ComparisonChart({
  data,
  title = "Period Comparison",
  description = "Current period vs. previous period",
  unit = "",
}: ComparisonChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid {...chartGridProps} />
              <XAxis {...xAxisProps("label")} />
              <YAxis {...yAxisProps(48)} unit={unit} />
              <Tooltip contentStyle={chartTooltipContentStyle} formatter={(value: number) => `${value}${unit}`} />
              <Legend wrapperStyle={chartLegendStyle} />
              <Bar dataKey="previous" name="Previous Period" fill="hsl(var(--muted-foreground))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="current" name="Current Period" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
