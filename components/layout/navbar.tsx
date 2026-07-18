"use client";

import { Menu, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/layout/search-bar";
import { NotificationBell } from "@/components/layout/notification-bell";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserProfileDropdown } from "@/components/layout/user-profile-dropdown";
import { useUIStore } from "@/store/useUIStore";

export function Navbar() {
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-border/80 bg-background/85 px-4 backdrop-blur-xl sm:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-4 w-4" />
      </Button>

      <div className="hidden items-center gap-2 text-xs text-muted-foreground xl:flex">
        <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-50" /><span className="relative inline-flex h-2 w-2 rounded-full bg-primary" /></span>
        <Radio className="h-3.5 w-3.5 text-primary" /> Live operations
      </div>

      <div className="flex-1 xl:max-w-xl">
        <SearchBar />
      </div>

      <div className="flex items-center gap-1.5">
        <NotificationBell />
        <ThemeToggle />
        <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
        <UserProfileDropdown />
      </div>
    </header>
  );
}
