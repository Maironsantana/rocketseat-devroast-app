"use client";

import Link from "next/link";
import * as React from "react";

import {
  Button,
  buttonVariants,
  CodeEditorInput,
  SwitchControl,
  SwitchDescription,
  SwitchField,
  SwitchLabel,
  SwitchRoot,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui";

const sampleCode = [
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
].join("\n");

const leaderboardRows = [
  {
    code: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
    lang: "javascript",
    rank: "1",
    score: "1.2",
  },
  {
    code: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
    lang: "typescript",
    rank: "2",
    score: "1.8",
  },
  {
    code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
    lang: "sql",
    rank: "3",
    score: "2.1",
  },
];

export default function Home() {
  const [code, setCode] = React.useState(sampleCode);

  return (
    <main className="px-6 py-12 md:px-10 md:py-20">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8">
        <section className="space-y-3">
          <div className="font-mono flex items-center gap-3 text-[36px] font-bold leading-none tracking-tight text-foreground-inverse">
            <span className="text-accent-green">$</span>
            <h1>paste your code. get roasted.</h1>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-foreground-secondary md:text-base">
            {
              "// drop your code below and we'll rate it - brutally honest or full roast mode"
            }
          </p>
        </section>

        <CodeEditorInput
          fileName="calculate.js"
          minRows={16}
          onChange={(event) => setCode(event.target.value)}
          placeholder="// paste your code here"
          value={code}
        />

        <section className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <SwitchRoot defaultChecked>
            <SwitchControl />
            <SwitchField>
              <SwitchLabel>roast mode</SwitchLabel>
              <SwitchDescription>
                {"// maximum sarcasm enabled"}
              </SwitchDescription>
            </SwitchField>
          </SwitchRoot>

          <Button disabled={code.trim().length === 0}>$ roast_my_code</Button>
        </section>

        <section className="flex justify-center">
          <div className="font-mono flex items-center gap-6 text-xs text-foreground-muted">
            <span>2,847 codes roasted</span>
            <span>&middot;</span>
            <span>avg score: 4.2/10</span>
          </div>
        </section>

        <div className="h-7" />

        <section className="space-y-6" id="leaderboard-preview">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="font-mono flex items-center gap-2 text-sm font-bold tracking-tight">
                <span className="text-accent-green">{"//"}</span>
                <span className="text-foreground-inverse">
                  shame_leaderboard
                </span>
              </div>
              <p className="text-sm text-foreground-muted">
                {"// the worst code on the internet, ranked by shame"}
              </p>
            </div>

            <Link
              className={buttonVariants({ size: "sm", variant: "link" })}
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
              {leaderboardRows.map((row) => (
                <TableRow key={row.rank}>
                  <TableCell tone="muted">{row.rank}</TableCell>
                  <TableCell tone="score">{row.score}</TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      {row.code.map((line, index) => (
                        <span
                          className={
                            index === row.code.length - 1
                              ? "text-foreground-disabled"
                              : "text-foreground-inverse"
                          }
                          key={`${row.rank}-${line}`}
                        >
                          {line}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell tone="muted">{row.lang}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-center py-2">
            <p className="text-center text-xs text-foreground-muted">
              showing top 3 of 2,847 - view full leaderboard &gt;&gt;
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
