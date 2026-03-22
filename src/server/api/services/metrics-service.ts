import { count, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { roasts, submissions } from "@/db/schema";

export type HomepageMetrics = {
  averageScore: number;
  roastedCodes: number;
};

export async function getHomepageMetrics(): Promise<HomepageMetrics> {
  try {
    const [metrics] = await db
      .select({
        averageScore: sql<string>`coalesce(round(avg(${roasts.score})::numeric, 1), 0)`,
        roastedCodes: count(submissions.id),
      })
      .from(submissions)
      .leftJoin(roasts, eq(roasts.submissionId, submissions.id))
      .where(eq(submissions.status, "completed"));

    return {
      averageScore: Number(metrics?.averageScore ?? 0),
      roastedCodes: metrics?.roastedCodes ?? 0,
    };
  } catch {
    return {
      averageScore: 0,
      roastedCodes: 0,
    };
  }
}
