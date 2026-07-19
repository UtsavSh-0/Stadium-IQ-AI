"use client";

import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { chartGridProps, chartLegendStyle, chartTooltipContentStyle, xAxisProps, yAxisProps } from "@/lib/chart-theme";
import type { AttendanceDataPoint } from "@/types/analytics";

export interface AttendanceChartProps {
  data: AttendanceDataPoint[];
  className?: string;
}

/**
 * Actual attendance vs. venue capacity across recent matches,
 * with a utilization line overlay.
 */
export function AttendanceChart({ data }: AttendanceChartProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Attendance Overview</CardTitle>
        <CardDescription>Actual attendance vs. venue capacity by match</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 16, left: -8, bottom: 0 }}>
              <CartesianGrid {...chartGridProps} />
              <XAxis {...xAxisProps("date")} />
              <YAxis {...yAxisProps(56)} />
              <Tooltip
                contentStyle={chartTooltipContentStyle}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.match ?? ""}
              />
              <Legend wrapperStyle={chartLegendStyle} />
              <defs>
                <linearGradient id="attendanceFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="actual"
                name="Actual Attendance"
                stroke="hsl(var(--chart-1))"
                fill="url(#attendanceFill)"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="capacity"
                name="Venue Capacity"
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="4 4"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
