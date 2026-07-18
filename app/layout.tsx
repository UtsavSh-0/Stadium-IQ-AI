import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { QueryProvider } from "@/components/layout/query-provider";
import { GlobalThemeControl } from "@/components/layout/global-theme-control";
import "./globals.css";

export const metadata: Metadata = {
  title: "StadiumIQ AI — Stadium Operations Platform",
  description:
    "Enterprise-grade AI-powered stadium operations command center for FIFA World Cup 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="font-sans">
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
          <GlobalThemeControl />
        </ThemeProvider>
      </body>
    </html>
  );
}
