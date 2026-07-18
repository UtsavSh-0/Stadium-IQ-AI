"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { mockCurrentUser } from "@/services/mockLayoutData";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const roleLabels: Record<string, string> = {
  admin: "Administrator",
  "operations-manager": "Operations Manager",
  "security-lead": "Security Lead",
  "volunteer-coordinator": "Volunteer Coordinator",
  viewer: "Viewer",
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
  const user = mockCurrentUser;
  const router = useRouter();
  const [dialog, setDialog] = useState<"profile" | "preferences" | null>(null);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [compactMode, setCompactMode] = useState(false);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 pr-2 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary/15 text-primary">
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden text-left leading-tight md:block">
          <p className="text-xs font-medium text-foreground">{user.name}</p>
          <p className="text-[11px] text-muted-foreground">{roleLabels[user.role]}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <p className="text-sm font-semibold text-foreground">{user.name}</p>
          <p className="text-xs text-muted-foreground">{user.email}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{user.stadium}</p>
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
        <DropdownMenuItem onSelect={() => router.push("/login")} className="text-destructive focus:text-destructive">
          <LogOut className="h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
      <Dialog open={dialog === "profile"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Operations profile</DialogTitle>
            <DialogDescription>Your demo operator identity for this command center.</DialogDescription>
          </DialogHeader>
          <div className="rounded-xl border border-border bg-secondary/35 p-4">
            <div className="flex items-center gap-3"><Avatar className="h-11 w-11"><AvatarFallback className="bg-primary/15 text-primary">{initials(user.name)}</AvatarFallback></Avatar><div><p className="font-semibold">{user.name}</p><p className="text-sm text-muted-foreground">{roleLabels[user.role]}</p></div></div>
            <dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Email</dt><dd>{user.email}</dd></div><div className="flex justify-between gap-4"><dt className="text-muted-foreground">Venue</dt><dd className="text-right">{user.stadium}</dd></div></dl>
          </div>
          <DialogFooter><Button onClick={() => setDialog(null)}>Done</Button></DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={dialog === "preferences"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Preferences</DialogTitle><DialogDescription>These demo settings update locally for your current session.</DialogDescription></DialogHeader>
          <div className="divide-y divide-border rounded-xl border border-border bg-secondary/35 px-4"><div className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-medium">Operational alerts</p><p className="text-xs text-muted-foreground">Receive crowd and incident notifications.</p></div><Switch checked={alertsEnabled} onCheckedChange={setAlertsEnabled} /></div><div className="flex items-center justify-between gap-4 py-4"><div><p className="text-sm font-medium">Compact data cards</p><p className="text-xs text-muted-foreground">Fit more real-time metrics on screen.</p></div><Switch checked={compactMode} onCheckedChange={setCompactMode} /></div></div>
          <DialogFooter><Button onClick={() => setDialog(null)}>Save preferences</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenu>
  );
}
