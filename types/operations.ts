// types/operations.ts
// Shared TypeScript interfaces for the Operations domain
// (Volunteer, Transport, Parking, Medical, Security, Incident, Emergency)

export type PriorityLevel = "low" | "medium" | "high" | "critical";

export type StatusTone = "success" | "warning" | "critical" | "info" | "neutral";

export interface StatusMetric {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  tone: StatusTone;
  icon?: string; // lucide icon name, resolved by consumer
  trend?: "up" | "down" | "flat";
  trendValue?: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string; // ISO string
  tone: StatusTone;
  icon?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  tone: StatusTone;
  read: boolean;
  source: "volunteer" | "transport" | "medical" | "security" | "incident" | "emergency" | "system";
}

// ---------------- Volunteer ----------------

export type TaskStatus = "unassigned" | "assigned" | "in-progress" | "completed" | "blocked";

export interface VolunteerTask {
  id: string;
  title: string;
  description: string;
  zone: string;
  priority: PriorityLevel;
  status: TaskStatus;
  assigneeId?: string;
  assigneeName?: string;
  assigneeAvatar?: string;
  dueTime: string;
  estimatedMinutes: number;
}

export interface Volunteer {
  id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  zone: string;
  shiftStart: string;
  shiftEnd: string;
  status: "on-duty" | "off-duty" | "on-break";
  tasksCompleted: number;
  tasksAssigned: number;
}

export interface Shift {
  id: string;
  volunteerName: string;
  volunteerAvatar?: string;
  role: string;
  zone: string;
  startTime: string;
  endTime: string;
  status: "upcoming" | "active" | "completed";
}

// ---------------- Transport ----------------

export interface TransportRoute {
  id: string;
  name: string;
  type: "shuttle" | "metro" | "bus" | "rail";
  from: string;
  to: string;
  status: "on-time" | "delayed" | "disrupted" | "cancelled";
  capacityPercent: number;
  nextDeparture: string;
  etaMinutes: number;
}

export interface ParkingZone {
  id: string;
  name: string;
  zoneType: "general" | "vip" | "staff" | "accessible" | "media";
  totalSpots: number;
  occupiedSpots: number;
  status: "available" | "filling-fast" | "full" | "closed";
}

// ---------------- Emergency / Medical / Security / Incident ----------------

export interface MedicalCase {
  id: string;
  patientRef: string;
  zone: string;
  severity: PriorityLevel;
  status: "reported" | "responding" | "on-site" | "transported" | "resolved";
  reportedAt: string;
  responderTeam?: string;
}

export interface SecurityAlert {
  id: string;
  title: string;
  zone: string;
  severity: PriorityLevel;
  status: "open" | "investigating" | "contained" | "resolved";
  reportedAt: string;
  unitsAssigned: number;
}

export interface Incident {
  id: string;
  title: string;
  category: "medical" | "security" | "crowd" | "fire" | "technical" | "weather";
  zone: string;
  severity: PriorityLevel;
  status: "open" | "investigating" | "contained" | "resolved";
  reportedAt: string;
  description: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  level: "watch" | "warning" | "critical";
  zone: string;
  message: string;
  issuedAt: string;
  active: boolean;
}

export interface MapPin {
  id: string;
  label: string;
  category: "volunteer" | "transport" | "medical" | "security" | "incident" | "parking";
  x: number; // percent 0-100 for placeholder map
  y: number; // percent 0-100 for placeholder map
  tone: StatusTone;
}
