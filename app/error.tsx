"use client";

/**
 * Root error boundary. Catches unhandled render/runtime errors from any
 * route segment that doesn't define its own error.tsx, and offers a retry.
 */
import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { logger } from "@/lib/logger/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Unhandled route error", {
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <main className="grid min-h-dvh place-items-center bg-background px-5 text-foreground">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-destructive/15 text-destructive">
          <AlertTriangle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-bold">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          An unexpected error occurred while loading this screen. Your data is
          safe — try again, or return to the home page.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            href="/"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
