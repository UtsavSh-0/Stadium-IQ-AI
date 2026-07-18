"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin as MapPinIcon, Maximize2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toneStyles } from "@/lib/operations-ui";
import type { MapPin } from "@/types/operations";

export interface MapsPlaceholderProps {
  title?: string;
  pins?: MapPin[];
  className?: string;
  onExpand?: () => void;
}

/**
 * Placeholder for the live stadium map (Mapbox/Leaflet to be integrated by the map module).
 * Renders mock pins over a grid so downstream teams can slot in a real map provider
 * without changing this component's public props.
 */
export function MapsPlaceholder({
  title = "Stadium Live Map",
  pins = [],
  className,
  onExpand,
}: MapsPlaceholderProps) {
  return (
    <Card className={cn("border-border/60 bg-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <MapPinIcon className="h-4 w-4 text-primary" />
          {title}
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onExpand}>
          <Maximize2 className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-dashed border-border bg-muted/40">
          {/* Grid backdrop standing in for a real map tile layer */}
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
              backgroundSize: "10% 12.5%",
            }}
          />
          {pins.map((pin) => {
            const tone = toneStyles[pin.tone];
            return (
              <motion.div
                key={pin.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18 }}
                className="group absolute -translate-x-1/2 -translate-y-full"
                style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
              >
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full border-2 border-background shadow-sm",
                    tone.dot
                  )}
                >
                  <MapPinIcon className="h-3.5 w-3.5 text-background" />
                </span>
                <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-1 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-[11px] text-popover-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                  {pin.label}
                </span>
              </motion.div>
            );
          })}
          {pins.length === 0 && (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              Map integration pending
            </div>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="outline" className="text-[11px]">
            {pins.length} active markers
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}

export default MapsPlaceholder;
