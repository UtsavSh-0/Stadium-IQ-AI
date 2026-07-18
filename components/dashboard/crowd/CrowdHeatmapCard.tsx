// components/dashboard/crowd/CrowdHeatmapCard.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame } from "lucide-react";
import type { StadiumZone } from "@/types/crowd";
import { riskDotClasses, riskLabel } from "@/lib/crowd-risk-styles";
import { cn } from "@/lib/utils";

export interface CrowdHeatmapCardProps {
  zones: StadiumZone[];
  className?: string;
}

function intensityToClass(intensity: number) {
  if (intensity >= 92) return "bg-destructive/70";
  if (intensity >= 78) return "bg-orange-500/60";
  if (intensity >= 55) return "bg-amber-500/50";
  return "bg-emerald-500/40";
}

export function CrowdHeatmapCard({ zones, className }: CrowdHeatmapCardProps) {
  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Flame className="h-4 w-4 text-primary" />
          Live Crowd Heatmap
        </CardTitle>
        <span className="text-xs text-muted-foreground">Stadium Grid</span>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border/60 bg-muted/30">
          {/* Field marker */}
          <div className="absolute left-1/2 top-1/2 h-1/3 w-1/4 -translate-x-1/2 -translate-y-1/2 rounded-md border border-border/50 bg-background/40" />

          <AnimatePresence>
            {zones.map((zone) => (
              <motion.div
                key={zone.id}
                className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
                style={{ left: `${zone.x}%`, top: `${zone.y}%` }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  animate={{
                    scale: zone.riskLevel === "critical" ? [1, 1.15, 1] : 1,
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: zone.riskLevel === "critical" ? Infinity : 0,
                  }}
                  className={cn(
                    "flex h-14 w-14 items-center justify-center rounded-full text-xs font-semibold text-foreground shadow-sm",
                    intensityToClass(zone.intensity)
                  )}
                  title={`${zone.name}: ${zone.intensity}%`}
                >
                  {zone.intensity}%
                </motion.div>
                <span className="mt-1 max-w-[70px] truncate text-center text-[10px] text-muted-foreground">
                  {zone.name}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {(["low", "moderate", "high", "critical"] as const).map((level) => (
            <div key={level} className="flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", riskDotClasses[level])} />
              <span className="text-xs text-muted-foreground">{riskLabel[level]}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
