"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { FoodSalesCategory } from "@/types/analytics";

export interface FoodSalesChartProps {
  data: FoodSalesCategory[];
  className?: string;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

/** Concessions revenue mix by category, shown as a donut chart. */
export function FoodSalesChart({ data }: FoodSalesChartProps) {
  const total = data.reduce((sum, d) => sum + d.revenue, 0);

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle>Food &amp; Beverage Sales</CardTitle>
        <CardDescription>Revenue mix by concession category</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <div className="h-[240px] w-full sm:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="revenue"
                  nameKey="category"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={2}
                >
                  {data.map((entry) => (
                    <Cell key={entry.category} fill={`hsl(var(${entry.colorVar}))`} stroke="hsl(var(--card))" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    color: "hsl(var(--popover-foreground))",
                  }}
                  formatter={(value: number) => currencyFormatter.format(value)}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="w-full space-y-2 sm:w-1/2">
            <p className="text-sm text-muted-foreground">
              Total revenue:{" "}
              <span className="font-semibold text-foreground">{currencyFormatter.format(total)}</span>
            </p>
            <ul className="space-y-1.5">
              {data.map((entry) => (
                <li key={entry.category} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: `hsl(var(${entry.colorVar}))` }}
                    />
                    {entry.category}
                  </span>
                  <span className="tabular-nums text-muted-foreground">
                    {currencyFormatter.format(entry.revenue)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
