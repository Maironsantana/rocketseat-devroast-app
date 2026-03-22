import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { TRPCReactProvider } from "@/trpc/client";
import { getQueryClient, trpc } from "@/trpc/server";

import { HomepageLeaderboard } from "./homepage-leaderboard";

export async function HomepageLeaderboardSection() {
  const queryClient = getQueryClient();

  const preview = await queryClient.fetchQuery(
    trpc.leaderboard.homepagePreview.queryOptions(),
  );

  return (
    <TRPCReactProvider>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HomepageLeaderboard preview={preview} />
      </HydrationBoundary>
    </TRPCReactProvider>
  );
}
