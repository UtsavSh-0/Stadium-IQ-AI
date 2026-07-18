import * as React from "react";
import { cn } from "@/lib/utils";
import type { DataTableProps } from "@/types/table";
import { Inbox } from "lucide-react";

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(
  ({ className, ...props }, ref) => (
    <div className="w-full overflow-x-auto scrollbar-thin rounded-lg border border-border">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
);
Table.displayName = "Table";

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("bg-surface-elevated", className)} {...props} />
  )
);
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(
  ({ className, ...props }, ref) => (
    <tbody ref={ref} className={cn("divide-y divide-border", className)} {...props} />
  )
);
TableBody.displayName = "TableBody";

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(
  ({ className, ...props }, ref) => (
    <tr ref={ref} className={cn("transition-colors hover:bg-secondary/50", className)} {...props} />
  )
);
TableRow.displayName = "TableRow";

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        "h-10 px-4 text-left align-middle text-xs font-medium uppercase tracking-wide text-muted-foreground",
        className
      )}
      {...props}
    />
  )
);
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className, ...props }, ref) => (
    <td ref={ref} className={cn("px-4 py-3 align-middle text-foreground", className)} {...props} />
  )
);
TableCell.displayName = "TableCell";

/**
 * DataTable — generic, typed table for tabular module data (transport
 * queues, incident logs, volunteer rosters, etc). Consumers supply typed
 * columns; this component owns only layout, loading, and empty states.
 */
export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  isLoading,
  emptyMessage = "No records to display",
  onRowClick,
  caption,
}: DataTableProps<T>) {
  return (
    <Table>
      {caption && <caption className="sr-only">{caption}</caption>}
      <TableHeader>
        <TableRow>
          {columns.map((col) => (
            <TableHead
              key={col.id}
              style={{ width: col.width }}
              className={cn(
                col.align === "right" && "text-right",
                col.align === "center" && "text-center"
              )}
            >
              {col.header}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={`skeleton-${i}`}>
              {columns.map((col) => (
                <TableCell key={col.id}>
                  <div className="h-4 w-3/4 animate-pulse rounded skeleton-shimmer" />
                </TableCell>
              ))}
            </TableRow>
          ))}

        {!isLoading && data.length === 0 && (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-10 text-center">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Inbox className="h-6 w-6" aria-hidden="true" />
                <span className="text-sm">{emptyMessage}</span>
              </div>
            </TableCell>
          </TableRow>
        )}

        {!isLoading &&
          data.map((row) => (
            <TableRow
              key={keyExtractor(row)}
              onClick={() => onRowClick?.(row)}
              className={cn(onRowClick && "cursor-pointer")}
            >
              {columns.map((col) => (
                <TableCell
                  key={col.id}
                  className={cn(
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                >
                  {col.accessor(row)}
                </TableCell>
              ))}
            </TableRow>
          ))}
      </TableBody>
    </Table>
  );
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell };
