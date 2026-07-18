/**
 * store/analytics-store.ts
 * Zustand store holding the Analytics module's filter state
 * (date range, stadium, match category, comparison mode).
 * Scoped to this module only — does not touch other domain stores.
 */
"use client";

import { create } from "zustand";
import type {
  AnalyticsFilterState,
  StadiumId,
  MatchCategory,
  ComparisonMode,
  DateRange,
} from "@/types/analytics";

interface AnalyticsStore extends AnalyticsFilterState {
  setDateRange: (range: DateRange) => void;
  setStadiumId: (id: StadiumId) => void;
  setMatchCategory: (category: MatchCategory) => void;
  setComparisonMode: (mode: ComparisonMode) => void;
  resetFilters: () => void;
}

const defaultRange: DateRange = {
  from: new Date("2026-06-11"),
  to: new Date("2026-07-19"),
};

const initialState: AnalyticsFilterState = {
  dateRange: defaultRange,
  stadiumId: "all",
  matchCategory: "all",
  comparisonMode: "previous-period",
};

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  ...initialState,
  setDateRange: (range) => set({ dateRange: range }),
  setStadiumId: (id) => set({ stadiumId: id }),
  setMatchCategory: (category) => set({ matchCategory: category }),
  setComparisonMode: (mode) => set({ comparisonMode: mode }),
  resetFilters: () => set(initialState),
}));
