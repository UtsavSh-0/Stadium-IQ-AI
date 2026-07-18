// lib/mock/crowd-data.ts
// Mock data generation utilities for the Crowd Intelligence module.
// No backend / API calls — pure client-side simulation.

import type {
  StadiumZone,
  CongestionDataPoint,
  OccupancyData,
  QueueData,
  CrowdPrediction,
  CrowdTimelineEvent,
  CrowdAlert,
  CrowdStatSummary,
  LiveCrowdSnapshot,
  CrowdRiskLevel,
} from "@/types/crowd";

const ZONE_DEFS: Array<{ id: string; name: string; section: string; capacity: number; x: number; y: number }> = [
  { id: "zone-a", name: "North Stand", section: "Upper Tier", capacity: 18000, x: 50, y: 12 },
  { id: "zone-b", name: "South Stand", section: "Upper Tier", capacity: 18000, x: 50, y: 88 },
  { id: "zone-c", name: "East Stand", section: "Lower Tier", capacity: 15000, x: 88, y: 50 },
  { id: "zone-d", name: "West Stand", section: "Lower Tier", capacity: 15000, x: 12, y: 50 },
  { id: "zone-e", name: "Gate 3 Concourse", section: "Concourse", capacity: 6000, x: 30, y: 25 },
  { id: "zone-f", name: "Gate 7 Concourse", section: "Concourse", capacity: 6000, x: 70, y: 25 },
  { id: "zone-g", name: "VIP Lounge", section: "Hospitality", capacity: 2000, x: 50, y: 50 },
  { id: "zone-h", name: "Fan Zone Plaza", section: "Exterior", capacity: 9000, x: 50, y: 70 },
];

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function riskFromPercentage(pct: number): CrowdRiskLevel {
  if (pct >= 92) return "critical";
  if (pct >= 78) return "high";
  if (pct >= 55) return "moderate";
  return "low";
}

