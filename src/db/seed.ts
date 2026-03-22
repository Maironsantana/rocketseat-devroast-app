import "dotenv/config";

import { createHash } from "node:crypto";
import { faker } from "@faker-js/faker";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import {
  type NewRoast,
  type NewRoastFinding,
  type NewRoastSuggestedFix,
  type NewSubmission,
  roastFindings,
  roastSuggestedFixes,
  roasts,
  submissions,
} from "@/db/schema";

const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://devroast:devroast@localhost:5432/devroast";

const pool = new Pool({ connectionString: databaseUrl });

const db = drizzle({
  client: pool,
  casing: "snake_case",
});

const languages = [
  "javascript",
  "typescript",
  "sql",
  "python",
  "java",
  "csharp",
  "go",
  "rust",
  "php",
] as const;

const providers = ["openai", "anthropic", "google"] as const;

type SeedLanguage = (typeof languages)[number];
type FindingSeverity = NewRoastFinding["severity"];

const findingCatalog: Record<
  FindingSeverity,
  Array<{ title: string; description: string }>
> = {
  critical: [
    {
      title: "unsafe dynamic execution",
      description:
        "The code executes untrusted input directly, which is a fast lane to security incidents.",
    },
    {
      title: "missing validation",
      description:
        "Input reaches core logic without validation, making failures and abuse much easier.",
    },
    {
      title: "fragile error handling",
      description:
        "The happy path is assumed everywhere and one bad value can take the whole flow down.",
    },
  ],
  warning: [
    {
      title: "imperative loop noise",
      description:
        "The implementation is more verbose than necessary and hides the real intent of the transformation.",
    },
    {
      title: "unclear naming",
      description:
        "Short or generic names force the reader to reverse engineer the purpose of the code.",
    },
    {
      title: "duplicated logic",
      description:
        "Similar operations appear in multiple places and will drift apart as the code evolves.",
    },
  ],
  good: [
    {
      title: "clear flow",
      description:
        "Even with issues, the main control flow is readable enough to follow without detective work.",
    },
    {
      title: "small function boundary",
      description:
        "The code keeps a relatively focused scope instead of turning into a giant everything-function.",
    },
    {
      title: "decent domain naming",
      description:
        "A few names still communicate intent and make the roast feel less catastrophic than it could be.",
    },
  ],
};

const codeSamplesByLanguage: Record<SeedLanguage, string[][]> = {
  javascript: [
    [
      'eval(prompt("enter code"));',
      "document.write(response);",
      "// trust the user lol",
    ],
    [
      "function calculateTotal(items) {",
      "  var total = 0;",
      "  for (var i = 0; i < items.length; i++) {",
      "    total = total + items[i].price;",
      "  }",
      "  return total;",
      "}",
    ],
  ],
  typescript: [
    [
      "type User = any;",
      "const loadUser = async (id: any) => fetch('/api/users/' + id).then((r) => r.json());",
      "export { loadUser };",
    ],
    [
      "export function parseFlag(flag: unknown) {",
      "  if (flag == true) return true;",
      "  if (flag == false) return false;",
      "  return !false;",
      "}",
    ],
  ],
  sql: [
    ["SELECT * FROM users WHERE 1=1;", "-- TODO: add auth later"],
    ["DELETE FROM sessions;", "INSERT INTO logs VALUES (NOW(), 'reset done');"],
  ],
  python: [
    [
      "def build_query(name):",
      "    return \"SELECT * FROM users WHERE name = '%s'\" % name",
    ],
    [
      "items = [1,2,3]",
      "result = []",
      "for i in range(len(items)):",
      "    result.append(items[i] * 2)",
    ],
  ],
  java: [
    [
      "public int total(List<Item> items) {",
      "  int total = 0;",
      "  for (int i = 0; i < items.size(); i++) {",
      "    total += items.get(i).price;",
      "  }",
      "  return total;",
      "}",
    ],
  ],
  csharp: [
    [
      "public static bool ParseFlag(object value)",
      "{",
      "    if (value == null) return true;",
      "    return value == (object)true;",
      "}",
    ],
  ],
  go: [
    [
      "func Total(items []Item) int {",
      "\ttotal := 0",
      "\tfor i := 0; i < len(items); i++ {",
      "\t\ttotal = total + items[i].Price",
      "\t}",
      "\treturn total",
      "}",
    ],
  ],
  rust: [
    [
      "fn total(items: &Vec<Item>) -> i32 {",
      "    let mut total = 0;",
      "    for i in 0..items.len() {",
      "        total += items[i].price;",
      "    }",
      "    total",
      "}",
    ],
  ],
  php: [
    [
      "$total = 0;",
      "for ($i = 0; $i < count($items); $i++) {",
      "    $total = $total + $items[$i]['price'];",
      "}",
      "echo $total;",
    ],
  ],
};

