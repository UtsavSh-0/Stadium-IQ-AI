// components/dashboard/crowd/CrowdStatistics.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, AlertTriangle, Clock, TrendingUp, Map } from "lucide-react";
import type { CrowdStatSummary } from "@/types/crowd";
import { cn } from "@/lib/utils";

export interface CrowdStatisticsProps {
  stats: CrowdStatSummary[];
  className?: string;
}

const ICONS: Record<CrowdStatSummary["icon"], React.ElementType> = {
  users: Users,
  activity: Activity,
  alert: AlertTriangle,
  clock: Clock,
  trending: TrendingUp,
  map: Map,
};

export function CrowdStatistics({ stats, className }: CrowdStatisticsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 md:grid-cols-4", className)}>
      {stats.map((stat, i) => {
        const Icon = ICONS[stat.icon];
        const positive = stat.trend === "up" ? stat.change >= 0 : stat.change <= 0;

        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: i * 0.06 }}
          >
            <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-primary/10 p-2">
                    <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium",
                      positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive"
                    )}
                  >
                    {stat.change >= 0 ? "+" : ""}
                    {stat.change}%
                  </span>
                </div>
                <motion.p
                  key={stat.value}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 text-2xl font-semibold tracking-tight text-foreground"
                >
                  {stat.value}
                </motion.p>
                <p className="mt-1 text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
