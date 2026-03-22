import {
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { roasts } from "./roasts";

export const roastSuggestedFixes = pgTable(
  "roast_suggested_fixes",
  {
    id: uuid().primaryKey().defaultRandom(),
    roastId: uuid()
      .notNull()
      .references(() => roasts.id, { onDelete: "cascade" }),
    originalFileName: varchar({ length: 120 }),
    suggestedFileName: varchar({ length: 120 }),
    diffText: text().notNull(),
    createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    unique("roast_suggested_fixes_roast_id_unique").on(table.roastId),
  ],
);

export type RoastSuggestedFix = typeof roastSuggestedFixes.$inferSelect;
export type NewRoastSuggestedFix = typeof roastSuggestedFixes.$inferInsert;
