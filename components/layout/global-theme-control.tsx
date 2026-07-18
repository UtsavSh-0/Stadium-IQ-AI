"use client";

import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export function GlobalThemeControl() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  if (pathname !== "/" && pathname !== "/login") return null;
  const dark = theme !== "light";
  return <button onClick={() => setTheme(dark ? "light" : "dark")} aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} className="fixed bottom-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-[#1a1c20]/90 text-[#b7c4ff] shadow-xl backdrop-blur transition hover:scale-105">{dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}</button>;
}
