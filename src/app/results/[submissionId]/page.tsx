import type { Metadata } from "next";
import Link from "next/link";
import type { BundledLanguage } from "shiki";

import {
  Badge,
  buttonVariants,
  CodeBlock,
  DiffLine,
  PanelContent,
  PanelHeader,
  PanelRoot,
  ScoreRingRoot,
  ScoreRingValue,
  ScoreRingVisual,
} from "@/components/ui";

type PageProps = {
  params: Promise<{
    submissionId: string;
  }>;
};

type AnalysisIssue = {
  description: string;
  severity: "critical" | "warning" | "good";
  title: string;
};

const roastResult = {
  code: [
    "function calculateTotal(items) {",
    "  var total = 0;",
    "  for (var i = 0; i < items.length; i++) {",
    "    total = total + items[i].price;",
    "  }",
    "",
    "  if (total > 100) {",
    '    console.log("discount applied");',
    "    total = total * 0.9;",
    "  }",
    "",
    "  // TODO: handle tax calculation",
    "  // TODO: handle currency conversion",
    "",
    "  return total;",
    "}",
  ].join("\n"),
  issues: [
    {
      description:
        "`var` and manual index loops leak old habits into logic that should be clearer, safer, and easier to scan.",
      severity: "critical",
      title: "outdated style",
    },
    {
      description:
        "Looping over array indexes instead of values adds ceremony to what should be a small and direct calculation.",
      severity: "warning",
      title: "inefficient iteration",
    },
    {
      description:
        "The `discount applied` log sits inside business logic and couples calculation with side effects for no real benefit.",
      severity: "warning",
      title: "debug residue",
    },
    {
      description:
        "The function still has a readable purpose and a sensible return path, so at least the damage is contained.",
      severity: "good",
      title: "single responsibility-ish",
    },
  ] satisfies AnalysisIssue[],
  language: "javascript" as BundledLanguage,
  lines: 7,
  quotedRoast:
    '"this code looks like it was written during a power outage... in 2005."',
  score: 3.5,
  submissionFileName: "your_code.js",
  verdict: "needs_serious_help",
};

const suggestedDiff = [
  { content: "function calculateTotal(items) {", variant: "context" as const },
  { content: "  let total = 0;", variant: "added" as const },
  { content: "  for (const item of items) {", variant: "added" as const },
  { content: "    total += item.price;", variant: "added" as const },
  { content: "  }", variant: "added" as const },
  { content: "  var total = 0;", variant: "removed" as const },
  {
    content: "  for (var i = 0; i < items.length; i++) {",
    variant: "removed" as const,
  },
  {
    content: "    total = total + items[i].price;",
    variant: "removed" as const,
  },
  { content: "  }", variant: "removed" as const },
  { content: "  return total;", variant: "context" as const },
  { content: "}", variant: "context" as const },
];

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { submissionId } = await params;

  return {
    title: `Roast Results ${submissionId} | DevRoast`,
    description:
      "View a DevRoast submission result with roast score, detailed analysis, and a suggested code fix.",
  };
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="font-mono flex items-center gap-2 text-sm font-bold tracking-tight">
      <span className="text-accent-green">{"//"}</span>
      <h2 className="text-foreground-inverse">{title}</h2>
    </div>
  );
}

function AnalysisCard({ issue }: { issue: AnalysisIssue }) {
  return (
    <article className="flex h-full flex-col gap-3 border border-border-subtle p-5">
      <Badge size="md" variant={issue.severity}>
        {issue.title}
      </Badge>
      <p className="text-sm leading-6 text-foreground-secondary">
        {issue.description}
      </p>
    </article>
  );
}

export default async function ResultPage({ params }: PageProps) {
  const { submissionId } = await params;

  return (
    <main className="px-6 py-10 md:px-10 md:py-10">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 lg:px-10">
        <section className="flex flex-col gap-8 md:flex-row md:items-center md:gap-12">
          <ScoreRingRoot
            className="shrink-0"
            max={10}
            value={roastResult.score}
          >
            <ScoreRingVisual>
              <ScoreRingValue className="gap-0.5 [&>span:first-child]:text-accent-amber [&>span:last-child]:pb-1 [&>span:last-child]:text-[14px]" />
            </ScoreRingVisual>
          </ScoreRingRoot>

          <div className="flex min-w-0 flex-1 flex-col gap-4">
            <Badge size="md" variant="critical">
              verdict: {roastResult.verdict}
            </Badge>

            <p className="max-w-4xl text-lg leading-8 text-foreground-inverse md:text-xl">
              {roastResult.quotedRoast}
            </p>

            <div className="font-mono flex flex-wrap items-center gap-4 text-xs text-foreground-muted">
              <span>lang: {roastResult.language}</span>
              <span>&middot;</span>
              <span>{roastResult.lines} lines</span>
              <span>&middot;</span>
              <span>submission: {submissionId}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                className={buttonVariants({ size: "sm", variant: "secondary" })}
                href="/leaderboard"
              >
                $ share_roast
              </Link>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-border-subtle" />

        <section className="flex flex-col gap-4">
          <SectionHeading title="your_submission" />

          <CodeBlock
            chrome={false}
            code={roastResult.code}
            fileName={roastResult.submissionFileName}
            lang={roastResult.language}
          />
        </section>

        <div className="h-px w-full bg-border-subtle" />

        <section className="flex flex-col gap-6">
          <SectionHeading title="detailed_analysis" />

          <div className="grid gap-5 md:grid-cols-2">
            {roastResult.issues.map((issue) => (
              <AnalysisCard issue={issue} key={issue.title} />
            ))}
          </div>
        </section>

        <div className="h-px w-full bg-border-subtle" />

        <section className="flex flex-col gap-6">
          <SectionHeading title="suggested_fix" />

          <PanelRoot variant="terminal">
            <PanelHeader className="min-h-10 px-4">
              <span className="font-mono text-xs font-medium text-foreground-secondary">
                {`${roastResult.submissionFileName} -> improved_code.ts`}
              </span>
            </PanelHeader>

            <PanelContent className="p-0" padding="none">
              {suggestedDiff.map((line, index) => (
                <DiffLine
                  key={`${index}-${line.content}`}
                  variant={line.variant}
                >
                  {line.content}
                </DiffLine>
              ))}
            </PanelContent>
          </PanelRoot>
        </section>
      </div>
    </main>
  );
}
