"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, AlertTriangle, Info, ShieldAlert, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AiReportInsight } from "@/types/analytics";

export interface AiReportPlaceholderProps {
  insights: AiReportInsight[];
  className?: string;
}

const SEVERITY_ICON: Record<AiReportInsight["severity"], React.ElementType> = {
  info: Info,
  warning: AlertTriangle,
  critical: ShieldAlert,
};

const SEVERITY_CLASS: Record<AiReportInsight["severity"], string> = {
  info: "text-sky-600 dark:text-sky-400",
  warning: "text-amber-600 dark:text-amber-400",
  critical: "text-destructive",
};

/**
 * Placeholder for the AI-generated narrative report.
 * Wired to OpenAI/LangChain by the AI module owner — this component
 * only renders mock insights and a "Generate Report" affordance.
 */
export function AiReportPlaceholder({ insights }: AiReportPlaceholderProps) {
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generated, setGenerated] = React.useState(false);

  function handleGenerate() {
    setIsGenerating(true);
    // Placeholder only — real implementation wires to the AI service layer
    // (services/ai-report-service.ts) once the AI module is integrated.
    window.setTimeout(() => {
      setIsGenerating(false);
      setGenerated(true);
    }, 1400);
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
            <CardTitle>AI Operations Report</CardTitle>
          </div>
          <CardDescription>
            Narrative summary generated from live analytics signals
          </CardDescription>
        </div>
        <Button size="sm" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {generated ? "Regenerate" : "Generate Report"}
            </>
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {!generated && !isGenerating && (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border py-10 text-center"
            >
              <Sparkles className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">
                Generate an AI summary of attendance, crowd, traffic, and sustainability trends.
              </p>
            </motion.div>
          )}

          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border py-10 text-center"
            >
              <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">Analyzing current match-day signals...</p>
            </motion.div>
          )}

          {generated && !isGenerating && (
            <motion.ul
              key="insights"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {insights.map((insight) => {
                const Icon = SEVERITY_ICON[insight.severity];
                return (
                  <li
                    key={insight.id}
                    className="flex gap-3 rounded-md border border-border p-3"
                  >
                    <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${SEVERITY_CLASS[insight.severity]}`} aria-hidden="true" />
                    <div>
                      <p className="text-sm font-medium text-foreground">{insight.title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{insight.summary}</p>
                    </div>
                  </li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
