function LeaderboardStatSkeleton() {
  return (
    <div className="border border-border-subtle bg-surface-panel px-4 py-4">
      <div className="h-3 w-28 animate-pulse rounded-sm bg-canvas-elevated" />
      <div className="mt-3 h-8 w-24 animate-pulse rounded-sm bg-canvas-elevated" />
    </div>
  );
}

function LeaderboardCardSkeleton() {
  return (
    <article className="overflow-hidden border border-border-subtle bg-surface-panel">
      <div className="flex min-h-12 flex-col gap-3 border-b border-border-subtle px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="h-3 w-10 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-3 w-20 animate-pulse rounded-sm bg-canvas-elevated" />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div className="h-3 w-16 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-3 w-12 animate-pulse rounded-sm bg-canvas-elevated" />
        </div>
      </div>

      <div className="space-y-4 px-5 py-4">
        <div className="space-y-2 border-b border-border-subtle pb-4">
          <div className="h-4 w-full animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-11/12 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-4/5 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-3/4 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-2/3 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-1/2 animate-pulse rounded-sm bg-canvas-elevated" />
        </div>

        <div className="space-y-2">
          <div className="h-3 w-16 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-full animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-10/12 animate-pulse rounded-sm bg-canvas-elevated" />
        </div>
      </div>
    </article>
  );
}

export function LeaderboardPageSkeleton() {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-6 border-b border-border-subtle pb-10">
        <div className="space-y-2">
          <div className="h-4 w-40 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-8 w-72 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-full max-w-2xl animate-pulse rounded-sm bg-canvas-elevated" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:max-w-3xl">
          <LeaderboardStatSkeleton />
          <LeaderboardStatSkeleton />
        </div>
      </section>

      <section
        aria-label="Leaderboard entries loading"
        className="flex flex-col gap-5"
      >
        <LeaderboardCardSkeleton />
        <LeaderboardCardSkeleton />
        <LeaderboardCardSkeleton />
        <LeaderboardCardSkeleton />
      </section>
    </div>
  );
}
