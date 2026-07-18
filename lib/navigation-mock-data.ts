/**
 * StadiumIQ AI — Navigation Module
 * Mock data for the interactive stadium map.
 * No backend / API calls — everything here is static, deterministic mock data
 * intended to be swapped for live services later by the platform/data team.
 *
 * Location: lib/navigation-mock-data.ts
 */

import type {
  EmergencyExitPOI,
  FloorDefinition,
  FoodCourtPOI,
  GatePOI,
  HeatmapZone,
  NavigationPOI,
  NavigationRoute,
  ParkingPOI,
  RestroomPOI,
  SeatPOI,
} from "@/types/navigation";

export const VIEWBOX = { width: 1000, height: 640 };
const CENTER = { x: VIEWBOX.width / 2, y: VIEWBOX.height / 2 };

export const FLOORS: FloorDefinition[] = [
  {
    id: 0,
    label: "Ground & Parking Level",
    shortLabel: "P",
    description: "Parking lots, drop-off zones and main gates",
  },
  {
    id: 1,
    label: "Lower Bowl",
    shortLabel: "L1",
    description: "Sections 100–139, pitch-side concourse",
  },
  {
    id: 2,
    label: "Club Level",
    shortLabel: "L2",
    description: "Sections 200–229, hospitality & lounges",
  },
  {
    id: 3,
    label: "Upper Bowl",
    shortLabel: "L3",
    description: "Sections 300–339, general admission",
  },
];

/** Converts a polar coordinate around the bowl into an SVG point. */
function pointOnRing(angleDeg: number, radiusX: number, radiusY: number): {
  x: number;
  y: number;
} {
  const angle = (angleDeg * Math.PI) / 180;
  return {
    x: CENTER.x + radiusX * Math.cos(angle),
    y: CENTER.y + radiusY * Math.sin(angle),
  };
}

const crowdLevels: Array<"low" | "moderate" | "high"> = [
  "low",
  "moderate",
  "high",
];

function pickCrowd(seed: number): "low" | "moderate" | "high" {
  return crowdLevels[seed % crowdLevels.length];
}

// ---------------------------------------------------------------------------
// Seats — 8 sections per bowl floor, evenly spaced around the ring
// ---------------------------------------------------------------------------
function buildSeats(): SeatPOI[] {
  const sections = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seats: SeatPOI[] = [];

  ([1, 2, 3] as const).forEach((floor, floorIdx) => {
    const radiusX = 300 - floorIdx * 40;
    const radiusY = 190 - floorIdx * 28;
    sections.forEach((section, i) => {
      const angle = (360 / sections.length) * i - 90;
      const pos = pointOnRing(angle, radiusX, radiusY);
      seats.push({
        id: `seat-${floor}-${section}`,
        category: "seat",
        name: `Section ${floor}00 ${section}`,
        floor,
        position: pos,
        markerLabel: `${section}`,
        distanceMeters: 60 + floorIdx * 40 + i * 8,
        crowdLevel: pickCrowd(i + floorIdx),
        section: `${floor}0${i}`,
        row: String.fromCharCode(65 + (i % 12)),
        seatNumber: `${(i + 1) * 4}`,
        gateNearby: `Gate ${sections[i % sections.length]}`,
      });
    });
  });

  return seats;
}

// ---------------------------------------------------------------------------
// Food courts — clustered near concourse rings on floors 1-3
// ---------------------------------------------------------------------------
function buildFoodCourts(): FoodCourtPOI[] {
  const cuisines = [
    "Grill & BBQ",
    "World Street Food",
    "Pizza & Pasta",
    "Vegan Kitchen",
    "Local Favorites",
    "Coffee & Bakery",
  ];
  const courts: FoodCourtPOI[] = [];
  ([1, 2, 3] as const).forEach((floor, floorIdx) => {
    const radiusX = 340 - floorIdx * 40;
    const radiusY = 220 - floorIdx * 28;
    for (let i = 0; i < 4; i++) {
      const angle = 45 + i * 90;
      const pos = pointOnRing(angle, radiusX, radiusY);
      courts.push({
        id: `food-${floor}-${i}`,
        category: "food",
        name: `${cuisines[(i + floorIdx) % cuisines.length]}`,
        floor,
        position: pos,
        markerLabel: "F",
        distanceMeters: 90 + i * 25,
        crowdLevel: pickCrowd(i + floorIdx + 1),
        cuisine: cuisines[(i + floorIdx) % cuisines.length],
        waitTimeMinutes: 3 + ((i + floorIdx) % 5) * 3,
        priceTier: (["$", "$$", "$$$"] as const)[i % 3],
      });
    }
  });
  return courts;
}

// ---------------------------------------------------------------------------
// Restrooms
// ---------------------------------------------------------------------------
function buildRestrooms(): RestroomPOI[] {
  const genders: RestroomPOI["gender"][] = [
    "all-gender",
    "men",
    "women",
    "family",
    "accessible",
  ];
  const restrooms: RestroomPOI[] = [];
  ([1, 2, 3] as const).forEach((floor, floorIdx) => {
    const radiusX = 320 - floorIdx * 40;
    const radiusY = 205 - floorIdx * 28;
    for (let i = 0; i < 6; i++) {
      const angle = i * 60 + 20;
      const pos = pointOnRing(angle, radiusX, radiusY);
      restrooms.push({
        id: `restroom-${floor}-${i}`,
        category: "restroom",
        name: `Restroom ${floor}${i}`,
        floor,
        position: pos,
        markerLabel: "WC",
        distanceMeters: 50 + i * 18,
        crowdLevel: pickCrowd(i + floorIdx + 2),
        gender: genders[i % genders.length],
        occupancyPercent: (i * 17 + floorIdx * 11) % 100,
      });
    }
  });
  return restrooms;
}

