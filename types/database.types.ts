/**
 * Supabase-generated database types.
 *
 * This file is normally produced by the Supabase CLI:
 *
 *   supabase gen types typescript --project-id <ref> --schema public > types/database.types.ts
 *
 * It is checked in by hand here (matching the SQL migrations under
 * supabase/migrations) so the rest of the codebase — Supabase clients,
 * repositories, models — has a single source of truth for row/insert/update
 * shapes without requiring a live project during development.
 *
 * Regenerate this file after changing any migration.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ---------------------------------------------------------------------------
// Enums (mirrors supabase/migrations/0001_enums.sql)
// ---------------------------------------------------------------------------

export type UserRole = "admin" | "operator" | "volunteer" | "fan";
export type MatchStatus = "scheduled" | "live" | "completed" | "cancelled" | "postponed";
export type CrowdRiskLevel = "low" | "moderate" | "high" | "critical";
export type NotificationChannel = "push" | "sms" | "email" | "in_app";
export type NotificationStatus = "pending" | "sent" | "failed" | "read";
export type IncidentSeverity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "reported" | "acknowledged" | "in_progress" | "resolved" | "closed";
export type IncidentCategory =
  | "medical"
  | "security"
  | "crowd_control"
  | "fire"
  | "infrastructure"
  | "weather"
  | "other";
export type VolunteerStatus = "available" | "on_shift" | "off_duty" | "unavailable";
export type TransportMode = "bus" | "train" | "metro" | "parking" | "rideshare" | "shuttle";
export type TransportStatusLevel = "normal" | "delayed" | "congested" | "suspended";
export type ReportStatus = "draft" | "generated" | "archived";
export type ReportFormat = "pdf" | "csv" | "json";
export type ChatRole = "user" | "assistant" | "system";
export type NavigationNodeType =
  | "gate"
  | "seat_block"
  | "restroom"
  | "food_court"
  | "parking"
  | "exit"
  | "medical"
  | "info_point"
  | "junction";
export type AnalyticsMetricType =
  | "attendance"
  | "revenue"
  | "crowd_density"
  | "traffic"
  | "electricity_usage"
  | "water_usage"
  | "carbon_footprint"
  | "food_sales";

// ---------------------------------------------------------------------------
// Database interface
// ---------------------------------------------------------------------------

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12";
  };
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          auth_user_id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          phone: string | null;
          is_active: boolean;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          auth_user_id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          phone?: string | null;
          is_active?: boolean;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["users"]["Insert"]>;
      };
      stadiums: {
        Row: {
          id: string;
          name: string;
          city: string;
          country: string;
          capacity: number;
          timezone: string;
          latitude: number | null;
          longitude: number | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city: string;
          country: string;
          capacity: number;
          timezone?: string;
          latitude?: number | null;
          longitude?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["stadiums"]["Insert"]>;
      };
      matches: {
        Row: {
          id: string;
          stadium_id: string;
          home_team: string;
          away_team: string;
          status: MatchStatus;
          scheduled_at: string;
          started_at: string | null;
          ended_at: string | null;
          expected_attendance: number | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stadium_id: string;
          home_team: string;
          away_team: string;
          status?: MatchStatus;
          scheduled_at: string;
          started_at?: string | null;
          ended_at?: string | null;
          expected_attendance?: number | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["matches"]["Insert"]>;
      };
      crowd_metrics: {
        Row: {
          id: string;
          match_id: string;
          stadium_id: string;
          zone: string;
          occupancy: number;
          capacity: number;
          density_percent: number;
          risk_level: CrowdRiskLevel;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id: string;
          stadium_id: string;
          zone: string;
          occupancy: number;
          capacity: number;
          density_percent?: number;
          risk_level?: CrowdRiskLevel;
          recorded_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["crowd_metrics"]["Insert"]>;
      };
      notifications: {
        Row: {
          id: string;
          user_id: string | null;
          match_id: string | null;
          title: string;
          body: string;
          channel: NotificationChannel;
          status: NotificationStatus;
          read_at: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          match_id?: string | null;
          title: string;
          body: string;
          channel?: NotificationChannel;
          status?: NotificationStatus;
          read_at?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Insert"]>;
      };
      incidents: {
        Row: {
          id: string;
          match_id: string | null;
          stadium_id: string;
          reported_by: string | null;
          category: IncidentCategory;
          severity: IncidentSeverity;
          status: IncidentStatus;
          title: string;
          description: string | null;
          location: string | null;
          assigned_to: string | null;
          resolved_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id?: string | null;
          stadium_id: string;
          reported_by?: string | null;
          category: IncidentCategory;
          severity?: IncidentSeverity;
          status?: IncidentStatus;
          title: string;
          description?: string | null;
          location?: string | null;
          assigned_to?: string | null;
          resolved_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["incidents"]["Insert"]>;
      };
      volunteers: {
        Row: {
          id: string;
          user_id: string;
          stadium_id: string;
          status: VolunteerStatus;
          skills: string[];
          current_zone: string | null;
          shift_start: string | null;
          shift_end: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          stadium_id: string;
          status?: VolunteerStatus;
          skills?: string[];
          current_zone?: string | null;
          shift_start?: string | null;
          shift_end?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["volunteers"]["Insert"]>;
      };
      transport_status: {
        Row: {
          id: string;
          stadium_id: string;
          mode: TransportMode;
          route_name: string;
          status: TransportStatusLevel;
          eta_minutes: number | null;
          capacity_percent: number | null;
          notes: string | null;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          stadium_id: string;
          mode: TransportMode;
          route_name: string;
          status?: TransportStatusLevel;
          eta_minutes?: number | null;
          capacity_percent?: number | null;
          notes?: string | null;
          recorded_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["transport_status"]["Insert"]>;
      };
      reports: {
        Row: {
          id: string;
          match_id: string | null;
          stadium_id: string | null;
          generated_by: string | null;
          title: string;
          format: ReportFormat;
          status: ReportStatus;
          file_url: string | null;
          parameters: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          match_id?: string | null;
          stadium_id?: string | null;
          generated_by?: string | null;
          title: string;
          format?: ReportFormat;
          status?: ReportStatus;
          file_url?: string | null;
          parameters?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reports"]["Insert"]>;
      };
      chat_history: {
        Row: {
          id: string;
          user_id: string;
          conversation_id: string;
          role: ChatRole;
          content: string;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          conversation_id: string;
          role: ChatRole;
          content: string;
          metadata?: Json;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["chat_history"]["Insert"]>;
      };
      navigation_nodes: {
        Row: {
          id: string;
          stadium_id: string;
          name: string;
          node_type: NavigationNodeType;
          floor: number;
          x: number;
          y: number;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          stadium_id: string;
          name: string;
          node_type: NavigationNodeType;
          floor?: number;
          x: number;
          y: number;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["navigation_nodes"]["Insert"]>;
      };
      navigation_edges: {
        Row: {
          id: string;
          stadium_id: string;
          from_node_id: string;
          to_node_id: string;
          distance_meters: number;
          is_accessible: boolean;
          weight: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          stadium_id: string;
          from_node_id: string;
          to_node_id: string;
          distance_meters: number;
          is_accessible?: boolean;
          weight?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["navigation_edges"]["Insert"]>;
      };
      analytics: {
        Row: {
          id: string;
          stadium_id: string | null;
          match_id: string | null;
          metric_type: AnalyticsMetricType;
          metric_value: number;
          unit: string | null;
          dimension: Json;
          recorded_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          stadium_id?: string | null;
          match_id?: string | null;
          metric_type: AnalyticsMetricType;
          metric_value: number;
          unit?: string | null;
          dimension?: Json;
          recorded_at?: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["analytics"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_app_user_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      current_app_role: {
        Args: Record<string, never>;
        Returns: UserRole;
      };
    };
    Enums: {
      user_role: UserRole;
      match_status: MatchStatus;
      crowd_risk_level: CrowdRiskLevel;
      notification_channel: NotificationChannel;
      notification_status: NotificationStatus;
      incident_severity: IncidentSeverity;
      incident_status: IncidentStatus;
      incident_category: IncidentCategory;
      volunteer_status: VolunteerStatus;
      transport_mode: TransportMode;
      transport_status_level: TransportStatusLevel;
      report_status: ReportStatus;
      report_format: ReportFormat;
      chat_role: ChatRole;
      navigation_node_type: NavigationNodeType;
      analytics_metric_type: AnalyticsMetricType;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
