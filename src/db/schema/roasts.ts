import { sql } from "drizzle-orm";
import {
  check,
  integer,
  jsonb,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { roastVerdictEnum } from "./enums";
import { submissions } from "./submissions";

export const roasts = pgTable(
  "roasts",
  {
    id: uuid().primaryKey().defaultRandom(),
    submissionId: uuid()
      .notNull()
      .references(() => submissions.id, { onDelete: "cascade" }),
    score: numeric({ precision: 3, scale: 1 }).notNull(),
    verdict: roastVerdictEnum().notNull(),
    headline: text().notNull(),
    summary: text(),
    providerKey: varchar({ length: 64 }).notNull(),
    model: varchar({ length: 128 }),
    providerRequestId: varchar({ length: 191 }),
    providerMetadata: jsonb().$type<Record<string, unknown>>(),
    tokensUsed: integer(),
    completedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("roasts_submission_id_unique").on(table.submissionId),
    check(
      "roasts_score_range_check",
      sql`${table.score} >= 0.0 and ${table.score} <= 10.0`,
    ),
  ],
);

export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
