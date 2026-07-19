import type * as React from "react";

/**
 * lib/chart-theme.ts
 *
 * Single source of truth for the Recharts styling that was previously
 * copy-pasted into every chart in components/analytics (axis ticks,
 * grid, tooltip, legend). Import these instead of redefining inline
 * objects — keeps every chart visually identical while removing ~10
 * duplicated lines per file.
 *
 * Visual output is unchanged: values were copied verbatim from the
 * existing chart components.
 */

export const chartGridProps = {
  strokeDasharray: "3 3",
  stroke: "hsl(var(--border))",
} as const;

export const chartAxisTick = {
  fill: "hsl(var(--muted-foreground))",
  fontSize: 12,
} as const;

export const chartAxisLine = {
  stroke: "hsl(var(--border))",
} as const;

/** Common XAxis props; spread and override `dataKey` per chart. */
export function xAxisProps(dataKey: string) {
  return {
    dataKey,
    tick: chartAxisTick,
    axisLine: chartAxisLine,
    tickLine: false as const,
  };
}

/** Common YAxis props; override `width` per chart when labels are wider. */
export function yAxisProps(width = 48) {
  return {
    tick: chartAxisTick,
    axisLine: chartAxisLine,
    tickLine: false as const,
    width,
  };
}

export const chartTooltipContentStyle: React.CSSProperties = {
  backgroundColor: "hsl(var(--popover))",
  border: "1px solid hsl(var(--border))",
  borderRadius: "var(--radius)",
  color: "hsl(var(--popover-foreground))",
};

export const chartLegendStyle: React.CSSProperties = {
  fontSize: 12,
  color: "hsl(var(--muted-foreground))",
};
