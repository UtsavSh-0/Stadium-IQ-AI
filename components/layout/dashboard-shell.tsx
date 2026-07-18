import type { ReactNode } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Navbar } from "@/components/layout/navbar";

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background bg-[radial-gradient(ellipse_at_80%_-10%,hsl(var(--primary)/.06),transparent_32%)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar />
        <main className="flex flex-1 flex-col overflow-y-auto scrollbar-thin">{children}</main>
      </div>
    </div>
  );
}
