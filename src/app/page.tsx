import { Suspense } from "react";

import { HomepageMetricsSection } from "@/app/_components/homepage-metrics-section";
import { HomepageMetricsSkeleton } from "@/app/_components/homepage-metrics-skeleton";
import { HomePageClient } from "@/app/home-page-client";

export default function Home() {
  return (
    <HomePageClient
      metricsSlot={
        <Suspense fallback={<HomepageMetricsSkeleton />}>
          <HomepageMetricsSection />
        </Suspense>
      }
    />
  );
}
