"use client";

import * as React from "react";
import { ResponsiveContainer } from "recharts";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export interface ChartContainerProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  height?: number;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  className?: string;
  children: React.ReactElement;
}

/**
 * ChartContainer — the shared shell every module (analytics, transport,
 * emergency, etc.) should wrap its Recharts chart in. Owns title, loading
 * skeleton, empty state, and responsive sizing so charts stay visually
 * consistent across modules. Pass a single Recharts chart element as
 * children; do not build one-off card+chart wrappers in feature modules.
 */
export function ChartContainer({
  title,
  description,
  action,
  height = 280,
  isLoading,
  isEmpty,
  emptyMessage = "No data available yet",
  className,
  children,
}: ChartContainerProps) {
  return (
    <div className={cn("rounded-lg border border-border bg-card p-5", className)}>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </div>

      {isLoading ? (
        <Skeleton style={{ height }} className="w-full" />
      ) : isEmpty ? (
        <div
          style={{ height }}
          className="flex items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground"
        >
          {emptyMessage}
        </div>
      ) : (
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            {children}
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
