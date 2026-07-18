/**
 * StadiumIQ AI — Navigation Module
 * Shared TypeScript types
 *
 * Location: types/navigation.ts
 * Owner: Navigation module
 */

export type POICategory =
  | "seat"
  | "food"
  | "restroom"
  | "exit"
  | "parking"
  | "gate";

export type FloorId = 0 | 1 | 2 | 3;

export interface FloorDefinition {
  id: FloorId;
  label: string;
  shortLabel: string;
  description: string;
}

export interface Point {
  x: number;
  y: number;
}

export interface BasePOI {
  id: string;
  category: POICategory;
  name: string;
  floor: FloorId;
  position: Point;
  /** Small label rendered on the map marker, e.g. "F3", "G12" */
  markerLabel: string;
  /** Human readable distance from current position, mock value */
  distanceMeters: number;
  /** Whether this POI is currently highlighted / crowded, feeds heatmap placeholder */
  crowdLevel: "low" | "moderate" | "high";
}

export interface SeatPOI extends BasePOI {
  category: "seat";
  section: string;
  row: string;
  seatNumber: string;
  gateNearby: string;
}

export interface FoodCourtPOI extends BasePOI {
  category: "food";
  cuisine: string;
  waitTimeMinutes: number;
  priceTier: "$" | "$$" | "$$$";
}

export interface RestroomPOI extends BasePOI {
  category: "restroom";
  gender: "all-gender" | "men" | "women" | "family" | "accessible";
  occupancyPercent: number;
}

export interface EmergencyExitPOI extends BasePOI {
  category: "exit";
  exitCode: string;
  capacityPerMinute: number;
  isPrimary: boolean;
}

export interface ParkingPOI extends BasePOI {
  category: "parking";
  lotCode: string;
  spotsAvailable: number;
  spotsTotal: number;
  walkTimeMinutes: number;
}

export interface GatePOI extends BasePOI {
  category: "gate";
  gateCode: string;
  status: "open" | "closed" | "delayed";
  queueLevel: "low" | "moderate" | "high";
}

export type NavigationPOI =
  | SeatPOI
  | FoodCourtPOI
  | RestroomPOI
  | EmergencyExitPOI
  | ParkingPOI
  | GatePOI;

export interface RouteStep {
  instruction: string;
  distanceMeters: number;
  floor: FloorId;
}

export interface NavigationRoute {
  id: string;
  originLabel: string;
  destination: NavigationPOI;
  /** Ordered points describing the path in SVG viewBox coordinates */
  path: Point[];
  totalDistanceMeters: number;
  estimatedTimeMinutes: number;
  steps: RouteStep[];
  accessibleRoute: boolean;
}

export interface HeatmapZone {
  id: string;
  floor: FloorId;
  position: Point;
  radius: number;
  intensity: number; // 0 - 1, placeholder only
}

export const POI_CATEGORY_META: Record<
  POICategory,
  { label: string; colorVar: string }
> = {
  seat: { label: "Seats", colorVar: "--nav-seat" },
  food: { label: "Food Court", colorVar: "--nav-food" },
  restroom: { label: "Restroom", colorVar: "--nav-restroom" },
  exit: { label: "Emergency Exit", colorVar: "--nav-exit" },
  parking: { label: "Parking", colorVar: "--nav-parking" },
  gate: { label: "Gate", colorVar: "--nav-gate" },
};
