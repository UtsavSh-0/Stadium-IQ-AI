export default function RootLoading() {
  return (
    <div className="flex h-dvh w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-pulse-ring rounded-full bg-primary" />
          <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
        </span>
        <p className="text-xs text-muted-foreground">Loading StadiumIQ…</p>
      </div>
    </div>
  );
}
