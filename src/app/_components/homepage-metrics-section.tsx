import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";

import { HomepageMetrics } from "./homepage-metrics";

export async function HomepageMetricsSection() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(trpc.metrics.homepage.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomepageMetrics />
    </HydrationBoundary>
  );
}
