"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Navigation dashboard page — combines the interactive stadium map with the
 * finder/search panel. Mock data only, no backend calls.
 *
 * Location: app/dashboard/navigation/page.tsx
 */

import { motion } from "framer-motion";
import { Compass } from "lucide-react";
import { StadiumSVGMap } from "@/components/map/StadiumSVGMap";
import { NavigationSearchPanel } from "@/components/map/NavigationSearchPanel";
import { FLOORS } from "@/lib/mock/navigation-mock-data";
import { useNavigationStore } from "@/store/navigation-store";

export default function NavigationPage() {
  const activeFloor = useNavigationStore((s) => s.activeFloor);
  const floor = FLOORS.find((f) => f.id === activeFloor);

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col gap-1"
      >
        <div className="flex items-center gap-2">
          <Compass className="h-5 w-5 text-primary" />
          <h1 className="text-xl font-semibold text-foreground">Stadium Navigation</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {floor?.label} — {floor?.description}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_380px]">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: 0.05 }}
          className="h-[500px] lg:h-[720px]"
        >
          <StadiumSVGMap />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="lg:max-h-[720px] lg:overflow-y-auto"
        >
          <NavigationSearchPanel />
        </motion.div>
      </div>
    </div>
  );
}
