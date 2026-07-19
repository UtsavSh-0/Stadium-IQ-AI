"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Parking Finder — surface lots on the ground level with live-style
 * (mock) availability counts.
 *
 * Location: components/map/ParkingFinder.tsx
 */

import { useMemo } from "react";
import { CircleParking } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { NavigationCard } from "@/components/map/NavigationCard";
import { PARKING } from "@/lib/mock/navigation-mock-data";
import { useNavigationStore } from "@/store/navigation-store";
import type { ParkingPOI } from "@/types/navigation";

export interface ParkingFinderProps {
  onNavigate: (poi: ParkingPOI) => void;
}

export function ParkingFinder({ onNavigate }: ParkingFinderProps) {
  const selectedPOI = useNavigationStore((s) => s.selectedPOI);
  const selectPOI = useNavigationStore((s) => s.selectPOI);

  const results = useMemo(
    () => [...PARKING].sort((a, b) => b.spotsAvailable - a.spotsAvailable),
    []
  );

  return (
    <div className="flex h-full flex-col gap-3">
      <p className="text-xs text-muted-foreground">Available at all lots · ground level</p>
      <ScrollArea className="h-[360px] pr-2">
        <div className="flex flex-col gap-3">
          {results.map((lot) => {
            const pct = Math.round((lot.spotsAvailable / lot.spotsTotal) * 100);
            return (
              <div key={lot.id} className="flex flex-col gap-1.5">
                <NavigationCard
                  poi={lot}
                  icon={<CircleParking className="h-4 w-4" />}
                  meta={`${lot.spotsAvailable}/${lot.spotsTotal} spots free`}
                  secondaryMeta={`${lot.walkTimeMinutes} min walk to nearest gate`}
                  isActive={selectedPOI?.id === lot.id}
                  onSelect={selectPOI}
                  onNavigate={onNavigate}
                />
                <Progress value={pct} className="ml-1 h-1.5 w-[calc(100%-0.5rem)]" />
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
