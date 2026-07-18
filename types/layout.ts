import type { LucideIcon } from "lucide-react";

export type UserRole =
  | "admin"
  | "operations-manager"
  | "security-lead"
  | "volunteer-coordinator"
  | "viewer";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  stadium: string;
}

export type NotificationSeverity = "info" | "warning" | "critical" | "success";

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  severity: NotificationSeverity;
  timestamp: string;
  read: boolean;
  module: string;
}

export interface NavLeafItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
}

export interface NavGroup {
  id: string;
  label: string;
  items: NavLeafItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface SearchResultItem {
  id: string;
  title: string;
  description: string;
  category: string;
  href: string;
}
