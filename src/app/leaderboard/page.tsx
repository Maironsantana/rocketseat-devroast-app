import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { cache, Suspense } from "react";

import { LeaderboardPageContent } from "@/app/leaderboard/_components/leaderboard-page-content";
import { LeaderboardPageShell } from "@/app/leaderboard/_components/leaderboard-page-shell";
import { LeaderboardPageSkeleton } from "@/app/leaderboard/_components/leaderboard-page-skeleton";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { TRPCReactProvider } from "@/trpc/client";
import { makeQueryClient } from "@/trpc/query-client";

const getLeaderboardPageQueryClient = cache(makeQueryClient);

const leaderboardPageTrpc = createTRPCOptionsProxy({
  ctx: async () => createTRPCContext({ headers: new Headers() }),
  queryClient: getLeaderboardPageQueryClient,
  router: appRouter,
});

export const metadata: Metadata = {
  title: "Shame Leaderboard | DevRoast",
  description:
    "Browse the most roasted code submissions on DevRoast with a server-rendered leaderboard built for indexing.",
};

async function getCachedLeaderboardQueryState() {
  "use cache";

  cacheLife({ stale: 300, revalidate: 300 });

  const queryClient = getLeaderboardPageQueryClient();
  const queryOptions = leaderboardPageTrpc.leaderboard.page.queryOptions();
  const data = await queryClient.fetchQuery(queryOptions);

  return {
    data,
    dehydratedState: dehydrate(queryClient),
  };
}

async function LeaderboardPageSection() {
  const { data, dehydratedState } = await getCachedLeaderboardQueryState();

  return (
    <TRPCReactProvider>
      <HydrationBoundary state={dehydratedState}>
        <LeaderboardPageContent data={data} />
      </HydrationBoundary>
    </TRPCReactProvider>
  );
}

export default function LeaderboardPage() {
  return (
    <LeaderboardPageShell>
      <Suspense fallback={<LeaderboardPageSkeleton />}>
        <LeaderboardPageSection />
      </Suspense>
    </LeaderboardPageShell>
  );
}
