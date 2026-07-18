"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Floor Selector — vertical stack of floor buttons overlaid on the map.
 *
 * Location: components/map/FloorSelector.tsx
 */

import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FLOORS } from "@/lib/navigation-mock-data";
import { useNavigationStore } from "@/store/navigation-store";

export function FloorSelector() {
  const activeFloor = useNavigationStore((s) => s.activeFloor);
  const setActiveFloor = useNavigationStore((s) => s.setActiveFloor);

  return (
    <div className="pointer-events-auto flex flex-col items-center gap-1.5 rounded-xl border border-border bg-card/90 p-1.5 shadow-lg backdrop-blur">
      <Layers className="mb-0.5 h-3.5 w-3.5 text-muted-foreground" />
      {FLOORS.slice()
        .reverse()
        .map((floor) => {
          const isActive = floor.id === activeFloor;
          return (
            <Button
              key={floor.id}
              type="button"
              variant="ghost"
              size="icon"
              title={floor.label}
              onClick={() => setActiveFloor(floor.id)}
              className={cn(
                "relative h-9 w-9 rounded-lg text-xs font-semibold text-muted-foreground hover:text-foreground",
                isActive && "text-primary-foreground hover:text-primary-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="floor-selector-active"
                  className="absolute inset-0 rounded-lg bg-primary"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <span className="relative z-10">{floor.shortLabel}</span>
            </Button>
          );
        })}
    </div>
  );
}
