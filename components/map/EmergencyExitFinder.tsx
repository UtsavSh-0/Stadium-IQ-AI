"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Emergency Exit Finder — always shows the nearest primary exits first.
 * Kept visually distinct (destructive accent) since this is safety-critical.
 *
 * Location: components/map/EmergencyExitFinder.tsx
 */

import { useMemo } from "react";
import { DoorClosed, ShieldAlert } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { NavigationCard } from "@/components/map/NavigationCard";
import { EXITS } from "@/lib/navigation-mock-data";
import { useNavigationStore } from "@/store/navigation-store";
import type { EmergencyExitPOI } from "@/types/navigation";

export interface EmergencyExitFinderProps {
  onNavigate: (poi: EmergencyExitPOI) => void;
}

export function EmergencyExitFinder({ onNavigate }: EmergencyExitFinderProps) {
  const activeFloor = useNavigationStore((s) => s.activeFloor);
  const selectedPOI = useNavigationStore((s) => s.selectedPOI);
  const selectPOI = useNavigationStore((s) => s.selectPOI);

  const results = useMemo(
    () =>
      EXITS.filter((e) => e.floor === activeFloor).sort(
        (a, b) => Number(b.isPrimary) - Number(a.isPrimary) || a.distanceMeters - b.distanceMeters
      ),
    [activeFloor]
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
        <ShieldAlert className="h-4 w-4 shrink-0" />
        In a real emergency, follow on-site staff and illuminated signage.
      </div>
      <ScrollArea className="h-[330px] pr-2">
        <div className="flex flex-col gap-2">
          {results.map((exit) => (
            <NavigationCard
              key={exit.id}
              poi={exit}
              icon={<DoorClosed className="h-4 w-4" />}
              meta={exit.exitCode}
              secondaryMeta={
                exit.isPrimary ? "Primary exit" : `Capacity ${exit.capacityPerMinute}/min`
              }
              isActive={selectedPOI?.id === exit.id}
              onSelect={selectPOI}
              onNavigate={onNavigate}
            />
          ))}
          {results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No exits mapped on this floor.
            </p>
          )}
        </div>
      </ScrollArea>
      <div className="flex flex-wrap gap-1.5">
        {results.filter((e) => e.isPrimary).slice(0, 3).map((e) => (
          <Badge key={e.id} variant="outline" className="border-destructive/40 text-destructive">
            {e.exitCode}
          </Badge>
        ))}
      </div>
    </div>
  );
}
