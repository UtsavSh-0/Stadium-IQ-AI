// components/dashboard/crowd/AlertCard.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import type { CrowdAlert } from "@/types/crowd";
import { riskBadgeClasses, riskLabel } from "@/lib/crowd-risk-styles";
import { cn } from "@/lib/utils";

export interface AlertCardProps {
  alerts: CrowdAlert[];
  onAcknowledge?: (id: string) => void;
  className?: string;
}

export function AlertCard({ alerts, onAcknowledge, className }: AlertCardProps) {
  return (
    <Card className={cn("border-border/60", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <ShieldAlert className="h-4 w-4 text-primary" />
          Active Alerts
        </CardTitle>
        <Badge variant="secondary">{alerts.length} active</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {alerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center gap-2 py-8 text-center"
            >
              <CheckCircle2 className="h-6 w-6 text-emerald-500" />
              <p className="text-sm text-muted-foreground">No active alerts. All zones nominal.</p>
            </motion.div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                layout
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border border-border/60 bg-card/50 p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground">{alert.title}</p>
                      <Badge variant="outline" className={cn("text-[10px]", riskBadgeClasses[alert.severity])}>
                        {riskLabel[alert.severity]}
                      </Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{alert.message}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {alert.zoneName} · {alert.timestamp}
                    </p>
                  </div>
                  {onAcknowledge && (
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 shrink-0 px-2 text-xs"
                      onClick={() => onAcknowledge(alert.id)}
                    >
                      Ack
                    </Button>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
