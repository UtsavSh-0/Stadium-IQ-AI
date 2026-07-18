/**
 * lib/mock/analytics-mock-data.ts
 * Deterministic mock data for the Analytics module.
 * No backend / DB — per project rules, everything here is static or
 * seeded-random so charts render consistently across reloads.
 */

import type {
  RevenueMetric,
  AttendanceDataPoint,
  CrowdZoneDensity,
  TrafficDataPoint,
  CarbonDataPoint,
  WaterUsageDataPoint,
  ElectricityUsageDataPoint,
  FoodSalesCategory,
  ComparisonDataPoint,
  AiReportInsight,
  StadiumOption,
} from "@/types/analytics";

export const STADIUM_OPTIONS: StadiumOption[] = [
  { id: "all", name: "All Venues", city: "United States, Mexico & Canada" },
  { id: "metlife", name: "MetLife Stadium", city: "East Rutherford, NJ" },
  { id: "att", name: "AT&T Stadium", city: "Arlington, TX" },
  { id: "sofi", name: "SoFi Stadium", city: "Inglewood, CA" },
  { id: "bc-place", name: "BC Place", city: "Vancouver, CA" },
  { id: "estadio-azteca", name: "Estadio Azteca", city: "Mexico City, MX" },
];

// simple mulberry32 PRNG so numbers are stable between renders
function seededRandom(seed: number) {
  let t = seed;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = seededRandom(2026);

export const REVENUE_METRICS: RevenueMetric[] = [
  {
    id: "ticket-sales",
    label: "Ticket Sales",
    value: 48250000,
    currency: "USD",
    changePercent: 12.4,
    trend: "up",
    icon: "ticket",
    description: "Gross ticket revenue, current period",
  },
  {
    id: "concessions",
    label: "Concessions Revenue",
    value: 9840000,
    currency: "USD",
    changePercent: 8.1,
    trend: "up",
    icon: "utensils",
    description: "Food & beverage sales across all venues",
  },
  {
    id: "merchandise",
    label: "Merchandise Sales",
    value: 6120000,
    currency: "USD",
    changePercent: -3.2,
    trend: "down",
    icon: "shirt",
    description: "Official kit & retail sales",
  },
  {
    id: "parking",
    label: "Parking & Transit",
    value: 2430000,
    currency: "USD",
    changePercent: 4.6,
    trend: "up",
    icon: "parking",
    description: "Parking passes and shuttle fares",
  },
  {
    id: "hospitality",
    label: "Hospitality & VIP",
    value: 15760000,
    currency: "USD",
    changePercent: 18.9,
    trend: "up",
    icon: "wallet",
    description: "Suites, lounges, and premium packages",
  },
  {
    id: "total-revenue",
    label: "Total Revenue",
    value: 82400000,
    currency: "USD",
    changePercent: 11.2,
    trend: "up",
    icon: "trending-up",
    description: "Combined revenue across all streams",
  },
];

const MATCHES = [
  "Group A: Opener",
  "Group C: Rivalry Night",
  "Group F: Derby Match",
  "Round of 32: Match 41",
  "Round of 16: Match 52",
  "Quarter-Final: Match 60",
];

export const ATTENDANCE_DATA: AttendanceDataPoint[] = MATCHES.map((match, i) => {
  const capacity = 82500;
  const actual = Math.round(capacity * (0.82 + rand() * 0.17));
  return {
    date: `Jun ${10 + i * 3}`,
    match,
    actual,
    capacity,
    utilizationPercent: Math.round((actual / capacity) * 1000) / 10,
  };
});

export const CROWD_ZONES: CrowdZoneDensity[] = [
  { zone: "North Concourse", currentOccupancy: 8200, maxCapacity: 9000, densityPercent: 91, status: "high" },
  { zone: "South Concourse", currentOccupancy: 6100, maxCapacity: 9000, densityPercent: 68, status: "moderate" },
  { zone: "East Gate Plaza", currentOccupancy: 4200, maxCapacity: 7000, densityPercent: 60, status: "moderate" },
  { zone: "West Gate Plaza", currentOccupancy: 6800, maxCapacity: 7000, densityPercent: 97, status: "critical" },
  { zone: "VIP & Suites", currentOccupancy: 1800, maxCapacity: 3000, densityPercent: 60, status: "moderate" },
  { zone: "Fan Zone (Exterior)", currentOccupancy: 12500, maxCapacity: 25000, densityPercent: 50, status: "normal" },
];

export const TRAFFIC_DATA: TrafficDataPoint[] = [
  { time: "10:00", inboundVehicles: 1200, outboundVehicles: 80, transitRiders: 4200, congestionLevel: "low" },
  { time: "12:00", inboundVehicles: 3400, outboundVehicles: 150, transitRiders: 9800, congestionLevel: "medium" },
  { time: "14:00", inboundVehicles: 5600, outboundVehicles: 210, transitRiders: 15200, congestionLevel: "high" },
  { time: "16:00", inboundVehicles: 4100, outboundVehicles: 300, transitRiders: 11400, congestionLevel: "medium" },
  { time: "18:00", inboundVehicles: 1800, outboundVehicles: 900, transitRiders: 8600, congestionLevel: "medium" },
  { time: "20:00", inboundVehicles: 600, outboundVehicles: 3200, transitRiders: 6200, congestionLevel: "high" },
  { time: "22:00", inboundVehicles: 200, outboundVehicles: 5400, transitRiders: 9100, congestionLevel: "severe" },
];

export const CARBON_DATA: CarbonDataPoint[] = Array.from({ length: 6 }).map((_, i) => ({
  date: `Match ${i + 1}`,
  emissionsTons: Math.round(420 + rand() * 90),
  offsetTons: Math.round(280 + rand() * 60),
  targetTons: 380,
}));

export const WATER_USAGE_DATA: WaterUsageDataPoint[] = Array.from({ length: 6 }).map((_, i) => ({
  date: `Match ${i + 1}`,
  consumptionKl: Math.round(140 + rand() * 40),
  recycledKl: Math.round(45 + rand() * 20),
}));

export const ELECTRICITY_USAGE_DATA: ElectricityUsageDataPoint[] = Array.from({ length: 6 }).map((_, i) => {
  const total = Math.round(58000 + rand() * 12000);
  const renewable = Math.round(total * (0.35 + rand() * 0.25));
  return {
    date: `Match ${i + 1}`,
    totalKwh: total,
    renewableKwh: renewable,
    gridKwh: total - renewable,
  };
});

export const FOOD_SALES_DATA: FoodSalesCategory[] = [
  { category: "Beverages", revenue: 3120000, unitsSold: 890000, colorVar: "--chart-1" },
  { category: "Snacks & Concessions", revenue: 2540000, unitsSold: 610000, colorVar: "--chart-2" },
  { category: "Hot Meals", revenue: 2180000, unitsSold: 340000, colorVar: "--chart-3" },
  { category: "Alcohol", revenue: 1460000, unitsSold: 210000, colorVar: "--chart-4" },
  { category: "Merch-Food Combos", revenue: 540000, unitsSold: 95000, colorVar: "--chart-5" },
];

export const REVENUE_COMPARISON_DATA: ComparisonDataPoint[] = [
  { label: "Ticket Sales", current: 48.25, previous: 41.1 },
  { label: "Concessions", current: 9.84, previous: 8.6 },
  { label: "Merchandise", current: 6.12, previous: 6.9 },
  { label: "Parking", current: 2.43, previous: 2.1 },
  { label: "Hospitality", current: 15.76, previous: 12.9 },
];

export const AI_REPORT_INSIGHTS: AiReportInsight[] = [
  {
    id: "insight-1",
    title: "West Gate Plaza approaching critical density",
    summary:
      "Ingress rate at West Gate Plaza is 18% above the pre-match model. Recommend opening auxiliary lanes 45 minutes earlier for the next fixture.",
    severity: "critical",
  },
  {
    id: "insight-2",
    title: "Concessions revenue trending above forecast",
    summary:
      "Hot meal sales are outperforming forecast by 14%, largely driven by regional menu items. Consider extending stock allocation for semi-final matches.",
    severity: "info",
  },
  {
    id: "insight-3",
    title: "Renewable energy share dipped this match",
    summary:
      "Renewable share of total electricity draw fell to 35%, below the 45% target, due to extended floodlight use during delays.",
    severity: "warning",
  },
];
