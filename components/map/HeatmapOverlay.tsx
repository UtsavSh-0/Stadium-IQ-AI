"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Heatmap Overlay — PLACEHOLDER visualization only.
 * Renders static mock crowd-density blobs for the active floor.
 * The AI/analytics team will replace HEATMAP_ZONES with a live data feed —
 * this component intentionally has no AI/data-fetching logic.
 *
 * Location: components/map/HeatmapOverlay.tsx
 */

import { motion } from "framer-motion";
import { HEATMAP_ZONES } from "@/lib/mock/navigation-mock-data";
import type { FloorId } from "@/types/navigation";

export interface HeatmapOverlayProps {
  floor: FloorId;
  visible: boolean;
}

export function HeatmapOverlay({ floor, visible }: HeatmapOverlayProps) {
  if (!visible) return null;

  const zones = HEATMAP_ZONES.filter((z) => z.floor === floor);

  return (
    <g aria-hidden="true" className="pointer-events-none">
      <defs>
        <radialGradient id="heatmap-gradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--destructive))" stopOpacity="0.55" />
          <stop offset="60%" stopColor="hsl(var(--destructive))" stopOpacity="0.2" />
          <stop offset="100%" stopColor="hsl(var(--destructive))" stopOpacity="0" />
        </radialGradient>
      </defs>
      {zones.map((zone, i) => (
        <motion.circle
          key={zone.id}
          cx={zone.position.x}
          cy={zone.position.y}
          r={zone.radius * zone.intensity + zone.radius * 0.5}
          fill="url(#heatmap-gradient)"
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: [0.95, 1.05, 0.95] }}
          transition={{
            opacity: { duration: 0.4, delay: i * 0.05 },
            scale: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 },
          }}
        />
      ))}
    </g>
  );
}
