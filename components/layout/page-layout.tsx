import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import type { BreadcrumbItem } from "@/types/layout";

export interface PageLayoutProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  children: ReactNode;
}

/**
 * PageLayout — the standard shell for every route under /dashboard.
 * Feature modules (AI, map, analytics, transport, volunteer, emergency)
 * should wrap their page content in this rather than rebuilding headers.
 */
export function PageLayout({
  title,
  description,
  breadcrumbs,
  actions,
  children,
}: PageLayoutProps) {
  return (
    <div className="relative mx-auto flex w-full max-w-[1680px] flex-1 flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <div className="absolute inset-x-0 top-0 -z-10 h-56 bg-[radial-gradient(ellipse_at_40%_0%,hsl(var(--primary)/.08),transparent_58%)]" />
      <div className="flex flex-col gap-3 border-b border-border/70 pb-5">
        {breadcrumbs && breadcrumbs.length > 0 && <Breadcrumb items={breadcrumbs} />}
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-[-0.025em] text-foreground md:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1.5 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
        </div>
      </div>
      {children}
    </div>
  );
}
