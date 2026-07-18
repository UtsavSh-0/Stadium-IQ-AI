// components/dashboard/crowd/OccupancyCard.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { OccupancyData } from "@/types/crowd";
import { riskBarClasses } from "@/lib/crowd-risk-styles";
import { riskFromPercentageLocal } from "@/components/dashboard/crowd/_helpers";
import { cn } from "@/lib/utils";

export interface OccupancyCardProps {
  occupancy: OccupancyData[];
  className?: string;
}

const TREND_ICON = {
  up: TrendingUp,
  down: TrendingDown,
  stable: Minus,
} as const;

export function OccupancyCard({ occupancy, className }: OccupancyCardProps) {
  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Building2 className="h-4 w-4 text-primary" />
          Zone Occupancy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {occupancy.map((zone, i) => {
          const risk = riskFromPercentageLocal(zone.percentage);
          const TrendIcon = TREND_ICON[zone.trend];
          return (
            <motion.div
              key={zone.zoneId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: i * 0.04 }}
            >
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{zone.zoneName}</span>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <TrendIcon className="h-3 w-3" />
                  <span>
                    {zone.occupancy.toLocaleString()} / {zone.capacity.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <motion.div
                  className={cn("h-full rounded-full", riskBarClasses[risk])}
                  initial={{ width: 0 }}
                  animate={{ width: `${zone.percentage}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
