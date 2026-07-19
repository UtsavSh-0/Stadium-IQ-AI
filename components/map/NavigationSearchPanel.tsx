"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Navigation Search Panel — tabbed container hosting every finder
 * (seats, food, restrooms, exits, parking, gates) plus the route details
 * panel once a destination is picked.
 *
 * Location: components/map/NavigationSearchPanel.tsx
 */

import {
  Armchair,
  CircleParking,
  DoorClosed,
  DoorOpen,
  UtensilsCrossed,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SeatFinder } from "@/components/map/SeatFinder";
import { FoodCourtFinder } from "@/components/map/FoodCourtFinder";
import { RestroomFinder } from "@/components/map/RestroomFinder";
import { EmergencyExitFinder } from "@/components/map/EmergencyExitFinder";
import { ParkingFinder } from "@/components/map/ParkingFinder";
import { GateFinder } from "@/components/map/GateFinder";
import { RouteDetailsPanel } from "@/components/map/RouteDetailsPanel";
import { buildMockRoute } from "@/lib/mock/navigation-mock-data";
import { useNavigationStore } from "@/store/navigation-store";
import type { NavigationPOI } from "@/types/navigation";

export function NavigationSearchPanel() {
  const setRoute = useNavigationStore((s) => s.setRoute);
  const selectPOI = useNavigationStore((s) => s.selectPOI);
  const setActiveCategory = useNavigationStore((s) => s.setActiveCategory);

  const handleNavigate = (poi: NavigationPOI) => {
    selectPOI(poi);
    setRoute(buildMockRoute(poi));
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Find your way</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="seat"
            onValueChange={(v) => setActiveCategory(v as NavigationPOI["category"])}
          >
            <TabsList className="grid grid-cols-3 gap-1 sm:grid-cols-6">
              <TabsTrigger value="seat" className="gap-1 text-xs">
                <Armchair className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Seats</span>
              </TabsTrigger>
              <TabsTrigger value="food" className="gap-1 text-xs">
                <UtensilsCrossed className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Food</span>
              </TabsTrigger>
              <TabsTrigger value="restroom" className="gap-1 text-xs">
                <DoorOpen className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Restroom</span>
              </TabsTrigger>
              <TabsTrigger value="exit" className="gap-1 text-xs">
                <DoorClosed className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Exits</span>
              </TabsTrigger>
              <TabsTrigger value="parking" className="gap-1 text-xs">
                <CircleParking className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Parking</span>
              </TabsTrigger>
              <TabsTrigger value="gate" className="gap-1 text-xs">
                <DoorOpen className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Gates</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="seat" className="mt-4">
              <SeatFinder onNavigate={handleNavigate} />
            </TabsContent>
            <TabsContent value="food" className="mt-4">
              <FoodCourtFinder onNavigate={handleNavigate} />
            </TabsContent>
            <TabsContent value="restroom" className="mt-4">
              <RestroomFinder onNavigate={handleNavigate} />
            </TabsContent>
            <TabsContent value="exit" className="mt-4">
              <EmergencyExitFinder onNavigate={handleNavigate} />
            </TabsContent>
            <TabsContent value="parking" className="mt-4">
              <ParkingFinder onNavigate={handleNavigate} />
            </TabsContent>
            <TabsContent value="gate" className="mt-4">
              <GateFinder onNavigate={handleNavigate} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <RouteDetailsPanel />
    </div>
  );
}
