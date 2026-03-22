export function HomepageLeaderboardSkeleton() {
  return (
    <section className="space-y-6" id="leaderboard-preview">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-4 w-40 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-64 animate-pulse rounded-sm bg-canvas-elevated" />
        </div>

        <div className="h-4 w-40 animate-pulse rounded-sm bg-canvas-elevated" />
      </div>

      <div className="overflow-hidden border border-border-subtle bg-canvas-base">
        <div className="grid grid-cols-[56px_88px_1fr_96px] border-b border-border-subtle bg-surface-subtle">
          <span className="h-[49px]" />
          <span className="h-[49px]" />
          <span className="h-[49px]" />
          <span className="h-[49px]" />
        </div>

        {["row-1", "row-2", "row-3"].map((rowKey) => (
          <div
            className="grid grid-cols-[56px_88px_1fr_96px] border-b border-border-subtle last:border-b-0"
            key={rowKey}
          >
            <div className="px-5 py-4">
              <div className="h-4 w-4 animate-pulse rounded-sm bg-canvas-elevated" />
            </div>
            <div className="px-5 py-4">
              <div className="h-4 w-10 animate-pulse rounded-sm bg-canvas-elevated" />
            </div>
            <div className="space-y-2 px-5 py-4">
              <div className="h-4 w-full animate-pulse rounded-sm bg-canvas-elevated" />
              <div className="h-4 w-3/4 animate-pulse rounded-sm bg-canvas-elevated" />
              <div className="h-4 w-2/3 animate-pulse rounded-sm bg-canvas-elevated" />
            </div>
            <div className="px-5 py-4">
              <div className="h-4 w-16 animate-pulse rounded-sm bg-canvas-elevated" />
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center py-2">
        <div className="h-4 w-52 animate-pulse rounded-sm bg-canvas-elevated" />
      </div>
    </section>
  );
}
