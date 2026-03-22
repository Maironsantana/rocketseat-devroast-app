import {
  CollapsibleCodePreview,
  PanelContent,
  PanelHeader,
  PanelRoot,
} from "@/components/ui";
import { CodeBlock } from "@/components/ui/code-block";
import { getCodeBlockLanguage } from "@/lib/code-editor/get-code-block-language";
import type { LeaderboardPageEntry } from "@/server/api/services/leaderboard-service";

const PREVIEW_LINE_COUNT = 6;

type LeaderboardPageCardProps = {
  entry: LeaderboardPageEntry;
};

export function LeaderboardPageCard({ entry }: LeaderboardPageCardProps) {
  const lines = entry.sourceCode.split("\n");
  const isExpandable = lines.length > PREVIEW_LINE_COUNT;
  const previewCode = isExpandable
    ? lines.slice(0, PREVIEW_LINE_COUNT).join("\n")
    : entry.sourceCode;
  const codeLanguage = getCodeBlockLanguage(entry.language);

  return (
    <PanelRoot variant="terminal">
      <PanelHeader className="flex min-h-12 flex-col items-start justify-between gap-3 px-5 py-3 sm:flex-row sm:items-center sm:py-0">
        <div className="font-mono flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
          <span className="text-foreground-inverse">#{entry.rank}</span>
          <span>
            score{" "}
            <span className="text-accent-amber">{entry.score.toFixed(1)}</span>
          </span>
        </div>

        <div className="font-mono flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
          <span>lang {entry.language}</span>
          <span className="text-border-subtle">/</span>
          <span>{entry.lines} lines</span>
        </div>
      </PanelHeader>

      <PanelContent className="space-y-4 px-0 pb-5 pt-0" padding="none">
        <div className="border-b border-border-subtle px-5 py-4">
          <CollapsibleCodePreview
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
              code={entry.sourceCode}
              lang={codeLanguage}
              showLineNumbers={false}
              variant="inline"
            />
          </CollapsibleCodePreview>
        </div>

        <div className="space-y-2 px-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-foreground-muted">
            {"// roast"}
          </p>
          <p className="text-sm leading-6 text-foreground-secondary">
            {entry.roast}
          </p>
        </div>
      </PanelContent>
    </PanelRoot>
  );
}
