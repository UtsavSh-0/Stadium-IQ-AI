import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    direction: "up" | "down";
    /** true if an upward trend is a good outcome for this metric */
    isPositive: boolean;
  };
  accent?: "primary" | "info" | "warning" | "destructive" | "success";
}

const accentClasses: Record<NonNullable<StatCardProps["accent"]>, string> = {
  primary: "bg-primary/12 text-primary",
  info: "bg-info/12 text-info",
  warning: "bg-warning/12 text-warning",
  destructive: "bg-destructive/12 text-destructive",
  success: "bg-success/12 text-success",
};

/**
 * StatCard — the standard KPI tile for dashboard/analytics-style module
 * headers. Keep this generic (label/value/trend); module-specific stat
 * logic belongs in the consuming feature component.
 */
export function StatCard({ label, value, icon: Icon, trend, accent = "primary" }: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="mt-1.5 font-mono text-2xl font-semibold tracking-tight text-foreground">
            {value}
          </p>
          {trend && (
            <div
              className={cn(
                "mt-1.5 inline-flex items-center gap-1 text-xs font-medium",
                trend.isPositive ? "text-success" : "text-destructive"
              )}
            >
              {trend.direction === "up" ? (
                <ArrowUpRight className="h-3.5 w-3.5" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5" />
              )}
              {trend.value}
            </div>
          )}
        </div>
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-md", accentClasses[accent])}>
          <Icon className="h-4.5 w-4.5" />
        </div>
      </CardContent>
    </Card>
  );
}
