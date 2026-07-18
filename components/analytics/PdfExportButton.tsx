"use client";

import * as React from "react";
import { FileDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PdfExportButtonProps {
  /** Called when export is triggered; wire to the real export service later */
  onExport?: () => void | Promise<void>;
  className?: string;
}

/**
 * PDF export trigger for the Analytics dashboard.
 * UI-only: emits `onExport` and shows a brief loading state.
 * Actual PDF generation is owned by services/export-service.ts.
 */
export function PdfExportButton({ onExport, className }: PdfExportButtonProps) {
  const [isExporting, setIsExporting] = React.useState(false);

  async function handleClick() {
    setIsExporting(true);
    try {
      await onExport?.();
    } finally {
      window.setTimeout(() => setIsExporting(false), 900);
    }
  }

  return (
    <Button variant="outline" size="sm" className={className} onClick={handleClick} disabled={isExporting}>
      {isExporting ? (
        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
      ) : (
        <FileDown className="mr-1.5 h-3.5 w-3.5" />
      )}
      Export PDF
    </Button>
  );
}
