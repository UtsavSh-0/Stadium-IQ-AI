"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParkingCircle, ShieldCheck, Accessibility, Newspaper, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatusCard } from "@/components/dashboard/StatusCard";
import type { StatusMetric, ParkingZone } from "@/types/operations";

export interface ParkingDashboardProps {
  zones?: ParkingZone[];
}

const mockZones: ParkingZone[] = [
  { id: "p1", name: "General Lot North", zoneType: "general", totalSpots: 1200, occupiedSpots: 860, status: "filling-fast" },
  { id: "p2", name: "General Lot South", zoneType: "general", totalSpots: 950, occupiedSpots: 410, status: "available" },
  { id: "p3", name: "VIP Deck", zoneType: "vip", totalSpots: 150, occupiedSpots: 148, status: "full" },
  { id: "p4", name: "Staff & Volunteer Lot", zoneType: "staff", totalSpots: 300, occupiedSpots: 210, status: "available" },
  { id: "p5", name: "Accessible Parking", zoneType: "accessible", totalSpots: 80, occupiedSpots: 52, status: "available" },
  { id: "p6", name: "Media Compound", zoneType: "media", totalSpots: 120, occupiedSpots: 118, status: "filling-fast" },
];

const zoneIcon: Record<ParkingZone["zoneType"], typeof Car> = {
  general: Car,
  vip: ShieldCheck,
  staff: ParkingCircle,
  accessible: Accessibility,
  media: Newspaper,
};

const statusStyles: Record<ParkingZone["status"], string> = {
  available: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  "filling-fast": "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  full: "bg-destructive/15 text-destructive border-destructive/30",
  closed: "bg-muted text-muted-foreground border-border",
};

function progressTone(percent: number) {
  if (percent >= 95) return "bg-destructive";
  if (percent >= 80) return "bg-amber-500";
  return "bg-primary";
}

/**
 * Parking Dashboard — Operations module.
 * Tracks live occupancy across general, VIP, staff, accessible and media parking zones.
 */
export function ParkingDashboard({ zones = mockZones }: ParkingDashboardProps) {
  const metrics: StatusMetric[] = useMemo(() => {
    const totalSpots = zones.reduce((s, z) => s + z.totalSpots, 0);
    const occupied = zones.reduce((s, z) => s + z.occupiedSpots, 0);
    const full = zones.filter((z) => z.status === "full").length;
    const occupancyPercent = totalSpots ? Math.round((occupied / totalSpots) * 100) : 0;

    return [
      { id: "occupancy", label: "Overall Occupancy", value: occupancyPercent, unit: "%", tone: occupancyPercent > 85 ? "warning" : "info" },
      { id: "available", label: "Spots Available", value: totalSpots - occupied, tone: "success" },
      { id: "full-zones", label: "Full Zones", value: full, tone: full > 0 ? "critical" : "success" },
    ];
  }, [zones]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatusCard metric={metrics[0]} icon={ParkingCircle} />
        <StatusCard metric={metrics[1]} icon={Car} />
        <StatusCard metric={metrics[2]} icon={ShieldCheck} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {zones.map((zone) => {
          const Icon = zoneIcon[zone.zoneType];
          const percent = Math.round((zone.occupiedSpots / zone.totalSpots) * 100);
          return (
            <motion.div
              key={zone.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
            >
              <Card className="border-border/60 bg-card">
                <CardContent className="space-y-3 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-medium text-foreground">{zone.name}</p>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] capitalize", statusStyles[zone.status])}>
                      {zone.status.replace("-", " ")}
                    </Badge>
                  </div>

                  <div>
                    <div className="mb-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>
                        {zone.occupiedSpots} / {zone.totalSpots} spots
                      </span>
                      <span>{percent}%</span>
                    </div>
                    <Progress value={percent} className={cn("h-2", progressTone(percent))} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

export default ParkingDashboard;
