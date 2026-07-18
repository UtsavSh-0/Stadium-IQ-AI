import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analytics | StadiumIQ AI",
  description: "Revenue, attendance, crowd, transport, and sustainability analytics for FIFA World Cup 2026 venues.",
};

export default function AnalyticsPage() {
  return (
    <main className="min-h-screen w-full bg-background px-4 py-6 sm:px-6 lg:px-8">
      <AnalyticsDashboard className="mx-auto max-w-[1600px]" />
    </main>
  );
}
