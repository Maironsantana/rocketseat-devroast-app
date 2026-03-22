import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { findingSeverityEnum } from "./enums";
import { roasts } from "./roasts";

export const roastFindings = pgTable("roast_findings", {
  id: uuid().primaryKey().defaultRandom(),
  roastId: uuid()
    .notNull()
    .references(() => roasts.id, { onDelete: "cascade" }),
  severity: findingSeverityEnum().notNull(),
  title: varchar({ length: 160 }).notNull(),
  description: text().notNull(),
  sortOrder: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
});

export type RoastFinding = typeof roastFindings.$inferSelect;
export type NewRoastFinding = typeof roastFindings.$inferInsert;
