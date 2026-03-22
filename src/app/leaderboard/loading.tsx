function LeaderboardCardSkeleton() {
  return (
    <article className="overflow-hidden border border-border-subtle bg-canvas-base">
      <div className="flex min-h-12 flex-col gap-3 border-b border-border-subtle px-5 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <div className="h-4 w-12 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-16 animate-pulse rounded-sm bg-canvas-elevated" />
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs">
          <div className="h-4 w-20 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-16 animate-pulse rounded-sm bg-canvas-elevated" />
        </div>
      </div>

      <div className="space-y-3 border-t-0 px-5 py-4">
        <div className="h-4 w-full animate-pulse rounded-sm bg-canvas-elevated" />
        <div className="h-4 w-11/12 animate-pulse rounded-sm bg-canvas-elevated" />
        <div className="h-4 w-2/3 animate-pulse rounded-sm bg-canvas-elevated" />
        <div className="h-4 w-4/5 animate-pulse rounded-sm bg-canvas-elevated" />
        <div className="h-4 w-1/2 animate-pulse rounded-sm bg-canvas-elevated" />
      </div>
    </article>
  );
}

export default function LeaderboardLoading() {
  return (
    <main className="px-6 py-10 md:px-10 md:py-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 lg:px-10">
        <section className="flex w-full flex-col gap-4 border-b border-border-subtle pb-10">
          <div className="h-8 w-64 animate-pulse rounded-sm bg-canvas-elevated" />
          <div className="h-4 w-72 animate-pulse rounded-sm bg-canvas-elevated" />

          <div className="flex flex-wrap items-center gap-2">
            <div className="h-4 w-28 animate-pulse rounded-sm bg-canvas-elevated" />
            <span className="text-foreground-muted">&middot;</span>
            <div className="h-4 w-24 animate-pulse rounded-sm bg-canvas-elevated" />
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
          <LeaderboardCardSkeleton />
        </section>
      </div>
    </main>
  );
}
