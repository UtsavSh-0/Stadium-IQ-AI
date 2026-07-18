"use client";

import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsFilters } from "@/components/analytics/AnalyticsFilters";
import { RevenueCards } from "@/components/analytics/RevenueCards";
import { AttendanceChart } from "@/components/analytics/AttendanceChart";
import { CrowdAnalysisChart } from "@/components/analytics/CrowdAnalysisChart";
import { TrafficAnalysisChart } from "@/components/analytics/TrafficAnalysisChart";
import { CarbonFootprintChart } from "@/components/analytics/CarbonFootprintChart";
import { WaterUsageChart } from "@/components/analytics/WaterUsageChart";
import { ElectricityUsageChart } from "@/components/analytics/ElectricityUsageChart";
import { FoodSalesChart } from "@/components/analytics/FoodSalesChart";
import { ComparisonChart } from "@/components/analytics/ComparisonChart";
import { AiReportPlaceholder } from "@/components/analytics/AiReportPlaceholder";
import { ExportToolbar } from "@/components/analytics/ExportToolbar";
import {
  REVENUE_METRICS,
  ATTENDANCE_DATA,
  CROWD_ZONES,
  TRAFFIC_DATA,
  CARBON_DATA,
  WATER_USAGE_DATA,
  ELECTRICITY_USAGE_DATA,
  FOOD_SALES_DATA,
  REVENUE_COMPARISON_DATA,
  AI_REPORT_INSIGHTS,
} from "@/lib/mock/analytics-mock-data";
import type { ExportFormat } from "@/types/analytics";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export interface AnalyticsDashboardProps {
  className?: string;
}

/**
 * Top-level Analytics Dashboard for StadiumIQ AI.
 * Composes filters, KPI cards, operational charts, sustainability charts,
 * comparison view, export controls, and the AI report placeholder.
 *
 * Rendered at app/dashboard/analytics/page.tsx.
 */
export function AnalyticsDashboard({ className }: AnalyticsDashboardProps) {
  function handleExport(format: ExportFormat) {
    // Placeholder — replace with a real call into services/export-service.ts
    console.info(`[analytics] export requested: ${format}`);
  }

  return (
    <div className={className}>
      <motion.div initial="hidden" animate="show" variants={fadeUp} className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Stadium Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Revenue, attendance, crowd, transport, and sustainability insights across all FIFA World Cup 2026 venues.
        </p>
      </motion.div>

      <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <AnalyticsFilters />
        <ExportToolbar onExport={handleExport} className="lg:pt-1" />
      </div>

      <div className="mt-6">
        <RevenueCards metrics={REVENUE_METRICS} />
      </div>

      <Tabs defaultValue="operations" className="mt-6">
        <TabsList>
          <TabsTrigger value="operations">Operations</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="commercial">Commercial</TabsTrigger>
          <TabsTrigger value="ai-report">AI Report</TabsTrigger>
        </TabsList>

        <TabsContent value="operations" className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <AttendanceChart data={ATTENDANCE_DATA} />
          <TrafficAnalysisChart data={TRAFFIC_DATA} />
          <div className="xl:col-span-2">
            <CrowdAnalysisChart zones={CROWD_ZONES} />
          </div>
        </TabsContent>

        <TabsContent value="sustainability" className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <CarbonFootprintChart data={CARBON_DATA} />
          <WaterUsageChart data={WATER_USAGE_DATA} />
          <div className="xl:col-span-2">
            <ElectricityUsageChart data={ELECTRICITY_USAGE_DATA} />
          </div>
        </TabsContent>

        <TabsContent value="commercial" className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <FoodSalesChart data={FOOD_SALES_DATA} />
          <ComparisonChart
            data={REVENUE_COMPARISON_DATA}
            title="Revenue Comparison"
            description="Current tournament vs. previous tournament (USD, millions)"
            unit="M"
          />
        </TabsContent>

        <TabsContent value="ai-report" className="mt-4">
          <AiReportPlaceholder insights={AI_REPORT_INSIGHTS} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
