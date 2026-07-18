"use client";

import { RotateCcw, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { useAnalyticsStore } from "@/store/analytics-store";
import { STADIUM_OPTIONS } from "@/lib/mock/analytics-mock-data";
import type { MatchCategory, ComparisonMode } from "@/types/analytics";

const MATCH_CATEGORIES: { value: MatchCategory; label: string }[] = [
  { value: "all", label: "All Matches" },
  { value: "group-stage", label: "Group Stage" },
  { value: "round-of-32", label: "Round of 32" },
  { value: "round-of-16", label: "Round of 16" },
  { value: "quarter-final", label: "Quarter-Final" },
  { value: "semi-final", label: "Semi-Final" },
  { value: "final", label: "Final" },
];

const COMPARISON_MODES: { value: ComparisonMode; label: string }[] = [
  { value: "none", label: "No Comparison" },
  { value: "previous-period", label: "vs. Previous Period" },
  { value: "previous-year", label: "vs. Previous Tournament" },
];

/**
 * Global filter bar for the Analytics module.
 * Reads/writes the shared analytics store so every chart on the
 * dashboard reacts to the same filter state.
 */
export function AnalyticsFilters() {
  const {
    dateRange,
    stadiumId,
    matchCategory,
    comparisonMode,
    setDateRange,
    setStadiumId,
    setMatchCategory,
    setComparisonMode,
    resetFilters,
  } = useAnalyticsStore();

  return (
    <Card className="border-border bg-card">
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
        </div>

        <DateRangePicker value={dateRange} onChange={setDateRange} />

        <Select value={stadiumId} onValueChange={(v) => setStadiumId(v as typeof stadiumId)}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Venue" />
          </SelectTrigger>
          <SelectContent>
            {STADIUM_OPTIONS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={matchCategory}
          onValueChange={(v) => setMatchCategory(v as MatchCategory)}
        >
          <SelectTrigger className="w-full sm:w-[190px]">
            <SelectValue placeholder="Match Stage" />
          </SelectTrigger>
          <SelectContent>
            {MATCH_CATEGORIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={comparisonMode}
          onValueChange={(v) => setComparisonMode(v as ComparisonMode)}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Comparison" />
          </SelectTrigger>
          <SelectContent>
            {COMPARISON_MODES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground sm:ml-auto"
          onClick={resetFilters}
        >
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
          Reset
        </Button>
      </CardContent>
    </Card>
  );
}
