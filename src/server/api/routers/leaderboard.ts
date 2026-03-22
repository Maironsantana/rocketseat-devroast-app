import {
  getHomepageLeaderboardPreview,
  getLeaderboardPageData,
} from "@/server/api/services/leaderboard-service";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const leaderboardRouter = createTRPCRouter({
  homepagePreview: publicProcedure.query(async () =>
    getHomepageLeaderboardPreview(),
  ),
  page: publicProcedure.query(async () => getLeaderboardPageData()),
});
