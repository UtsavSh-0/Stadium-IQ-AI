// components/dashboard/crowd/PredictionCard.tsx
"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Gauge } from "lucide-react";
import type { CrowdPrediction } from "@/types/crowd";
import { riskBadgeClasses, riskLabel } from "@/lib/crowd-risk-styles";
import { cn } from "@/lib/utils";

export interface PredictionCardProps {
  predictions: CrowdPrediction[];
  className?: string;
}

export function PredictionCard({ predictions, className }: PredictionCardProps) {
  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Sparkles className="h-4 w-4 text-primary" />
          AI Crowd Predictions
        </CardTitle>
        <span className="text-xs text-muted-foreground">Model: forecast-v1</span>
      </CardHeader>
      <CardContent className="space-y-3">
        {predictions.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="rounded-lg border border-border/60 bg-card/50 p-3"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">{p.zoneName}</p>
              <Badge variant="outline" className={cn("text-[10px]", riskBadgeClasses[p.riskLevel])}>
                {riskLabel[p.riskLevel]}
              </Badge>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">{p.predictedFor}</p>

            <div className="mt-2 flex items-center gap-2">
              <Gauge className="h-3.5 w-3.5 text-muted-foreground" />
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${p.predictedOccupancy}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              <span className="text-xs font-medium text-foreground">{p.predictedOccupancy}%</span>
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Confidence:</span> {p.confidence}% —{" "}
              {p.recommendation}
            </p>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
}
