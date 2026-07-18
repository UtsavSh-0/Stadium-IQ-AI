"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const liveFeed = [
  { label: "Gate 4 entry flow", value: "nominal", tone: "success" },
  { label: "North concourse density", value: "78%", tone: "warning" },
  { label: "Medical units on standby", value: "12 / 12", tone: "success" },
];

export function LandingHero() {
  return (
    <section className="relative z-10 px-6 pb-20 pt-10 md:px-10 md:pt-16">
      <div className="pointer-events-none absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-primary" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
            </span>
            Live across 16 host stadiums
          </div>

          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.05] tracking-tight text-foreground md:text-6xl">
            The command deck for
            <span className="text-primary"> World Cup 2026 </span>
            stadium operations
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Crowd flow, transport, volunteers, and emergency response — unified
            into one AI-assisted operations view, built for the pace of
            matchday.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Enter command deck
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#capabilities">Explore modules</a>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="relative rounded-xl border border-border bg-card p-5 shadow-glow"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Activity className="h-4 w-4 text-primary" />
              Matchday pulse
            </div>
            <span className="font-mono text-xs text-muted-foreground">18:42 UTC</span>
          </div>

          <div className="mt-5 space-y-3">
            {liveFeed.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex items-center justify-between rounded-md border border-border bg-surface px-3 py-2.5 text-sm"
              >
                <span className="text-muted-foreground">{f.label}</span>
                <span
                  className={
                    f.tone === "success"
                      ? "font-mono text-success"
                      : "font-mono text-warning"
                  }
                >
                  {f.value}
                </span>
              </motion.div>
            ))}
          </div>

          <div className="mt-5 h-24 rounded-md border border-dashed border-border bg-grid" />
        </motion.div>
      </div>
    </section>
  );
}