// ---------------------------------------------------------------------------
// Emergency exits — anchored to outer ring on every floor
// ---------------------------------------------------------------------------
function buildExits(): EmergencyExitPOI[] {
  const exits: EmergencyExitPOI[] = [];
  ([0, 1, 2, 3] as const).forEach((floor, floorIdx) => {
    const radiusX = 420 - floorIdx * 30;
    const radiusY = 270 - floorIdx * 22;
    for (let i = 0; i < 8; i++) {
      const angle = i * 45;
      const pos = pointOnRing(angle, radiusX, radiusY);
      exits.push({
        id: `exit-${floor}-${i}`,
        category: "exit",
        name: `Emergency Exit ${String.fromCharCode(65 + i)}${floor}`,
        floor,
        position: pos,
        markerLabel: "EX",
        distanceMeters: 70 + i * 14,
        crowdLevel: pickCrowd(i),
        exitCode: `EX-${floor}${i}`,
        capacityPerMinute: 120 + (i % 4) * 20,
        isPrimary: i % 4 === 0,
      });
    }
  });
  return exits;
}

// ---------------------------------------------------------------------------
// Parking — ground floor only, laid out in four surface lots
// ---------------------------------------------------------------------------
function buildParking(): ParkingPOI[] {
  const lots = [
    { code: "P1 — North", angle: -90 },
    { code: "P2 — East", angle: 0 },
    { code: "P3 — South", angle: 90 },
    { code: "P4 — West", angle: 180 },
  ];
  return lots.map((lot, i) => {
    const pos = pointOnRing(lot.angle, 470, 300);
    return {
      id: `parking-${i}`,
      category: "parking",
      name: lot.code,
      floor: 0,
      position: pos,
      markerLabel: "P",
      distanceMeters: 220 + i * 60,
      crowdLevel: pickCrowd(i),
      lotCode: lot.code.split(" ")[0],
      spotsAvailable: 120 - i * 25,
      spotsTotal: 400,
      walkTimeMinutes: 6 + i * 2,
    };
  });
}

// ---------------------------------------------------------------------------
// Gates — main entry gates on ground floor
// ---------------------------------------------------------------------------
function buildGates(): GatePOI[] {
  const codes = ["A", "B", "C", "D", "E", "F"];
  const statuses: GatePOI["status"][] = ["open", "open", "delayed", "open", "open", "closed"];
  const queue: GatePOI["queueLevel"][] = ["low", "moderate", "high", "low", "moderate", "low"];
  return codes.map((code, i) => {
    const angle = i * 60;
    const pos = pointOnRing(angle, 440, 285);
    return {
      id: `gate-${code}`,
      category: "gate",
      name: `Gate ${code}`,
      floor: 0,
      position: pos,
      markerLabel: code,
      distanceMeters: 180 + i * 30,
      crowdLevel: pickCrowd(i + 3),
      gateCode: code,
      status: statuses[i],
      queueLevel: queue[i],
    };
  });
}

export const SEATS = buildSeats();
export const FOOD_COURTS = buildFoodCourts();
export const RESTROOMS = buildRestrooms();
export const EXITS = buildExits();
export const PARKING = buildParking();
export const GATES = buildGates();

export const ALL_POIS: NavigationPOI[] = [
  ...SEATS,
  ...FOOD_COURTS,
  ...RESTROOMS,
  ...EXITS,
  ...PARKING,
  ...GATES,
];

export const HEATMAP_ZONES: HeatmapZone[] = [
  { id: "hz-1", floor: 1, position: pointOnRing(-45, 280, 175), radius: 70, intensity: 0.8 },
  { id: "hz-2", floor: 1, position: pointOnRing(135, 280, 175), radius: 55, intensity: 0.5 },
  { id: "hz-3", floor: 2, position: pointOnRing(20, 240, 150), radius: 60, intensity: 0.65 },
  { id: "hz-4", floor: 3, position: pointOnRing(200, 210, 130), radius: 50, intensity: 0.35 },
  { id: "hz-5", floor: 0, position: pointOnRing(0, 470, 300), radius: 80, intensity: 0.45 },
];

/**
 * Builds a mock multi-point route from a generic "you are here" origin
 * to the given POI. Path is a simple set of waypoints — production version
 * will be replaced by a real pathfinding service.
 */
export function buildMockRoute(destination: NavigationPOI, originLabel = "Your Seat — Section 112, Row F"): NavigationRoute {
  const origin = pointOnRing(-90, 260, 165);
  const midpoint = {
    x: (origin.x + destination.position.x) / 2 + 25,
    y: (origin.y + destination.position.y) / 2 - 25,
  };

  const path = [origin, midpoint, destination.position];
  const totalDistanceMeters = destination.distanceMeters;
  const estimatedTimeMinutes = Math.max(1, Math.round(totalDistanceMeters / 70));

  return {
    id: `route-${destination.id}`,
    originLabel,
    destination,
    path,
    totalDistanceMeters,
    estimatedTimeMinutes,
    accessibleRoute: destination.category === "exit" ? true : totalDistanceMeters % 3 === 0,
    steps: [
      { instruction: `Head out of your row toward the main aisle`, distanceMeters: Math.round(totalDistanceMeters * 0.2), floor: origin ? 1 : destination.floor },
      { instruction: `Follow the concourse toward ${destination.name}`, distanceMeters: Math.round(totalDistanceMeters * 0.55), floor: destination.floor },
      { instruction: `Arrive at ${destination.name}`, distanceMeters: Math.round(totalDistanceMeters * 0.25), floor: destination.floor },
    ],
  };
}
