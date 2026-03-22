import type { LeaderboardPageData } from "@/server/api/services/leaderboard-service";

import { LeaderboardPageCard } from "./leaderboard-page-card";

type LeaderboardPageContentProps = {
  data: LeaderboardPageData;
};

function LeaderboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-border-subtle bg-surface-panel px-4 py-4">
      <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
        {label}
      </p>
      <p className="mt-3 font-mono text-3xl text-foreground-inverse">{value}</p>
    </div>
  );
}

function LeaderboardEmptyState() {
  return (
    <section className="border border-dashed border-border-subtle bg-canvas-base px-5 py-10 text-center">
      <p className="font-mono text-sm uppercase tracking-[0.08em] text-foreground-muted">
        no eligible roasts yet
      </p>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-foreground-secondary">
        The leaderboard is waiting for its first truly cursed submission. Roast
        a completed snippet and come back when the shame starts ranking.
      </p>
    </section>
  );
}

export function LeaderboardPageContent({ data }: LeaderboardPageContentProps) {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-6 border-b border-border-subtle pb-10">
        <div className="space-y-2">
          <div className="font-mono flex items-center gap-2 text-sm font-bold tracking-tight">
            <span className="text-accent-green">{"//"}</span>
            <span className="text-foreground-inverse">shame_leaderboard</span>
          </div>
          <h1 className="font-mono text-3xl tracking-tight text-foreground-inverse md:text-4xl">
            worst code, fully indexed
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-foreground-secondary">
            Twenty of the most roasted submissions, rendered server-first so the
            shame loads fast and stays readable.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:max-w-3xl">
          <LeaderboardStat
            label="eligible submissions"
            value={data.stats.totalEntries.toLocaleString()}
          />
          <LeaderboardStat
            label="average roast score"
            value={`${data.stats.averageScore.toFixed(1)}/10`}
          />
        </div>
      </section>

      {data.entries.length === 0 ? (
        <LeaderboardEmptyState />
      ) : (
        <section
          aria-label="Shame leaderboard entries"
          className="flex flex-col gap-5"
        >
          {data.entries.map((entry) => (
            <LeaderboardPageCard entry={entry} key={entry.id} />
          ))}
        </section>
      )}
    </div>
  );
}
