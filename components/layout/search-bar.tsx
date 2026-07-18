"use client";

import * as React from "react";
import { Search, CornerDownLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockSearchIndex } from "@/services/mockLayoutData";
import { cn } from "@/lib/utils";

export function SearchBar() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = React.useMemo(() => {
    if (!query.trim()) return mockSearchIndex.slice(0, 5);
    const q = query.toLowerCase();
    return mockSearchIndex.filter(
      (r) => r.title.toLowerCase().includes(q) || r.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full max-w-sm items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-1.5 text-left text-sm text-muted-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Search className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">Search stadium ops…</span>
        <kbd className="hidden shrink-0 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium sm:inline-block">
          ⌘K
        </kbd>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gap-0 p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-2 border-b border-border px-4 py-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search gates, incidents, volunteers, analytics…"
              className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
          <div className="max-h-80 overflow-y-auto scrollbar-thin p-2">
            {results.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                No results for &ldquo;{query}&rdquo;
              </p>
            ) : (
              results.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex w-full items-center justify-between gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
                  )}
                >
                  <span className="min-w-0">
                    <span className="block truncate font-medium text-foreground">{r.title}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {r.description}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-secondary px-2 py-0.5 text-[10px] text-muted-foreground">
                    {r.category}
                  </span>
                </button>
              ))
            )}
          </div>
          <div className="flex items-center gap-1 border-t border-border px-4 py-2 text-[11px] text-muted-foreground">
            <CornerDownLeft className="h-3 w-3" /> to select
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
