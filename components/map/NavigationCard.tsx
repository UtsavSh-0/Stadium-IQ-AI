"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Reusable result card used by every "finder" panel (seats, food, restrooms,
 * exits, parking, gates). Keeps a single consistent look across the module.
 *
 * Location: components/map/NavigationCard.tsx
 */

import { motion } from "framer-motion";
import { MapPin, Navigation2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { NavigationPOI } from "@/types/navigation";

const crowdBadgeVariant: Record<NavigationPOI["crowdLevel"], string> = {
  low: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  moderate: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  high: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
};

export interface NavigationCardProps<T extends NavigationPOI = NavigationPOI> {
  poi: T;
  icon: React.ReactNode;
  /** Small line of metadata specific to the POI category, e.g. "Row F · Seat 12" */
  meta: string;
  /** Optional secondary line, e.g. wait time or availability */
  secondaryMeta?: string;
  isActive?: boolean;
  onSelect?: (poi: T) => void;
  onNavigate?: (poi: T) => void;
}

export function NavigationCard<T extends NavigationPOI>({
  poi,
  icon,
  meta,
  secondaryMeta,
  isActive = false,
  onSelect,
  onNavigate,
}: NavigationCardProps<T>) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        role="button"
        tabIndex={0}
        onClick={() => onSelect?.(poi)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onSelect?.(poi);
        }}
        className={cn(
          "cursor-pointer border transition-colors hover:border-primary/50 hover:bg-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive && "border-primary bg-accent/50 ring-1 ring-primary/40"
        )}
      >
        <CardContent className="flex items-center gap-3 p-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-medium text-foreground">{poi.name}</p>
              <Badge
                variant="outline"
                className={cn("h-5 shrink-0 px-1.5 text-[10px] font-medium capitalize", crowdBadgeVariant[poi.crowdLevel])}
              >
                {poi.crowdLevel}
              </Badge>
            </div>
            <p className="truncate text-xs text-muted-foreground">{meta}</p>
            {secondaryMeta && (
              <p className="truncate text-xs text-muted-foreground/80">{secondaryMeta}</p>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-end gap-1">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {poi.distanceMeters}m
            </span>
            <Button
              size="sm"
              variant="secondary"
              className="h-7 gap-1 px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(poi);
              }}
            >
              <Navigation2 className="h-3 w-3" />
              Go
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
