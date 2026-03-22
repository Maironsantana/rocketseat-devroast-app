"use client";

import NumberFlow from "@number-flow/react";
import * as React from "react";

type AnimatedMetricValueProps = {
  format?: React.ComponentProps<typeof NumberFlow>["format"];
  value: number;
};

export function AnimatedMetricValue({
  format,
  value,
}: AnimatedMetricValueProps) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      setDisplayValue(value);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [value]);

  return (
    <NumberFlow
      className="tabular-nums"
      format={format}
      value={displayValue}
      willChange
    />
  );
}
