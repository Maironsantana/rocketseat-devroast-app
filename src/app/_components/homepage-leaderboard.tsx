import Link from "next/link";
import type { BundledLanguage } from "shiki";

import {
  buttonVariants,
  CodeBlock,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui";
import type { HomepageLeaderboardPreview } from "@/server/api/services/leaderboard-service";

import { HomepageLeaderboardCodePreview } from "./homepage-leaderboard-code-preview";

const PREVIEW_LINE_COUNT = 6;

function getCodeBlockLanguage(language: string): BundledLanguage {
  switch (language) {
    case "javascript":
    case "typescript":
    case "sql":
    case "python":
    case "java":
    case "csharp":
    case "go":
    case "rust":
    case "php":
      return language;
    default:
      return "text" as BundledLanguage;
  }
}

async function LeaderboardCodeCell({
  language,
  sourceCode,
}: {
  language: string;
  sourceCode: string;
}) {
  const lines = sourceCode.split("\n");
  const isExpandable = lines.length > PREVIEW_LINE_COUNT;
  const previewCode = isExpandable
    ? lines.slice(0, PREVIEW_LINE_COUNT).join("\n")
    : sourceCode;
  const codeLanguage = getCodeBlockLanguage(language);

  return (
    <HomepageLeaderboardCodePreview
      isExpandable={isExpandable}
      preview={
        <CodeBlock
          chrome={false}
          code={previewCode}
          lang={codeLanguage}
          showLineNumbers={false}
          variant="inline"
        />
      }
    >
      <CodeBlock
        chrome={false}
        code={sourceCode}
        lang={codeLanguage}
        showLineNumbers={false}
        variant="inline"
      />
    </HomepageLeaderboardCodePreview>
  );
}

type HomepageLeaderboardProps = {
  preview: HomepageLeaderboardPreview;
};

export async function HomepageLeaderboard({
  preview,
}: HomepageLeaderboardProps) {
  return (
    <section className="space-y-6" id="leaderboard-preview">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="font-mono flex items-center gap-2 text-sm font-bold tracking-tight">
            <span className="text-accent-green">{"//"}</span>
            <span className="text-foreground-inverse">shame_leaderboard</span>
          </div>
          <p className="text-sm text-foreground-muted">
            {"// the worst code on the internet, ranked by shame"}
          </p>
        </div>

        <Link
          className={buttonVariants({ size: "sm", variant: "secondary" })}
          href="/leaderboard"
        >
          $ view_full_leaderboard &gt;&gt;
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow variant="header">
            <TableCell as="th" tone="muted">
              #
            </TableCell>
            <TableCell as="th" tone="muted">
              score
            </TableCell>
            <TableCell as="th" tone="muted">
              code
            </TableCell>
            <TableCell as="th" tone="muted">
              lang
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {preview.entries.map((entry, index) => (
            <TableRow key={`${entry.language}-${entry.score}-${index + 1}`}>
              <TableCell tone="muted">{index + 1}</TableCell>
              <TableCell tone="score">{entry.score.toFixed(1)}</TableCell>
              <TableCell className="w-full min-w-0 max-w-0">
                <LeaderboardCodeCell
                  language={entry.language}
                  sourceCode={entry.sourceCode}
                />
              </TableCell>
              <TableCell tone="muted">{entry.language}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-center py-2">
        <p className="text-center text-xs text-foreground-muted">
          {`showing top ${preview.entries.length} of ${preview.totalRoasts.toLocaleString()} roasts - view full leaderboard >>`}
        </p>
      </div>
    </section>
  );
}
