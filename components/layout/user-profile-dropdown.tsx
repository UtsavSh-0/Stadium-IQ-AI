"use client";

import { useState } from "react";
import { LogOut, Settings, UserCircle } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/components/providers/auth-provider";
import type { Role } from "@/types/common";

const roleLabels: Record<Role, string> = {
  admin: "Administrator",
  operator: "Operations Manager",
  volunteer: "Volunteer",
  fan: "Fan",
};

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function UserProfileDropdown() {
  const { user, profile, loading, signOut } = useAuth();
  const [dialog, setDialog] = useState<"profile" | "preferences" | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  const displayName =
    profile?.full_name || user?.email?.split("@")[0] || "User";
  const email = profile?.email || user?.email || "";
  const role = (profile?.role ?? "fan") as Role;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 pr-2 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/15 text-primary">
            {loading ? "…" : initials(displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden text-left leading-tight md:block">
          <p className="text-xs font-medium text-foreground">{displayName}</p>
          <p className="text-[11px] text-muted-foreground">{roleLabels[role]}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold text-foreground">{displayName}</p>
          <p className="text-xs text-muted-foreground">{email}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => setDialog("profile")}>
          <UserCircle className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setDialog("preferences")}>
          <Settings className="h-4 w-4" />
          Preferences
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onSelect={() => signOut()}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={dialog === "profile"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Profile</DialogTitle>
            <DialogDescription>Your StadiumIQ account details.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-border bg-secondary/35 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-11 w-11">
                <AvatarFallback className="bg-primary/15 text-primary">
                  {initials(displayName)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{displayName}</p>
                <p className="text-sm text-muted-foreground">{roleLabels[role]}</p>
              </div>
            </div>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Email</dt>
                <dd>{email}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Role</dt>
                <dd className="text-right">{roleLabels[role]}</dd>
              </div>
            </dl>
          </div>
          <DialogFooter>
            <Button onClick={() => setDialog(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={dialog === "preferences"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Preferences</DialogTitle>
            <DialogDescription>These settings update locally for your current session.</DialogDescription>
          </DialogHeader>
          <div className="divide-y divide-border rounded-xl border border-border bg-secondary/35 px-4">
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium">Operational alerts</p>
                <p className="text-xs text-muted-foreground">Receive crowd and incident notifications.</p>
              </div>
              <Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} />
            </div>
            <div className="flex items-center justify-between gap-4 py-4">
              <div>
                <p className="text-sm font-medium">Compact data cards</p>
                <p className="text-xs text-muted-foreground">Fit more real-time metrics on screen.</p>
              </div>
              <Switch checked={compactMode} onCheckedChange={setCompactMode} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setDialog(null)}>Save preferences</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
