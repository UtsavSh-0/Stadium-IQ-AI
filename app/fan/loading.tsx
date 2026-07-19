import { Skeleton } from "@/components/ui/skeleton";

export default function FanLoading() {
  return (
    <main className="min-h-dvh bg-[#0c0e12] text-slate-100">
      <div className="mx-auto min-h-dvh max-w-6xl border-x border-white/5 px-5 py-4 sm:px-8">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-28 bg-white/10" />
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
            <Skeleton className="h-9 w-16 rounded-full bg-white/10" />
            <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
          </div>
        </div>
        <div className="mt-8 flex items-end justify-between gap-4">
          <div>
            <Skeleton className="h-4 w-40 bg-white/10" />
            <Skeleton className="mt-2 h-9 w-72 bg-white/10" />
          </div>
          <Skeleton className="h-16 w-36 rounded-2xl bg-white/10" />
        </div>
        <Skeleton className="mt-5 h-16 w-full rounded-2xl bg-white/10" />
        <Skeleton className="mt-5 h-56 w-full rounded-3xl bg-white/10" />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-2xl bg-white/10" />
          ))}
        </div>
      </div>
    </main>
  );
}
