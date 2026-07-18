"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Route Details — shown once a POI is selected and a mock route is built.
 * Displays step-by-step instructions, total distance and estimated time.
 *
 * Location: components/map/RouteDetailsPanel.tsx
 */

import { AnimatePresence, motion } from "framer-motion";
import { Accessibility, Clock, Footprints, MapPinCheck, Milestone, X } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useNavigationStore } from "@/store/navigation-store";

export function RouteDetailsPanel() {
  const route = useNavigationStore((s) => s.activeRoute);
  const setRoute = useNavigationStore((s) => s.setRoute);
  const selectPOI = useNavigationStore((s) => s.selectPOI);

  return (
    <AnimatePresence>
      {route && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="border-primary/30">
            <CardHeader className="flex flex-row items-start justify-between gap-2 pb-3">
              <div>
                <p className="text-xs text-muted-foreground">Route to</p>
                <h3 className="text-sm font-semibold leading-tight text-foreground">
                  {route.destination.name}
                </h3>
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => {
                  setRoute(null);
                  selectPOI(null);
                }}
                aria-label="Clear route"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex flex-col gap-4 pt-0">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="font-semibold text-foreground">{route.estimatedTimeMinutes} min</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Milestone className="h-4 w-4" />
                  {route.totalDistanceMeters} m
                </div>
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Footprints className="h-4 w-4" />
                  Walking
                </div>
                {route.accessibleRoute && (
                  <Badge variant="outline" className="ml-auto gap-1 border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400">
                    <Accessibility className="h-3 w-3" />
                    Accessible
                  </Badge>
                )}
              </div>

              <Separator />

              <ol className="flex flex-col gap-3">
                {route.steps.map((step, i) => (
                  <li key={`${route.id}-step-${i}`} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {i === route.steps.length - 1 ? <MapPinCheck className="h-3 w-3" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-foreground">{step.instruction}</p>
                      <p className="text-xs text-muted-foreground">{step.distanceMeters} m</p>
                    </div>
                  </li>
                ))}
              </ol>

              <p className="text-[11px] text-muted-foreground">
                From: {route.originLabel}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
