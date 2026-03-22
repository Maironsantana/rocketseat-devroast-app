import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { codeLanguageEnum, submissionStatusEnum } from "./enums";

export const submissions = pgTable(
  "submissions",
  {
    id: uuid().primaryKey().defaultRandom(),
    publicId: varchar({ length: 32 }).notNull(),
    sourceCode: text().notNull(),
    language: codeLanguageEnum().notNull(),
    roastMode: boolean().notNull().default(true),
    lineCount: integer().notNull(),
    charCount: integer().notNull(),
    status: submissionStatusEnum().notNull().default("pending"),
    sourceHash: varchar({ length: 64 }),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp({ withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdateFn(() => sql`now()`),
  },
  (table) => [unique("submissions_public_id_unique").on(table.publicId)],
);

export type Submission = typeof submissions.$inferSelect;
export type NewSubmission = typeof submissions.$inferInsert;