function randomBetween(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

let tick = 0;

export function generateZones(): StadiumZone[] {
  return ZONE_DEFS.map((z, i) => {
    const base = 0.5 + seededRandom(i + tick * 0.15) * 0.5;
    const occupancy = Math.min(z.capacity, Math.round(z.capacity * base));
    const percentage = Math.round((occupancy / z.capacity) * 100);
    return {
      id: z.id,
      name: z.name,
      section: z.section,
      capacity: z.capacity,
      currentOccupancy: occupancy,
      riskLevel: riskFromPercentage(percentage),
      x: z.x,
      y: z.y,
      intensity: percentage,
    };
  });
}

export function generateCongestionHistory(points = 12): CongestionDataPoint[] {
  const now = new Date();
  const data: CongestionDataPoint[] = [];
  for (let i = points - 1; i >= 0; i--) {
    const t = new Date(now.getTime() - i * 5 * 60000);
    const time = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const congestion = Math.round(40 + randomBetween(-10, 35) + (points - i));
    data.push({
      time,
      congestion: Math.max(5, Math.min(100, congestion)),
      inflow: Math.round(randomBetween(200, 900)),
      outflow: Math.round(randomBetween(150, 800)),
    });
  }
  return data;
}

export function generateOccupancyData(zones: StadiumZone[]): OccupancyData[] {
  return zones.map((z) => ({
    zoneId: z.id,
    zoneName: z.name,
    occupancy: z.currentOccupancy,
    capacity: z.capacity,
    percentage: Math.round((z.currentOccupancy / z.capacity) * 100),
    trend: Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "stable",
  }));
}

const QUEUE_LABELS = [
  "Gate 3 Security",
  "Gate 7 Security",
  "Concession Stand B",
  "Merchandise Store",
  "West Turnstiles",
  "Fan Zone Entry",
];

export function generateQueues(): QueueData[] {
  return QUEUE_LABELS.map((label, i) => {
    const wait = Math.round(randomBetween(2, 35));
    const status = riskFromPercentage(wait * 2.6);
    return {
      id: `queue-${i}`,
      label,
      waitTimeMinutes: wait,
      peopleInQueue: Math.round(randomBetween(15, 320)),
      status,
      trend: Math.random() > 0.5 ? "up" : Math.random() > 0.25 ? "down" : "stable",
    };
  });
}

export function generatePredictions(zones: StadiumZone[]): CrowdPrediction[] {
  return zones.slice(0, 4).map((z, i) => {
    const predictedOccupancy = Math.min(
      100,
      Math.round(z.intensity + randomBetween(-5, 20))
    );
    const riskLevel = riskFromPercentage(predictedOccupancy);
    const recs: Record<CrowdRiskLevel, string> = {
      low: "No action required. Continue normal monitoring.",
      moderate: "Increase staff visibility near entry points.",
      high: "Deploy additional stewards and open overflow lanes.",
      critical: "Trigger crowd control protocol and redirect inflow.",
    };
    return {
      id: `pred-${i}`,
      zoneName: z.name,
      predictedFor: "Next 15 min",
      predictedOccupancy,
      confidence: Math.round(randomBetween(78, 97)),
      riskLevel,
      recommendation: recs[riskLevel],
    };
  });
}

export function generateTimeline(): CrowdTimelineEvent[] {
  const now = new Date();
  const events = [
    { title: "Gate 3 opened", description: "Turnstiles activated for early entry.", riskLevel: "low" as const },
    { title: "Fan Zone surge detected", description: "Inflow spiked 40% above baseline.", riskLevel: "moderate" as const },
    { title: "Queue overflow at Gate 7", description: "Wait times exceeded 20 minutes.", riskLevel: "high" as const },
    { title: "Additional stewards deployed", description: "Ops team responded to Gate 7 alert.", riskLevel: "moderate" as const },
    { title: "North Stand nearing capacity", description: "Occupancy crossed 90% threshold.", riskLevel: "critical" as const },
  ];
  return events.map((e, i) => ({
    id: `tl-${i}`,
    time: new Date(now.getTime() - (events.length - i) * 6 * 60000).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    ...e,
  }));
}

export function generateAlerts(zones: StadiumZone[]): CrowdAlert[] {
  return zones
    .filter((z) => z.riskLevel === "high" || z.riskLevel === "critical")
    .map((z, i) => ({
      id: `alert-${z.id}-${i}`,
      title: z.riskLevel === "critical" ? "Critical Density Reached" : "High Congestion Warning",
      message: `${z.name} is at ${z.intensity}% capacity. Immediate attention recommended.`,
      zoneName: z.name,
      severity: z.riskLevel,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      acknowledged: false,
    }));
}

export function generateStats(zones: StadiumZone[], queues: QueueData[]): CrowdStatSummary[] {
  const totalOccupancy = zones.reduce((s, z) => s + z.currentOccupancy, 0);
  const totalCapacity = zones.reduce((s, z) => s + z.capacity, 0);
  const avgWait =
    queues.reduce((s, q) => s + q.waitTimeMinutes, 0) / Math.max(1, queues.length);

  return [
    {
      label: "Total Attendance",
      value: totalOccupancy.toLocaleString(),
      change: Math.round(randomBetween(-3, 8) * 10) / 10,
      trend: "up",
      icon: "users",
    },
    {
      label: "Stadium Capacity",
      value: `${Math.round((totalOccupancy / totalCapacity) * 100)}%`,
      change: Math.round(randomBetween(-2, 5) * 10) / 10,
      trend: "up",
      icon: "activity",
    },
    {
      label: "Avg. Wait Time",
      value: `${avgWait.toFixed(1)} min`,
      change: Math.round(randomBetween(-15, 10) * 10) / 10,
      trend: avgWait > 15 ? "up" : "down",
      icon: "clock",
    },
    {
      label: "Active Alerts",
      value: `${zones.filter((z) => z.riskLevel === "high" || z.riskLevel === "critical").length}`,
      change: Math.round(randomBetween(-20, 20) * 10) / 10,
      trend: "stable",
      icon: "alert",
    },
  ];
}

export function generateCrowdSnapshot(): LiveCrowdSnapshot {
  tick += 1;
  const zones = generateZones();
  const queues = generateQueues();
  const occupancyData = generateOccupancyData(zones);

  return {
    totalOccupancy: zones.reduce((s, z) => s + z.currentOccupancy, 0),
    totalCapacity: zones.reduce((s, z) => s + z.capacity, 0),
    activeAlerts: zones.filter((z) => z.riskLevel === "high" || z.riskLevel === "critical").length,
    averageWaitTime:
      Math.round(
        (queues.reduce((s, q) => s + q.waitTimeMinutes, 0) / Math.max(1, queues.length)) * 10
      ) / 10,
    zones,
    congestionHistory: generateCongestionHistory(),
    occupancyData,
    queues,
    predictions: generatePredictions(zones),
    timeline: generateTimeline(),
    alerts: generateAlerts(zones),
    stats: generateStats(zones, queues),
    lastUpdated: new Date().toLocaleTimeString(),
  };
}
