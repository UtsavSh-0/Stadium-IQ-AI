"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { DateRange } from "@/types/analytics";

export interface DateRangePickerProps {
  /** Currently selected range */
  value: DateRange;
  /** Called with the new range whenever the user completes a selection */
  onChange: (range: DateRange) => void;
  /** Optional className passthrough for layout */
  className?: string;
}

/**
 * Reusable calendar-based date range picker.
 * Presentational only — the caller owns the actual filter state
 * (see store/analytics-store.ts).
 */
export function DateRangePicker({ value, onChange, className }: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false);

  const label =
    value.from && value.to
      ? `${format(value.from, "MMM d, yyyy")} – ${format(value.to, "MMM d, yyyy")}`
      : "Select date range";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id="analytics-date-range"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal sm:w-[280px]",
            !value.from && "text-muted-foreground",
            className,
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          <span className="truncate">{label}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={{ from: value.from, to: value.to }}
          onSelect={(range) => {
            if (range?.from && range?.to) {
              onChange({ from: range.from, to: range.to });
              setOpen(false);
            }
          }}
          numberOfMonths={2}
          defaultMonth={value.from}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
