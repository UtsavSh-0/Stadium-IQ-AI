"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Restroom Finder — list restrooms on the active floor with live-style
 * (mock) occupancy so fans can pick the least busy option.
 *
 * Location: components/map/RestroomFinder.tsx
 */

import { useMemo } from "react";
import { DoorOpen } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationCard } from "@/components/map/NavigationCard";
import { RESTROOMS } from "@/lib/navigation-mock-data";
import { useNavigationStore } from "@/store/navigation-store";
import type { RestroomPOI } from "@/types/navigation";

export interface RestroomFinderProps {
  onNavigate: (poi: RestroomPOI) => void;
}

const genderLabel: Record<RestroomPOI["gender"], string> = {
  "all-gender": "All-gender",
  men: "Men",
  women: "Women",
  family: "Family",
  accessible: "Accessible",
};

export function RestroomFinder({ onNavigate }: RestroomFinderProps) {
  const activeFloor = useNavigationStore((s) => s.activeFloor);
  const selectedPOI = useNavigationStore((s) => s.selectedPOI);
  const selectPOI = useNavigationStore((s) => s.selectPOI);

  const results = useMemo(
    () =>
      RESTROOMS.filter((r) => r.floor === activeFloor).sort(
        (a, b) => a.occupancyPercent - b.occupancyPercent
      ),
    [activeFloor]
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <p className="text-xs text-muted-foreground">Sorted by lowest occupancy</p>
      <ScrollArea className="h-[360px] pr-2">
        <div className="flex flex-col gap-2">
          {results.map((restroom) => (
            <NavigationCard
              key={restroom.id}
              poi={restroom}
              icon={<DoorOpen className="h-4 w-4" />}
              meta={genderLabel[restroom.gender]}
              secondaryMeta={`${restroom.occupancyPercent}% occupied`}
              isActive={selectedPOI?.id === restroom.id}
              onSelect={selectPOI}
              onNavigate={onNavigate}
            />
          ))}
          {results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No restrooms on this floor.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
