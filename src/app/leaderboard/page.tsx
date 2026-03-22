import type { Metadata } from "next";
import type { BundledLanguage } from "shiki";

import { CodeBlock } from "@/components/ui";

type LeaderboardEntry = {
  code: string;
  language: BundledLanguage;
  lines: number;
  rank: number;
  score: string;
};

const leaderboardStats = {
  averageScore: "4.2/10",
  submissions: "2,847",
};

const leaderboardEntries: LeaderboardEntry[] = [
  {
    code: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ].join("\n"),
    language: "javascript",
    lines: 3,
    rank: 1,
    score: "1.2",
  },
  {
    code: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ].join("\n"),
    language: "typescript",
    lines: 3,
    rank: 2,
    score: "1.8",
  },
  {
    code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"].join(
      "\n",
    ),
    language: "sql",
    lines: 2,
    rank: 3,
    score: "2.1",
  },
  {
    code: ["catch (e) {", "  // ignore", "}"].join("\n"),
    language: "java",
    lines: 3,
    rank: 4,
    score: "2.3",
  },
  {
    code: [
      "const sleep = (ms) =>",
      "  new Date(Date.now() + ms)",
      "  while (new Date() < end) {}",
    ].join("\n"),
    language: "javascript",
    lines: 3,
    rank: 5,
    score: "2.5",
  },
];

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Shame Leaderboard | DevRoast",
  description:
    "Browse the most roasted code submissions on DevRoast with a server-rendered leaderboard built for indexing.",
};

async function LeaderboardCard({ entry }: { entry: LeaderboardEntry }) {
  return (
    <article className="overflow-hidden border border-border-subtle bg-canvas-base">
      <div className="flex min-h-12 flex-col gap-3 border-b border-border-subtle px-5 py-3 font-mono sm:flex-row sm:items-center sm:justify-between sm:py-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-foreground-muted">
            <span>#</span>
            <span className="text-sm font-bold text-accent-amber">
              {entry.rank}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-foreground-muted">
            <span>score:</span>
            <span className="text-sm font-bold text-accent-red">
              {entry.score}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-foreground-secondary">
          <span>{entry.language}</span>
          <span className="text-foreground-muted">{entry.lines} lines</span>
        </div>
      </div>

      <CodeBlock chrome={false} code={entry.code} lang={entry.language} />
    </article>
  );
}

export default function LeaderboardPage() {
  return (
    <main className="px-6 py-10 md:px-10 md:py-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 lg:px-10">
        <section className="flex w-full flex-col gap-4 border-b border-border-subtle pb-10">
          <div className="font-mono flex items-center gap-3 text-[28px] font-bold leading-none tracking-tight text-foreground-inverse md:text-[32px]">
            <span className="text-accent-green">&gt;</span>
            <h1>shame_leaderboard</h1>
          </div>

          <p className="font-mono text-sm text-foreground-secondary">
            {"// the most roasted code on the internet"}
          </p>

          <div className="font-mono flex flex-wrap items-center gap-2 text-xs text-foreground-muted">
            <span>{leaderboardStats.submissions} submissions</span>
            <span>&middot;</span>
            <span>avg score: {leaderboardStats.averageScore}</span>
          </div>
        </section>

        <section
          className="flex flex-col gap-5"
          aria-label="Leaderboard entries"
        >
          {leaderboardEntries.map((entry) => (
            <LeaderboardCard entry={entry} key={entry.rank} />
          ))}
        </section>
      </div>
    </main>
  );
}
