import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { QueryProvider } from "@/components/layout/query-provider";
import { GlobalThemeControl } from "@/components/layout/global-theme-control";
import "./globals.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const displayFont = Manrope({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

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
      <body
        className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} font-sans`}
      >
        <ThemeProvider>
          <QueryProvider>{children}</QueryProvider>
          <GlobalThemeControl />
        </ThemeProvider>
      </body>
    </html>
  );
}
