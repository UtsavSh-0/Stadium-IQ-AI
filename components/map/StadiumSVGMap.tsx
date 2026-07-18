"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Interactive Stadium SVG — renders the bowl, active floor's POIs, the
 * heatmap placeholder overlay and the active route. Supports mouse-wheel
 * zoom, click-drag pan, and touch pinch/drag on mobile.
 *
 * Location: components/map/StadiumSVGMap.tsx
 */

import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Armchair,
  CircleParking,
  DoorClosed,
  DoorOpen,
  UtensilsCrossed,
} from "lucide-react";
import { FloorSelector } from "@/components/map/FloorSelector";
import { MapControls } from "@/components/map/MapControls";
import { MapLegend } from "@/components/map/MapLegend";
import { HeatmapOverlay } from "@/components/map/HeatmapOverlay";
import { RouteAnimation } from "@/components/map/RouteAnimation";
import { ALL_POIS, VIEWBOX, buildMockRoute } from "@/lib/navigation-mock-data";
import { useNavigationStore } from "@/store/navigation-store";
import type { NavigationPOI, POICategory } from "@/types/navigation";
import { cn } from "@/lib/utils";

const categoryColorClass: Record<POICategory, string> = {
  seat: "fill-sky-500 stroke-sky-600",
  food: "fill-amber-500 stroke-amber-600",
  restroom: "fill-violet-500 stroke-violet-600",
  exit: "fill-rose-500 stroke-rose-600",
  parking: "fill-emerald-500 stroke-emerald-600",
  gate: "fill-cyan-500 stroke-cyan-600",
};

const categoryIcon: Record<POICategory, React.ComponentType<{ className?: string }>> = {
  seat: Armchair,
  food: UtensilsCrossed,
  restroom: DoorOpen,
  exit: DoorClosed,
  parking: CircleParking,
  gate: DoorOpen,
};

export function StadiumSVGMap() {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragState = useRef<{ startX: number; startY: number; originX: number; originY: number } | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);

  const activeFloor = useNavigationStore((s) => s.activeFloor);
  const activeCategory = useNavigationStore((s) => s.activeCategory);
  const view = useNavigationStore((s) => s.view);
  const setView = useNavigationStore((s) => s.setView);
  const panBy = useNavigationStore((s) => s.panBy);
  const zoomIn = useNavigationStore((s) => s.zoomIn);
  const zoomOut = useNavigationStore((s) => s.zoomOut);
  const selectedPOI = useNavigationStore((s) => s.selectedPOI);
  const selectPOI = useNavigationStore((s) => s.selectPOI);
  const activeRoute = useNavigationStore((s) => s.activeRoute);
  const setRoute = useNavigationStore((s) => s.setRoute);
  const heatmapVisible = useNavigationStore((s) => s.heatmapVisible);

  const visiblePOIs = ALL_POIS.filter(
    (poi) => poi.floor === activeFloor && (activeCategory === "all" || poi.category === activeCategory)
  );

  const handleWheel = useCallback(
    (e: React.WheelEvent<SVGSVGElement>) => {
      e.preventDefault();
      if (e.deltaY < 0) zoomIn();
      else zoomOut();
    },
    [zoomIn, zoomOut]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      (e.target as Element).setPointerCapture?.(e.pointerId);
      dragState.current = {
        startX: e.clientX,
        startY: e.clientY,
        originX: view.x,
        originY: view.y,
      };
      setIsDragging(true);
    },
    [view.x, view.y]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<SVGSVGElement>) => {
      if (!dragState.current) return;
      const dx = e.clientX - dragState.current.startX;
      const dy = e.clientY - dragState.current.startY;
      setView({
        x: dragState.current.originX + dx,
        y: dragState.current.originY + dy,
        scale: view.scale,
      });
    },
    [setView, view.scale]
  );

  const endDrag = useCallback(() => {
    dragState.current = null;
    setIsDragging(false);
  }, []);

  const handleMarkerClick = (poi: NavigationPOI) => {
    selectPOI(poi);
    setRoute(buildMockRoute(poi));
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-border bg-muted/30">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX.width} ${VIEWBOX.height}`}
        className={cn("h-full w-full touch-none select-none", isDragging ? "cursor-grabbing" : "cursor-grab")}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        role="img"
        aria-label="Interactive stadium map"
      >
        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
          {/* Bowl background */}
          <ellipse
            cx={VIEWBOX.width / 2}
            cy={VIEWBOX.height / 2}
            rx={470}
            ry={300}
            className="fill-card stroke-border"
            strokeWidth={2}
          />
          <ellipse
            cx={VIEWBOX.width / 2}
            cy={VIEWBOX.height / 2}
            rx={330}
            ry={205}
            className="fill-muted/60 stroke-border"
            strokeWidth={1.5}
          />
          {/* Pitch, shown as spatial anchor on every floor */}
          <ellipse
            cx={VIEWBOX.width / 2}
            cy={VIEWBOX.height / 2}
            rx={190}
            ry={105}
            className="fill-emerald-600/20 stroke-emerald-600/50"
            strokeWidth={1.5}
          />
          <line
            x1={VIEWBOX.width / 2}
            y1={VIEWBOX.height / 2 - 105}
            x2={VIEWBOX.width / 2}
            y2={VIEWBOX.height / 2 + 105}
            className="stroke-emerald-600/40"
            strokeWidth={1}
          />
          <circle
            cx={VIEWBOX.width / 2}
            cy={VIEWBOX.height / 2}
            r={30}
            className="fill-none stroke-emerald-600/40"
            strokeWidth={1}
          />

          <HeatmapOverlay floor={activeFloor} visible={heatmapVisible} />
          <RouteAnimation route={activeRoute} />

          {/* POI markers */}
          {visiblePOIs.map((poi) => {
            const Icon = categoryIcon[poi.category];
            const isSelected = selectedPOI?.id === poi.id;
            return (
              <motion.g
                key={poi.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="cursor-pointer"
                onClick={() => handleMarkerClick(poi)}
              >
                {isSelected && (
                  <motion.circle
                    cx={poi.position.x}
                    cy={poi.position.y}
                    r={16}
                    className="fill-none stroke-primary"
                    strokeWidth={2}
                    animate={{ r: [14, 20, 14], opacity: [0.9, 0.2, 0.9] }}
                    transition={{ duration: 1.6, repeat: Infinity }}
                  />
                )}
                <circle
                  cx={poi.position.x}
                  cy={poi.position.y}
                  r={10}
                  strokeWidth={2}
                  className={cn(categoryColorClass[poi.category], "drop-shadow-sm")}
                />
                <foreignObject x={poi.position.x - 6} y={poi.position.y - 6} width={12} height={12}>
                  <Icon className="h-3 w-3 text-white" />
                </foreignObject>
              </motion.g>
            );
          })}
        </g>
      </svg>

      {/* Overlay UI */}
      <div className="pointer-events-none absolute left-3 top-3">
        <FloorSelector />
      </div>
      <div className="pointer-events-none absolute right-3 top-3">
        <MapControls />
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3">
        <MapLegend />
      </div>
    </div>
  );
}
