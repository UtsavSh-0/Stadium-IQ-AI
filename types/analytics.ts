/**
 * types/analytics.ts
 * Shared TypeScript contracts for the StadiumIQ AI Analytics module.
 * Consumed by components/analytics/**, store/analytics-store.ts, and
 * lib/mock/analytics-mock-data.ts.
 */

export type StadiumId =
  | "metlife"
  | "att"
  | "sofi"
  | "bc-place"
  | "estadio-azteca"
  | "all";

export interface StadiumOption {
  id: StadiumId;
  name: string;
  city: string;
}

export type MetricTrend = "up" | "down" | "flat";

export type ExportFormat = "pdf" | "csv";

export interface DateRange {
  from: Date;
  to: Date;
}

export type ComparisonMode = "previous-period" | "previous-year" | "none";

export interface AnalyticsFilterState {
  dateRange: DateRange;
  stadiumId: StadiumId;
  matchCategory: MatchCategory;
  comparisonMode: ComparisonMode;
}

export type MatchCategory =
  | "all"
  | "group-stage"
  | "round-of-32"
  | "round-of-16"
  | "quarter-final"
  | "semi-final"
  | "final";

/** Top-of-dashboard KPI cards */
export interface RevenueMetric {
  id: string;
  label: string;
  value: number;
  currency: "USD";
  changePercent: number;
  trend: MetricTrend;
  icon: "ticket" | "utensils" | "shirt" | "parking" | "wallet" | "trending-up";
  description: string;
}

/** Attendance vs. capacity over time */
export interface AttendanceDataPoint {
  date: string;
  match: string;
  actual: number;
  capacity: number;
  utilizationPercent: number;
}

/** Real-time crowd density by stadium zone */
export interface CrowdZoneDensity {
  zone: string;
  currentOccupancy: number;
  maxCapacity: number;
  densityPercent: number;
  status: "normal" | "moderate" | "high" | "critical";
}

/** Traffic / transport flow around the venue */
export interface TrafficDataPoint {
  time: string;
  inboundVehicles: number;
  outboundVehicles: number;
  transitRiders: number;
  congestionLevel: "low" | "medium" | "high" | "severe";
}

/** Sustainability metrics */
export interface CarbonDataPoint {
  date: string;
  emissionsTons: number;
  offsetTons: number;
  targetTons: number;
}

export interface WaterUsageDataPoint {
  date: string;
  consumptionKl: number;
  recycledKl: number;
}

export interface ElectricityUsageDataPoint {
  date: string;
  totalKwh: number;
  renewableKwh: number;
  gridKwh: number;
}

/** Concessions performance */
export interface FoodSalesCategory {
  category: string;
  revenue: number;
  unitsSold: number;
  colorVar: string;
}

/** Generic comparison series used by ComparisonChart */
export interface ComparisonDataPoint {
  label: string;
  current: number;
  previous: number;
}

export interface AiReportInsight {
  id: string;
  title: string;
  summary: string;
  severity: "info" | "warning" | "critical";
}
