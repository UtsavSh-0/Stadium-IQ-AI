"use client";

import * as React from "react";
import { CheckCircle2 } from "lucide-react";
import { PdfExportButton } from "@/components/analytics/PdfExportButton";
import { CsvExportButton } from "@/components/analytics/CsvExportButton";
import type { ExportFormat } from "@/types/analytics";

export interface ExportToolbarProps {
  /** Called with the chosen format; hook up to services/export-service.ts */
  onExport?: (format: ExportFormat) => void | Promise<void>;
  className?: string;
}

/**
 * Groups the PDF/CSV export actions and surfaces a lightweight
 * confirmation message once an export completes.
 */
export function ExportToolbar({ onExport, className }: ExportToolbarProps) {
  const [lastExported, setLastExported] = React.useState<ExportFormat | null>(null);

  function handleExport(format: ExportFormat) {
    return async () => {
      await onExport?.(format);
      setLastExported(format);
      window.setTimeout(() => setLastExported(null), 2500);
    };
  }

  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <PdfExportButton onExport={handleExport("pdf")} />
        <CsvExportButton onExport={handleExport("csv")} />
      </div>
      {lastExported && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="h-3.5 w-3.5" />
          {lastExported.toUpperCase()} export ready
        </p>
      )}
    </div>
  );
}