function chunk<T>(items: T[], size: number) {
  const result: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
}

function pickCodeSample(language: SeedLanguage) {
  const samples = codeSamplesByLanguage[language];

  return faker.helpers.arrayElement(samples).join("\n");
}

function getVerdict(score: number): NewRoast["verdict"] {
  if (score <= 2.5) {
    return "needs_serious_help";
  }

  if (score <= 5.0) {
    return "rough";
  }

  if (score <= 7.5) {
    return "salvageable";
  }

  return "clean";
}

function getHeadline(verdict: NewRoast["verdict"]) {
  const headlines = {
    needs_serious_help: [
      '"this code looks like a demo for how bugs reproduce in the wild."',
      '"bold choice turning technical debt into a coding style."',
      '"the runtime survived, but emotionally it will never recover."',
    ],
    rough: [
      '"there is a good idea here, trapped under avoidable chaos."',
      '"not a disaster, but definitely one merge away from becoming one."',
      '"the intent is fine, the execution just took the scenic route."',
    ],
    salvageable: [
      '"this can be cleaned up without calling an emergency incident review."',
      '"the code has potential, it just needs stricter habits and fewer shortcuts."',
      '"surprisingly fixable, which is more than we can say for most roasts."',
    ],
    clean: [
      '"annoyingly decent work, but we still found enough to keep the roast alive."',
      '"too competent to mock properly, so we had to zoom in harder."',
      '"this one escaped total humiliation by a narrow but respectable margin."',
    ],
  } as const;

  return faker.helpers.arrayElement(headlines[verdict]);
}

function createFindings(roastId: string) {
  const findings: NewRoastFinding[] = [];
  const severities: FindingSeverity[] = ["critical", "warning", "good"];

  let sortOrder = 1;

  for (const severity of severities) {
    const amount = severity === "warning" ? 2 : 1;

    for (let index = 0; index < amount; index += 1) {
      const template = faker.helpers.arrayElement(findingCatalog[severity]);

      findings.push({
        id: faker.string.uuid(),
        roastId,
        severity,
        title: template.title,
        description: template.description,
        sortOrder,
        createdAt: faker.date.recent({ days: 30 }),
      });

      sortOrder += 1;
    }
  }

  return findings;
}

function createSuggestedFix(roastId: string, language: SeedLanguage) {
  const extensionByLanguage: Record<SeedLanguage, string> = {
    javascript: "js",
    typescript: "ts",
    sql: "sql",
    python: "py",
    java: "java",
    csharp: "cs",
    go: "go",
    rust: "rs",
    php: "php",
  };

  const extension = extensionByLanguage[language];

  const diffLines = [
    "- var total = 0;",
    "+ const total = 0;",
    "- for (var i = 0; i < items.length; i++) {",
    "+ return items.reduce((sum, item) => sum + item.price, 0);",
  ];

  return {
    id: faker.string.uuid(),
    roastId,
    originalFileName: `legacy-snippet.${extension}`,
    suggestedFileName: `improved-snippet.${extension}`,
    diffText: diffLines.join("\n"),
    createdAt: faker.date.recent({ days: 30 }),
  } satisfies NewRoastSuggestedFix;
}

