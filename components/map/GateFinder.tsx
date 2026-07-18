"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Gate Finder — main entry gates with mock status + queue level.
 *
 * Location: components/map/GateFinder.tsx
 */

import { useMemo } from "react";
import { DoorOpen, TriangleAlert } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { NavigationCard } from "@/components/map/NavigationCard";
import { GATES } from "@/lib/navigation-mock-data";
import { useNavigationStore } from "@/store/navigation-store";
import type { GatePOI } from "@/types/navigation";
import { cn } from "@/lib/utils";

export interface GateFinderProps {
  onNavigate: (poi: GatePOI) => void;
}

const statusStyles: Record<GatePOI["status"], string> = {
  open: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  delayed: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
  closed: "bg-muted text-muted-foreground border-border",
};

export function GateFinder({ onNavigate }: GateFinderProps) {
  const selectedPOI = useNavigationStore((s) => s.selectedPOI);
  const selectPOI = useNavigationStore((s) => s.selectPOI);

  const results = useMemo(() => GATES, []);

  return (
    <div className="flex h-full flex-col gap-3">
      <p className="text-xs text-muted-foreground">All gates · ground level</p>
      <ScrollArea className="h-[360px] pr-2">
        <div className="flex flex-col gap-2">
          {results.map((gate) => (
            <div key={gate.id} className="flex items-center gap-2">
              <div className="flex-1">
                <NavigationCard
                  poi={gate}
                  icon={<DoorOpen className="h-4 w-4" />}
                  meta={`Queue: ${gate.queueLevel}`}
                  secondaryMeta={gate.status === "closed" ? "Currently closed" : undefined}
                  isActive={selectedPOI?.id === gate.id}
                  onSelect={selectPOI}
                  onNavigate={onNavigate}
                />
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="flex flex-wrap gap-1.5">
        {results.map((gate) => (
          <Badge
            key={gate.id}
            variant="outline"
            className={cn("gap-1 capitalize", statusStyles[gate.status])}
          >
            {gate.status === "delayed" && <TriangleAlert className="h-3 w-3" />}
            {gate.gateCode} · {gate.status}
          </Badge>
        ))}
      </div>
    </div>
  );
}
