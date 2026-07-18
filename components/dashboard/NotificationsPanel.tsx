"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toneStyles, relativeTime } from "@/lib/operations-ui";
import type { NotificationItem } from "@/types/operations";

export interface NotificationsPanelProps {
  notifications: NotificationItem[];
  className?: string;
  onMarkAllRead?: () => void;
}

/**
 * Live notification feed surfaced on the Operations command center.
 * Consumes NotificationItem[] mock data; source-agnostic across all modules.
 */
export function NotificationsPanel({
  notifications,
  className,
  onMarkAllRead,
}: NotificationsPanelProps) {
  const [items, setItems] = useState(notifications);
  const unreadCount = items.filter((n) => !n.read).length;

  const handleMarkAll = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    onMarkAllRead?.();
  };

  return (
    <Card className={cn("border-border/60 bg-card", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Bell className="h-4 w-4 text-primary" />
          Notifications
          {unreadCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
              {unreadCount}
            </Badge>
          )}
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 text-xs text-muted-foreground"
          onClick={handleMarkAll}
          disabled={unreadCount === 0}
        >
          <CheckCheck className="h-3.5 w-3.5" />
          Mark all read
        </Button>
      </CardHeader>
      <CardContent className="max-h-80 space-y-1 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {items.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">You&apos;re all caught up</p>
          )}
          {items.map((n) => {
            const tone = toneStyles[n.tone];
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "flex gap-2.5 rounded-md border border-transparent p-2.5 transition-colors hover:bg-accent/50",
                  !n.read && "bg-accent/30"
                )}
              >
                <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", tone.dot)} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-medium text-foreground">{n.title}</p>
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {relativeTime(n.timestamp)}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.message}</p>
                  <Badge variant="outline" className="mt-1.5 h-4.5 px-1.5 text-[10px] capitalize">
                    {n.source}
                  </Badge>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

export default NotificationsPanel;