function buildSeedRows(totalRoasts: number) {
  const submissionRows: NewSubmission[] = [];
  const roastRows: NewRoast[] = [];
  const findingRows: NewRoastFinding[] = [];
  const suggestedFixRows: NewRoastSuggestedFix[] = [];

  for (let index = 0; index < totalRoasts; index += 1) {
    const language = faker.helpers.arrayElement(languages);
    const sourceCode = pickCodeSample(language);
    const lineCount = sourceCode.split("\n").length;
    const score = faker.number.float({ min: 0.4, max: 9.7, fractionDigits: 1 });
    const verdict = getVerdict(score);
    const submissionId = faker.string.uuid();
    const roastId = faker.string.uuid();
    const createdAt = faker.date.recent({ days: 45 });
    const sourceHash = createHash("sha256").update(sourceCode).digest("hex");
    const publicId = `r${String(index + 1).padStart(3, "0")}${faker.string.alphanumeric(
      {
        length: 10,
        casing: "lower",
      },
    )}`;
    const providerKey = faker.helpers.arrayElement(providers);
    const promptTokens = faker.number.int({ min: 200, max: 1400 });
    const completionTokens = faker.number.int({ min: 120, max: 900 });

    submissionRows.push({
      id: submissionId,
      publicId,
      sourceCode,
      language,
      roastMode: faker.datatype.boolean(0.7),
      lineCount,
      charCount: sourceCode.length,
      status: "completed",
      sourceHash,
      createdAt,
      updatedAt: createdAt,
    });

    roastRows.push({
      id: roastId,
      submissionId,
      score: score.toFixed(1),
      verdict,
      headline: getHeadline(verdict),
      summary: faker.helpers.arrayElement([
        "The code works just enough to be dangerous in production.",
        "A few focused refactors would remove most of the embarrassment here.",
        "Readable intent, shaky execution, and plenty of roast fuel.",
      ]),
      providerKey,
      model: faker.helpers.arrayElement([
        "gpt-4.1-mini",
        "claude-3-5-sonnet",
        "gemini-2.0-flash",
      ]),
      providerRequestId: faker.string.alphanumeric({
        length: 20,
        casing: "lower",
      }),
      providerMetadata: {
        finishReason: "stop",
        latencyMs: faker.number.int({ min: 400, max: 3200 }),
        promptTokens,
        completionTokens,
      },
      tokensUsed: promptTokens + completionTokens,
      completedAt: createdAt,
      createdAt,
    });

    findingRows.push(...createFindings(roastId));

    if (faker.datatype.boolean(0.85)) {
      suggestedFixRows.push(createSuggestedFix(roastId, language));
    }
  }

  return {
    submissionRows,
    roastRows,
    findingRows,
    suggestedFixRows,
  };
}

async function main() {
  const totalRoasts = 100;
  const { submissionRows, roastRows, findingRows, suggestedFixRows } =
    buildSeedRows(totalRoasts);

  await db.execute(sql`
    truncate table
      roast_findings,
      roast_suggested_fixes,
      roasts,
      submissions
    restart identity cascade
  `);

  for (const batch of chunk(submissionRows, 25)) {
    await db.insert(submissions).values(batch);
  }

  for (const batch of chunk(roastRows, 25)) {
    await db.insert(roasts).values(batch);
  }

  for (const batch of chunk(findingRows, 100)) {
    await db.insert(roastFindings).values(batch);
  }

  for (const batch of chunk(suggestedFixRows, 50)) {
    await db.insert(roastSuggestedFixes).values(batch);
  }

  console.log(
    `Seed concluido: ${submissionRows.length} submissions, ${roastRows.length} roasts, ${findingRows.length} findings, ${suggestedFixRows.length} suggested fixes.`,
  );
}

main()
  .catch((error) => {
    console.error("Erro ao executar seed manual:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
