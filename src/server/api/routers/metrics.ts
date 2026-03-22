import { getHomepageMetrics } from "@/server/api/services/metrics-service";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const metricsRouter = createTRPCRouter({
  homepage: publicProcedure.query(async () => getHomepageMetrics()),
});
