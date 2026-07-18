// hooks/useCrowdSimulation.ts
"use client";

import { useEffect, useRef, useState } from "react";
import { generateCrowdSnapshot } from "@/lib/mock/crowd-data";
import type { LiveCrowdSnapshot } from "@/types/crowd";

interface UseCrowdSimulationOptions {
  intervalMs?: number;
  paused?: boolean;
}

interface UseCrowdSimulationResult {
  data: LiveCrowdSnapshot;
  isLive: boolean;
  toggleLive: () => void;
  refresh: () => void;
}

/**
 * Simulates a live-updating crowd intelligence data feed.
 * In production this would be replaced by a Socket.io subscription.
 */
export function useCrowdSimulation(
  options: UseCrowdSimulationOptions = {}
): UseCrowdSimulationResult {
  const { intervalMs = 4000 } = options;
  const [data, setData] = useState<LiveCrowdSnapshot>(() => generateCrowdSnapshot());
  const [isLive, setIsLive] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isLive) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setData(generateCrowdSnapshot());
    }, intervalMs);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isLive, intervalMs]);

  return {
    data,
    isLive,
    toggleLive: () => setIsLive((prev) => !prev),
    refresh: () => setData(generateCrowdSnapshot()),
  };
}
