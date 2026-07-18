"use client";

/**
 * StadiumIQ AI — Navigation Module
 * Route Animation — draws the mock path from origin to destination with an
 * animated dashed stroke plus a pulsing marker that travels along the route.
 *
 * Location: components/map/RouteAnimation.tsx
 */

import { motion } from "framer-motion";
import type { NavigationRoute } from "@/types/navigation";

export interface RouteAnimationProps {
  route: NavigationRoute | null;
}

function pathFromPoints(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ` + rest.map((p) => `L ${p.x} ${p.y}`).join(" ");
}

export function RouteAnimation({ route }: RouteAnimationProps) {
  if (!route) return null;

  const d = pathFromPoints(route.path);
  const origin = route.path[0];
  const destination = route.path[route.path.length - 1];

  return (
    <g aria-hidden="true">
      {/* Base path */}
      <motion.path
        d={d}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={4}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 10"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      />

      {/* Animated dash flow to imply direction of travel */}
      <motion.path
        d={d}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth={4}
        strokeLinecap="round"
        strokeDasharray="2 14"
        initial={{ strokeDashoffset: 0 }}
        animate={{ strokeDashoffset: -160 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      {/* Origin marker */}
      <circle cx={origin.x} cy={origin.y} r={7} className="fill-primary stroke-background" strokeWidth={2} />

      {/* Travelling pulse marker */}
      <motion.circle
        r={6}
        className="fill-primary-foreground stroke-primary"
        strokeWidth={3}
        initial={{ offsetDistance: "0%" }}
        animate={{ offsetDistance: "100%" }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        style={{ offsetPath: `path('${d}')` }}
      />

      {/* Destination marker */}
      <motion.circle
        cx={destination.x}
        cy={destination.y}
        r={9}
        className="fill-none stroke-primary"
        strokeWidth={2.5}
        initial={{ scale: 0.6, opacity: 0.8 }}
        animate={{ scale: [0.9, 1.4, 0.9], opacity: [0.9, 0, 0.9] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <circle cx={destination.x} cy={destination.y} r={5} className="fill-primary" />
    </g>
  );
}
