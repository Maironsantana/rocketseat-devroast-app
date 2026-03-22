import { asc, count, desc, eq } from "drizzle-orm";

import { db } from "@/db/client";
import { roasts, submissions } from "@/db/schema";

export type HomepageLeaderboardEntry = {
  language: string;
  score: number;
  sourceCode: string;
};

export type HomepageLeaderboardPreview = {
  entries: HomepageLeaderboardEntry[];
  totalRoasts: number;
};

export async function getHomepageLeaderboardPreview(): Promise<HomepageLeaderboardPreview> {
  try {
    const [entries, totalRows] = await Promise.all([
      db
        .select({
          language: submissions.language,
          score: roasts.score,
          sourceCode: submissions.sourceCode,
        })
        .from(roasts)
        .innerJoin(submissions, eq(submissions.id, roasts.submissionId))
        .where(eq(submissions.status, "completed"))
        .orderBy(asc(roasts.score), desc(submissions.createdAt))
        .limit(3),
      db
        .select({
          totalRoasts: count(roasts.id),
        })
        .from(roasts)
        .innerJoin(submissions, eq(submissions.id, roasts.submissionId))
        .where(eq(submissions.status, "completed")),
    ]);

    return {
      entries: entries.map((entry) => ({
        language: entry.language,
        score: Number(entry.score),
        sourceCode: entry.sourceCode,
      })),
      totalRoasts: totalRows[0]?.totalRoasts ?? 0,
    };
  } catch {
    return {
      entries: [],
      totalRoasts: 0,
    };
  }
}
