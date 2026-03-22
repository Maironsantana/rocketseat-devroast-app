import { metricsRouter } from "@/server/api/routers/metrics";
import { createTRPCRouter } from "@/server/api/trpc";

export const appRouter = createTRPCRouter({
  metrics: metricsRouter,
});

export type AppRouter = typeof appRouter;
