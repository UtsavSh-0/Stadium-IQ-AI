"use client";

import { motion } from "framer-motion";
import {
  Ticket,
  UtensilsCrossed,
  Shirt,
  ParkingCircle,
  Wallet,
  TrendingUp,
  TrendingDown,
  Minus,
  type LucideIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RevenueMetric } from "@/types/analytics";

export interface RevenueCardsProps {
  /** KPI metrics to render, one card each */
  metrics: RevenueMetric[];
  /** Optional className passthrough */
  className?: string;
}

const ICON_MAP: Record<RevenueMetric["icon"], LucideIcon> = {
  ticket: Ticket,
  utensils: UtensilsCrossed,
  shirt: Shirt,
  parking: ParkingCircle,
  wallet: Wallet,
  "trending-up": TrendingUp,
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

/**
 * Grid of KPI cards summarizing revenue streams.
 * Pure presentational component — pass mock or live metrics in.
 */
export function RevenueCards({ metrics, className }: RevenueCardsProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className={cn(
        "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
        className,
      )}
    >
      {metrics.map((metric) => {
        const Icon = ICON_MAP[metric.icon];
        const TrendIcon =
          metric.trend === "up" ? TrendingUp : metric.trend === "down" ? TrendingDown : Minus;
        const isPositive = metric.trend === "up";
        const isNegative = metric.trend === "down";

        return (
          <motion.div key={metric.id} variants={item}>
            <Card className="h-full border-border bg-card transition-shadow hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {metric.label}
                </CardTitle>
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold tabular-nums text-foreground">
                  {currencyFormatter.format(metric.value)}
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs">
                  <span
                    className={cn(
                      "flex items-center gap-0.5 font-medium",
                      isPositive && "text-emerald-600 dark:text-emerald-400",
                      isNegative && "text-destructive",
                      !isPositive && !isNegative && "text-muted-foreground",
                    )}
                  >
                    <TrendIcon className="h-3 w-3" aria-hidden="true" />
                    {Math.abs(metric.changePercent).toFixed(1)}%
                  </span>
                  <span className="text-muted-foreground">vs. prior period</span>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{metric.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
