import {
  LayoutDashboard,
  Bot,
  Map,
  BarChart3,
  Bus,
  Users,
  Siren,
  Settings,
  Activity,
} from "lucide-react";
import type {
  AppNotification,
  NavGroup,
  SearchResultItem,
} from "@/types/layout";

/**
 * MOCK DATA — foundation module only.
 * Replace with real API/services wiring once backend endpoints exist.
 *
 * NOTE: the previous `mockCurrentUser` (fake auth identity) has been removed.
 * The signed-in user now comes from Supabase Auth via `useAuth()`
 * (components/providers/auth-provider.tsx). The data below is presentation
 * only (navigation structure, sample notifications, search index) and is not
 * authentication state.
 *
 * Other developers: extend `navGroups` items for your own module's
 * sub-routes, do not duplicate the group itself.
 */

export const navGroups: NavGroup[] = [
  {
    id: "overview",
    label: "Overview",
    items: [
      { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    id: "operations",
    label: "Operations",
    items: [
      { id: "ai", label: "AI Copilot", href: "/dashboard/assistant", icon: Bot, badge: "New" },
      { id: "map", label: "Live Map", href: "/dashboard/navigation", icon: Map },
      { id: "crowd", label: "Crowd Intelligence", href: "/dashboard/crowd", icon: Activity },
      { id: "analytics", label: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
      { id: "transport", label: "Transport", href: "/dashboard/operations?tab=transport", icon: Bus },
    ],
  },
  {
    id: "people",
    label: "People",
    items: [
      { id: "volunteer", label: "Volunteers", href: "/dashboard/operations?tab=volunteer", icon: Users },
      {
        id: "emergency",
        label: "Emergency Response",
        href: "/dashboard/operations?tab=emergency",
        icon: Siren,
        badge: 3,
      },
    ],
  },
  {
    id: "system",
    label: "System",
    items: [
      { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings },
    ],
  },
];

export const mockNotifications: AppNotification[] = [
  {
    id: "ntf_1",
    title: "Gate 4 congestion threshold reached",
    description: "Entry queue exceeds 12 min wait. Auto-suggested lane rebalancing.",
    severity: "warning",
    timestamp: "2 min ago",
    read: false,
    module: "Transport",
  },
  {
    id: "ntf_2",
    title: "Medical unit dispatched — Section 118",
    description: "Response team ETA 3 minutes. Incident tagged non-critical.",
    severity: "critical",
    timestamp: "8 min ago",
    read: false,
    module: "Emergency",
  },
  {
    id: "ntf_3",
    title: "Volunteer shift check-in complete",
    description: "412 of 430 volunteers checked in for the evening shift.",
    severity: "success",
    timestamp: "24 min ago",
    read: false,
    module: "Volunteer",
  },
  {
    id: "ntf_4",
    title: "Crowd density forecast updated",
    description: "AI model refreshed north concourse projections for kickoff.",
    severity: "info",
    timestamp: "1 hr ago",
    read: true,
    module: "AI Copilot",
  },
];

export const mockSearchIndex: SearchResultItem[] = [
  { id: "s1", title: "Live Crowd Map", description: "Real-time density across concourses", category: "Map", href: "/dashboard/navigation" },
  { id: "s1b", title: "Crowd Intelligence", description: "Live density, queues, and predictive alerts", category: "Crowd", href: "/dashboard/crowd" },
  { id: "s2", title: "Gate 4 Entry Queue", description: "Transport & access analytics", category: "Transport", href: "/dashboard/operations?tab=transport" },
  { id: "s3", title: "Incident #2291", description: "Emergency response case file", category: "Emergency", href: "/dashboard/operations?tab=emergency" },
  { id: "s4", title: "Volunteer Roster — Evening Shift", description: "412 / 430 checked in", category: "Volunteer", href: "/dashboard/operations?tab=volunteer" },
  { id: "s5", title: "AI Copilot: Kickoff Readiness", description: "Generated operations summary", category: "AI Copilot", href: "/dashboard/assistant" },
];
