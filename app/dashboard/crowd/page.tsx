// app/dashboard/crowd/page.tsx
import type { Metadata } from "next";
import { LiveCrowdDashboard } from "@/components/dashboard/crowd/LiveCrowdDashboard";

export const metadata: Metadata = {
  title: "Crowd Intelligence | StadiumIQ AI",
  description: "Live crowd density, congestion, queue, and prediction monitoring for FIFA World Cup 2026 venues.",
};

export default function CrowdIntelligencePage() {
  return (
    <main className="min-h-screen w-full bg-background p-4 sm:p-6 lg:p-8">
      <LiveCrowdDashboard />
    </main>
  );
}
