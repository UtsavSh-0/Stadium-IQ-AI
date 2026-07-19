"use client";

import * as React from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockNotifications } from "@/lib/mock/layout-mock-data";
import { cn } from "@/lib/utils";
import type { NotificationSeverity } from "@/types/layout";

const severityDot: Record<NotificationSeverity, string> = {
  critical: "bg-destructive",
  warning: "bg-warning",
  success: "bg-success",
  info: "bg-info",
};

export function NotificationBell() {
  const [notifications, setNotifications] = React.useState(mockNotifications);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between px-3 py-2.5">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <button
            onClick={markAllRead}
            className="text-xs text-primary hover:underline disabled:pointer-events-none disabled:opacity-40"
            disabled={unreadCount === 0}
          >
            Mark all read
          </button>
        </div>
        <Separator />
        <ScrollArea className="max-h-80">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={cn(
                "flex gap-3 border-b border-border px-3 py-3 last:border-b-0",
                !n.read && "bg-secondary/40"
              )}
            >
              <span
                className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", severityDot[n.severity])}
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{n.title}</p>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{n.description}</p>
                <div className="mt-1.5 flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px]">
                    {n.module}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{n.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
