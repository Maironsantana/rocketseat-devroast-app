import { and, asc, count, desc, eq, isNotNull, sql } from "drizzle-orm";

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

export type LeaderboardPageEntry = {
  id: string;
  language: string;
  lines: number;
  rank: number;
  roast: string;
  score: number;
  sourceCode: string;
};

export type LeaderboardPageData = {
  entries: LeaderboardPageEntry[];
  stats: {
    averageScore: number;
    totalEntries: number;
  };
};

const LEADERBOARD_PAGE_LIMIT = 20;

const leaderboardEligibility = and(
  eq(submissions.status, "completed"),
  isNotNull(roasts.score),
  isNotNull(roasts.headline),
);

export async function getLeaderboardPageData(): Promise<LeaderboardPageData> {
  try {
    const [entries, stats] = await Promise.all([
      db
        .select({
          headline: roasts.headline,
          id: submissions.id,
          language: submissions.language,
          score: roasts.score,
          sourceCode: submissions.sourceCode,
        })
        .from(roasts)
        .innerJoin(submissions, eq(submissions.id, roasts.submissionId))
        .where(leaderboardEligibility)
        .orderBy(asc(roasts.score), desc(submissions.createdAt))
        .limit(LEADERBOARD_PAGE_LIMIT),
      db
        .select({
          averageScore: sql<string>`coalesce(round(avg(${roasts.score})::numeric, 1), 0)`,
          totalEntries: count(roasts.id),
        })
        .from(roasts)
        .innerJoin(submissions, eq(submissions.id, roasts.submissionId))
        .where(leaderboardEligibility),
    ]);

    return {
      entries: entries.map((entry, index) => ({
        id: entry.id,
        language: entry.language,
        lines: entry.sourceCode.split("\n").length,
        rank: index + 1,
        roast: entry.headline,
        score: Number(entry.score),
        sourceCode: entry.sourceCode,
      })),
      stats: {
        averageScore: Number(stats[0]?.averageScore ?? 0),
        totalEntries: stats[0]?.totalEntries ?? 0,
      },
    };
  } catch (error) {
    console.error("Failed to load leaderboard page data", error);

    return {
      entries: [],
      stats: {
        averageScore: 0,
        totalEntries: 0,
      },
    };
  }
}

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
  } catch (error) {
    console.error("Failed to load homepage leaderboard preview", error);

    return {
      entries: [],
      totalRoasts: 0,
    };
  }
}
