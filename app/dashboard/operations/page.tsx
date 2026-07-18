"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Bus,
  ParkingCircle,
  HeartPulse,
  Shield,
  FileWarning,
  Siren,
} from "lucide-react";

import { VolunteerDashboard } from "@/components/volunteer/VolunteerDashboard";
import { TransportDashboard } from "@/components/transport/TransportDashboard";
import { ParkingDashboard } from "@/components/transport/ParkingDashboard";
import { MedicalDashboard } from "@/components/emergency/MedicalDashboard";
import { SecurityDashboard } from "@/components/emergency/SecurityDashboard";
import { IncidentDashboard } from "@/components/emergency/IncidentDashboard";
import { EmergencyDashboard } from "@/components/emergency/EmergencyDashboard";
import { NotificationsPanel } from "@/components/dashboard/NotificationsPanel";
import { MapsPlaceholder } from "@/components/map/MapsPlaceholder";
import type { NotificationItem, MapPin } from "@/types/operations";

const mockNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: "New unassigned task",
    message: "Restock first-aid kiosk needs a volunteer near Gate C.",
    timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
    tone: "warning",
    read: false,
    source: "volunteer",
  },
  {
    id: "n2",
    title: "Route disrupted",
    message: "Regional Rail service to Stadium Rail Link is currently disrupted.",
    timestamp: new Date(Date.now() - 6 * 60000).toISOString(),
    tone: "critical",
    read: false,
    source: "transport",
  },
  {
    id: "n3",
    title: "Medical case resolved",
    message: "MED-2034 has been marked resolved by Team Alpha.",
    timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
    tone: "success",
    read: true,
    source: "medical",
  },
  {
    id: "n4",
    title: "Weather advisory issued",
    message: "Lightning proximity alert issued for the stadium perimeter.",
    timestamp: new Date(Date.now() - 1 * 60000).toISOString(),
    tone: "critical",
    read: false,
    source: "emergency",
  },
];

const mockMapPins: MapPin[] = [
  { id: "mp1", label: "Ana Torres — Gate A", category: "volunteer", x: 20, y: 30, tone: "success" },
  { id: "mp2", label: "Shuttle Line 1", category: "transport", x: 65, y: 20, tone: "info" },
  { id: "mp3", label: "MED-2031 responding", category: "medical", x: 45, y: 55, tone: "warning" },
  { id: "mp4", label: "Security alert: Concourse C", category: "security", x: 80, y: 65, tone: "critical" },
  { id: "mp5", label: "VIP Deck — Full", category: "parking", x: 30, y: 75, tone: "critical" },
];

/**
 * Operations command center page.
 * Route: /dashboard/operations
 *
 * Assembles the Volunteer, Transport, Parking, Medical, Security, Incident
 * and Emergency dashboards behind a tabbed interface, alongside a persistent
 * notifications feed and stadium map placeholder.
 */
const OPERATIONS_TABS = [
  "volunteer",
  "transport",
  "parking",
  "medical",
  "security",
  "incident",
  "emergency",
] as const;

function OperationsPageInner() {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const initialTab = OPERATIONS_TABS.includes(requestedTab as (typeof OPERATIONS_TABS)[number])
    ? (requestedTab as (typeof OPERATIONS_TABS)[number])
    : "volunteer";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex max-w-[1600px] flex-col gap-6 p-4 sm:p-6 lg:p-8"
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Stadium Operations
        </h1>
        <p className="text-sm text-muted-foreground">
          Live command center for volunteer, transport, and emergency operations — FIFA World Cup 2026.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <MapsPlaceholder pins={mockMapPins} />
        </div>
        <NotificationsPanel notifications={mockNotifications} />
      </div>

      <Tabs defaultValue={initialTab} className="w-full">
        <TabsList className="flex h-auto flex-wrap justify-start gap-1">
          <TabsTrigger value="volunteer" className="gap-1.5">
            <Users className="h-3.5 w-3.5" />
            Volunteer
          </TabsTrigger>
          <TabsTrigger value="transport" className="gap-1.5">
            <Bus className="h-3.5 w-3.5" />
            Transport
          </TabsTrigger>
          <TabsTrigger value="parking" className="gap-1.5">
            <ParkingCircle className="h-3.5 w-3.5" />
            Parking
          </TabsTrigger>
          <TabsTrigger value="medical" className="gap-1.5">
            <HeartPulse className="h-3.5 w-3.5" />
            Medical
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Security
          </TabsTrigger>
          <TabsTrigger value="incident" className="gap-1.5">
            <FileWarning className="h-3.5 w-3.5" />
            Incidents
          </TabsTrigger>
          <TabsTrigger value="emergency" className="gap-1.5">
            <Siren className="h-3.5 w-3.5" />
            Emergency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="volunteer" className="mt-4">
          <VolunteerDashboard />
        </TabsContent>
        <TabsContent value="transport" className="mt-4">
          <TransportDashboard />
        </TabsContent>
        <TabsContent value="parking" className="mt-4">
          <ParkingDashboard />
        </TabsContent>
        <TabsContent value="medical" className="mt-4">
          <MedicalDashboard />
        </TabsContent>
        <TabsContent value="security" className="mt-4">
          <SecurityDashboard />
        </TabsContent>
        <TabsContent value="incident" className="mt-4">
          <IncidentDashboard />
        </TabsContent>
        <TabsContent value="emergency" className="mt-4">
          <EmergencyDashboard />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}

export default function OperationsPage() {
  return (
    <Suspense fallback={null}>
      <OperationsPageInner />
    </Suspense>
  );
}
