"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Legend — explains marker colors/icons and toggles the heatmap overlay.
 * Collapsible to save space on smaller screens.
 *
 * Location: components/map/MapLegend.tsx
 */

import { AnimatePresence, motion } from "framer-motion";
import {
  Armchair,
  ChevronDown,
  CircleParking,
  DoorClosed,
  DoorOpen,
  Flame,
  UtensilsCrossed,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigationStore } from "@/store/navigation-store";

const legendItems = [
  { icon: Armchair, label: "Seats", colorClass: "text-sky-500" },
  { icon: UtensilsCrossed, label: "Food Court", colorClass: "text-amber-500" },
  { icon: DoorOpen, label: "Restroom", colorClass: "text-violet-500" },
  { icon: DoorClosed, label: "Emergency Exit", colorClass: "text-rose-500" },
  { icon: CircleParking, label: "Parking", colorClass: "text-emerald-500" },
  { icon: DoorOpen, label: "Gate", colorClass: "text-cyan-500" },
];

export function MapLegend() {
  const legendOpen = useNavigationStore((s) => s.legendOpen);
  const toggleLegend = useNavigationStore((s) => s.toggleLegend);
  const heatmapVisible = useNavigationStore((s) => s.heatmapVisible);
  const toggleHeatmap = useNavigationStore((s) => s.toggleHeatmap);

  return (
    <div className="pointer-events-auto w-52 overflow-hidden rounded-xl border border-border bg-card/90 shadow-lg backdrop-blur">
      <Button
        type="button"
        variant="ghost"
        onClick={toggleLegend}
        className="flex h-9 w-full items-center justify-between rounded-none px-3 text-xs font-semibold"
      >
        Legend
        <ChevronDown
          className={cn("h-3.5 w-3.5 transition-transform", legendOpen && "rotate-180")}
        />
      </Button>

      <AnimatePresence initial={false}>
        {legendOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border"
          >
            <div className="flex flex-col gap-1.5 p-3">
              {legendItems.map(({ icon: Icon, label, colorClass }) => (
                <div key={label} className="flex items-center gap-2 text-xs text-foreground">
                  <Icon className={cn("h-3.5 w-3.5", colorClass)} />
                  {label}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between gap-2 border-t border-border px-3 py-2.5">
              <Label htmlFor="heatmap-toggle" className="flex items-center gap-1.5 text-xs">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                Crowd heatmap
              </Label>
              <Switch id="heatmap-toggle" checked={heatmapVisible} onCheckedChange={toggleHeatmap} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
