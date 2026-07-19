"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ChevronsLeft, Radio, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { navGroups } from "@/lib/mock/layout-mock-data";
import { useUIStore } from "@/store/ui-store";
import { Badge } from "@/components/ui/badge";

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab");

  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-14 items-center gap-2 px-4", collapsed && "justify-center px-0")}>
        <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/15">
          <Radio className="h-4 w-4 text-primary" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary animate-pulse-ring" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
        </div>
        {!collapsed && (
          <div className="leading-tight">
            <p className="text-sm font-display font-semibold tracking-tight text-foreground">
              StadiumIQ
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              World Cup 2026
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-2">
        {navGroups.map((group) => (
          <div key={group.id} className="mb-4">
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const [itemPath, itemQuery] = item.href.split("?");
                const itemTab = itemQuery ? new URLSearchParams(itemQuery).get("tab") : null;
                const isActive = itemTab
                  ? pathname === itemPath && currentTab === itemTab
                  : pathname === itemPath;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <Link
                      href={item.disabled ? "#" : item.href}
                      aria-disabled={item.disabled}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "group relative flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors",
                        isActive
                          ? "bg-gradient-to-r from-violet-700 to-[#7000ff] text-white shadow-[0_8px_24px_rgba(112,0,255,.28)]"
                          : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                        item.disabled && "pointer-events-none opacity-40",
                        collapsed && "justify-center px-0"
                      )}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="sidebar-active-indicator"
                          className="absolute left-0 h-5 w-0.5 rounded-r bg-primary"
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                        />
                      )}
                      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                      {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
                      {!collapsed && item.badge !== undefined && (
                        <Badge
                          variant={typeof item.badge === "number" ? "destructive" : "default"}
                          className="px-1.5 py-0 text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}

export function Sidebar() {
  const { isSidebarCollapsed, toggleSidebar, isMobileSidebarOpen, setMobileSidebarOpen } =
    useUIStore();

  return (
    <>
      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarCollapsed ? 68 : 248 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="relative hidden shrink-0 border-r border-border bg-surface md:block"
      >
        <SidebarContent collapsed={isSidebarCollapsed} />
        <button
          onClick={toggleSidebar}
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-16 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-surface-elevated text-muted-foreground shadow-sm transition-colors hover:text-foreground"
        >
          <ChevronsLeft
            className={cn("h-3.5 w-3.5 transition-transform", isSidebarCollapsed && "rotate-180")}
          />
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="relative z-50 h-full w-64 border-r border-border bg-surface"
          >
            <button
              onClick={() => setMobileSidebarOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent collapsed={false} />
          </motion.aside>
        </div>
      )}
    </>
  );
}
