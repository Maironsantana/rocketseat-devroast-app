"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

import { Badge } from "./badge";

export type DetectedLanguageBadgeProps =
  React.HTMLAttributes<HTMLSpanElement> & {
    isDetecting?: boolean;
    label: string;
  };

export const DetectedLanguageBadge = React.forwardRef<
  HTMLSpanElement,
  DetectedLanguageBadgeProps
>(({ className, isDetecting = false, label, ...props }, ref) => {
  return (
    <Badge
      className={twMerge("min-h-5", className)}
      dot={!isDetecting}
      ref={ref}
      variant={label === "Plain text" ? "warning" : "default"}
      {...props}
    >
      {isDetecting ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-accent-amber" />
          <span>{label}</span>
        </span>
      ) : (
        label
      )}
    </Badge>
  );
});

DetectedLanguageBadge.displayName = "DetectedLanguageBadge";
