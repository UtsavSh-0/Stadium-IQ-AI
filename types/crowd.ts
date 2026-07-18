// types/crowd.ts
// Shared types for the Crowd Intelligence module (StadiumIQ AI)

export type CrowdRiskLevel = "low" | "moderate" | "high" | "critical";

export interface StadiumZone {
  id: string;
  name: string;
  section: string; // e.g. "North Stand", "Gate 4", "Concourse B"
  capacity: number;
  currentOccupancy: number;
  riskLevel: CrowdRiskLevel;
  x: number; // relative position (0-100) for heatmap grid
  y: number; // relative position (0-100) for heatmap grid
  intensity: number; // 0-100 heat intensity
}

export interface CongestionDataPoint {
  time: string; // HH:mm
  congestion: number; // 0-100
  inflow: number;
  outflow: number;
}

export interface OccupancyData {
  zoneId: string;
  zoneName: string;
  occupancy: number;
  capacity: number;
  percentage: number;
  trend: "up" | "down" | "stable";
}

export interface QueueData {
  id: string;
  label: string; // e.g. "Gate 3 Security", "Concession Stand B"
  waitTimeMinutes: number;
  peopleInQueue: number;
  status: CrowdRiskLevel;
  trend: "up" | "down" | "stable";
}

export interface CrowdPrediction {
  id: string;
  zoneName: string;
  predictedFor: string; // e.g. "Next 15 min"
  predictedOccupancy: number;
  confidence: number; // 0-100
  riskLevel: CrowdRiskLevel;
  recommendation: string;
}

export interface CrowdTimelineEvent {
  id: string;
  time: string;
  title: string;
  description: string;
  riskLevel: CrowdRiskLevel;
}

export interface CrowdAlert {
  id: string;
  title: string;
  message: string;
  zoneName: string;
  severity: CrowdRiskLevel;
  timestamp: string;
  acknowledged: boolean;
}

export interface CrowdStatSummary {
  label: string;
  value: string;
  change: number; // percentage change
  trend: "up" | "down" | "stable";
  icon: "users" | "activity" | "alert" | "clock" | "trending" | "map";
}

export interface LiveCrowdSnapshot {
  totalOccupancy: number;
  totalCapacity: number;
  activeAlerts: number;
  averageWaitTime: number;
  zones: StadiumZone[];
  congestionHistory: CongestionDataPoint[];
  occupancyData: OccupancyData[];
  queues: QueueData[];
  predictions: CrowdPrediction[];
  timeline: CrowdTimelineEvent[];
  alerts: CrowdAlert[];
  stats: CrowdStatSummary[];
  lastUpdated: string;
}
