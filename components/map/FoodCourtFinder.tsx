"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Food Court Finder — list food & beverage vendors on the active floor,
 * sorted by shortest wait time.
 *
 * Location: components/map/FoodCourtFinder.tsx
 */

import { useMemo } from "react";
import { UtensilsCrossed } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationCard } from "@/components/map/NavigationCard";
import { FOOD_COURTS } from "@/lib/navigation-mock-data";
import { useNavigationStore } from "@/store/navigation-store";
import type { FoodCourtPOI } from "@/types/navigation";

export interface FoodCourtFinderProps {
  onNavigate: (poi: FoodCourtPOI) => void;
}

export function FoodCourtFinder({ onNavigate }: FoodCourtFinderProps) {
  const activeFloor = useNavigationStore((s) => s.activeFloor);
  const selectedPOI = useNavigationStore((s) => s.selectedPOI);
  const selectPOI = useNavigationStore((s) => s.selectPOI);

  const results = useMemo(
    () =>
      FOOD_COURTS.filter((f) => f.floor === activeFloor).sort(
        (a, b) => a.waitTimeMinutes - b.waitTimeMinutes
      ),
    [activeFloor]
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        Sorted by shortest wait time on {activeFloor === 0 ? "ground level" : `floor ${activeFloor}`}
      </p>
      <ScrollArea className="h-[360px] pr-2">
        <div className="flex flex-col gap-2">
          {results.map((court) => (
            <NavigationCard
              key={court.id}
              poi={court}
              icon={<UtensilsCrossed className="h-4 w-4" />}
              meta={`${court.cuisine} · ${court.priceTier}`}
              secondaryMeta={`~${court.waitTimeMinutes} min wait`}
              isActive={selectedPOI?.id === court.id}
              onSelect={selectPOI}
              onNavigate={onNavigate}
            />
          ))}
          {results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No food courts on this floor.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
