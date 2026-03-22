"use client";

import { useSuspenseQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";

import { AnimatedMetricValue } from "./animated-metric-value";

export function HomepageMetrics() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.metrics.homepage.queryOptions());

  return (
    <div className="font-mono flex items-center gap-6 text-xs text-foreground-muted">
      <span>
        <AnimatedMetricValue
          format={{ maximumFractionDigits: 0, useGrouping: true }}
          value={data.roastedCodes}
        />{" "}
        codes roasted
      </span>
      <span>&middot;</span>
      <span>
        avg score:{" "}
        <AnimatedMetricValue
          format={{
            maximumFractionDigits: 1,
            minimumFractionDigits: 1,
          }}
          value={data.averageScore}
        />
        /10
      </span>
    </div>
  );
}
