"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Map Controls — zoom in / zoom out / reset view buttons.
 *
 * Location: components/map/MapControls.tsx
 */

import { Minus, Plus, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigationStore } from "@/store/navigation-store";

export function MapControls() {
  const zoomIn = useNavigationStore((s) => s.zoomIn);
  const zoomOut = useNavigationStore((s) => s.zoomOut);
  const resetView = useNavigationStore((s) => s.resetView);
  const scale = useNavigationStore((s) => s.view.scale);

  return (
    <div className="pointer-events-auto flex flex-col overflow-hidden rounded-xl border border-border bg-card/90 shadow-lg backdrop-blur">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none"
        onClick={zoomIn}
        aria-label="Zoom in"
      >
        <Plus className="h-4 w-4" />
      </Button>
      <div className="border-y border-border py-1 text-center text-[10px] font-medium text-muted-foreground">
        {Math.round(scale * 100)}%
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none"
        onClick={zoomOut}
        aria-label="Zoom out"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="h-9 w-9 rounded-none"
        onClick={resetView}
        aria-label="Reset view"
      >
        <RotateCcw className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
