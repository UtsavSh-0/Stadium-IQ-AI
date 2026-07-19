"use client";

/**
 * TEMPORARY (hackathon): minimal custom global error page.
 *
 * Next.js 16 auto-generates /_global-error when this file is absent, and
 * prerendering that synthesized page crashes the production build on some
 * environments ("Cannot read properties of null (reading 'useContext')",
 * vercel/next.js#86178). Supplying our own file replaces the auto-generated
 * page with one that uses no context, no app providers, and no Tailwind —
 * plain inline styles only — so its prerender cannot hit the bug.
 *
 * global-error replaces the ROOT LAYOUT when it renders, so it must render
 * its own <html> and <body>. Keep this file dependency-free; the styled
 * per-route boundary in app/error.tsx still handles normal route errors.
 *
 * After the hackathon: keep the file (a custom global-error is best
 * practice anyway) but restyle it to match the design system once the
 * upstream Next.js bug is fixed.
 */
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100dvh",
          display: "grid",
          placeItems: "center",
          background: "#0c0e12",
          color: "#e2e2e8",
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: 24, maxWidth: 420 }}>
          <h1 style={{ fontSize: 22, marginBottom: 8 }}>
            Something went wrong
          </h1>
          <p style={{ fontSize: 14, color: "#8d90a2", lineHeight: 1.6 }}>
            An unexpected error occurred. Try again, or return to the home
            page.
          </p>
          <div
            style={{
              marginTop: 20,
              display: "flex",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <button
              onClick={reset}
              style={{
                background: "#7000ff",
                color: "#fff",
                border: 0,
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            {/* Plain <a> on purpose: global-error renders when the app shell
                (including the router) has crashed, so <Link> cannot be relied
                on here — a full-page navigation is the safe recovery path. */}
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
            <a
              href="/"
              style={{
                border: "1px solid rgba(255,255,255,.2)",
                borderRadius: 10,
                padding: "10px 20px",
                fontSize: 14,
                fontWeight: 600,
                color: "#e2e2e8",
                textDecoration: "none",
              }}
            >
              Go home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
