export function HomepageMetricsSkeleton() {
  return (
    <div className="font-mono flex items-center gap-6 text-xs text-foreground-muted">
      <span className="h-4 w-32 animate-pulse rounded-sm bg-canvas-elevated" />
      <span>&middot;</span>
      <span className="h-4 w-24 animate-pulse rounded-sm bg-canvas-elevated" />
    </div>
  );
}
