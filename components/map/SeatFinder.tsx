"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Seat Finder — search + list seats, filtered by the active floor.
 *
 * Location: components/map/SeatFinder.tsx
 */

import { useMemo, useState } from "react";
import { Armchair, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NavigationCard } from "@/components/map/NavigationCard";
import { SEATS } from "@/lib/mock/navigation-mock-data";
import { useNavigationStore } from "@/store/navigation-store";
import type { SeatPOI } from "@/types/navigation";

export interface SeatFinderProps {
  onNavigate: (poi: SeatPOI) => void;
}

export function SeatFinder({ onNavigate }: SeatFinderProps) {
  const [query, setQuery] = useState("");
  const activeFloor = useNavigationStore((s) => s.activeFloor);
  const selectedPOI = useNavigationStore((s) => s.selectedPOI);
  const selectPOI = useNavigationStore((s) => s.selectPOI);

  const results = useMemo(() => {
    return SEATS.filter((seat) => seat.floor === activeFloor).filter((seat) =>
      `${seat.name} ${seat.section} ${seat.row}`.toLowerCase().includes(query.toLowerCase())
    );
  }, [activeFloor, query]);

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search section, row or seat…"
          className="pl-8"
        />
      </div>

      <ScrollArea className="h-[360px] pr-2">
        <div className="flex flex-col gap-2">
          {results.map((seat) => (
            <NavigationCard
              key={seat.id}
              poi={seat}
              icon={<Armchair className="h-4 w-4" />}
              meta={`Sec ${seat.section} · Row ${seat.row} · Seat ${seat.seatNumber}`}
              secondaryMeta={`Nearest ${seat.gateNearby}`}
              isActive={selectedPOI?.id === seat.id}
              onSelect={selectPOI}
              onNavigate={onNavigate}
            />
          ))}
          {results.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No seats found on this floor.
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
