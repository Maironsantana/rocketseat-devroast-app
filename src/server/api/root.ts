import { leaderboardRouter } from "@/server/api/routers/leaderboard";
import { metricsRouter } from "@/server/api/routers/metrics";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  leaderboard: leaderboardRouter,
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
