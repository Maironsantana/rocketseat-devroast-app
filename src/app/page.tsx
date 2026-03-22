import { Suspense } from "react";

import { HomepageLeaderboardSection } from "@/app/_components/homepage-leaderboard-section";
import { HomepageLeaderboardSkeleton } from "@/app/_components/homepage-leaderboard-skeleton";
import { HomepageMetricsSection } from "@/app/_components/homepage-metrics-section";
import { HomepageMetricsSkeleton } from "@/app/_components/homepage-metrics-skeleton";
import { HomePageClient } from "@/app/home-page-client";

export default function Home() {
  return (
    <HomePageClient
      leaderboardSlot={
        <Suspense fallback={<HomepageLeaderboardSkeleton />}>
          <HomepageLeaderboardSection />
        </Suspense>
      }
      metricsSlot={
        <Suspense fallback={<HomepageMetricsSkeleton />}>
          <HomepageMetricsSection />
        </Suspense>
      }
    />
  );
}
