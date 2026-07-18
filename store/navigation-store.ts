/**
 * StadiumIQ AI — Navigation Module
 * Zustand store holding map view state (floor, zoom/pan, selection, route).
 *
 * Location: store/navigation-store.ts
 */

import { create } from "zustand";
import type { FloorId, NavigationPOI, NavigationRoute, POICategory } from "@/types/navigation";

export interface NavigationViewState {
  x: number;
  y: number;
  scale: number;
}

interface NavigationStoreState {
  activeFloor: FloorId;
  view: NavigationViewState;
  activeCategory: POICategory | "all";
  selectedPOI: NavigationPOI | null;
  activeRoute: NavigationRoute | null;
  heatmapVisible: boolean;
  legendOpen: boolean;

  setActiveFloor: (floor: FloorId) => void;
  setActiveCategory: (category: POICategory | "all") => void;
  selectPOI: (poi: NavigationPOI | null) => void;
  setRoute: (route: NavigationRoute | null) => void;
  toggleHeatmap: () => void;
  toggleLegend: () => void;

  zoomIn: () => void;
  zoomOut: () => void;
  resetView: () => void;
  setView: (view: NavigationViewState) => void;
  panBy: (dx: number, dy: number) => void;
}

const DEFAULT_VIEW: NavigationViewState = { x: 0, y: 0, scale: 1 };
const MIN_SCALE = 0.6;
const MAX_SCALE = 3;

export const useNavigationStore = create<NavigationStoreState>((set, get) => ({
  activeFloor: 1,
  view: DEFAULT_VIEW,
  activeCategory: "all",
  selectedPOI: null,
  activeRoute: null,
  heatmapVisible: false,
  legendOpen: true,

  setActiveFloor: (floor) =>
    set({ activeFloor: floor, selectedPOI: null, activeRoute: null }),

  setActiveCategory: (category) => set({ activeCategory: category }),

  selectPOI: (poi) => set({ selectedPOI: poi, activeFloor: poi ? poi.floor : get().activeFloor }),

  setRoute: (route) => set({ activeRoute: route }),

  toggleHeatmap: () => set((s) => ({ heatmapVisible: !s.heatmapVisible })),

  toggleLegend: () => set((s) => ({ legendOpen: !s.legendOpen })),

  zoomIn: () =>
    set((s) => ({
      view: { ...s.view, scale: Math.min(MAX_SCALE, +(s.view.scale + 0.25).toFixed(2)) },
    })),

  zoomOut: () =>
    set((s) => ({
      view: { ...s.view, scale: Math.max(MIN_SCALE, +(s.view.scale - 0.25).toFixed(2)) },
    })),

  resetView: () => set({ view: DEFAULT_VIEW }),

  setView: (view) =>
    set({
      view: { ...view, scale: Math.min(MAX_SCALE, Math.max(MIN_SCALE, view.scale)) },
    }),

  panBy: (dx, dy) =>
    set((s) => ({ view: { ...s.view, x: s.view.x + dx, y: s.view.y + dy } })),
}));
