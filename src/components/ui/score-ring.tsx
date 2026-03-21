"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

export const scoreRingRootVariants = tv({
  base: "inline-flex flex-col items-center gap-4",
});

type ScoreRingContextValue = {
  circumference: number;
  clamped: number;
  gradientId: string;
  radius: number;
  safeMax: number;
  size: number;
  strokeWidth: number;
};

const ScoreRingContext = React.createContext<ScoreRingContextValue | null>(
  null,
);

function useScoreRingContext() {
  const context = React.useContext(ScoreRingContext);

  if (!context) {
    throw new Error(
      "ScoreRing compound components must be used within ScoreRingRoot.",
    );
  }

  return context;
}

export type ScoreRingRootProps = React.HTMLAttributes<HTMLDivElement> & {
  max: number;
  size?: number;
  value: number;
};

export const ScoreRingRoot = React.forwardRef<
  HTMLDivElement,
  ScoreRingRootProps
>(({ children, className, max, size = 180, value, ...props }, ref) => {
  const safeMax = max <= 0 ? 1 : max;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const strokeWidth = 4;
  const radius = size / 2 - strokeWidth;
  const circumference = 2 * Math.PI * radius;
  const gradientId = `score-ring-${size}-${safeMax}-${clamped}`;

  return (
    <ScoreRingContext.Provider
      value={{
        circumference,
        clamped,
        gradientId,
        radius,
        safeMax,
        size,
        strokeWidth,
      }}
    >
      <div
        className={scoreRingRootVariants({ className })}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    </ScoreRingContext.Provider>
  );
});

ScoreRingRoot.displayName = "ScoreRingRoot";

export type ScoreRingVisualProps = React.HTMLAttributes<HTMLDivElement>;

export const ScoreRingVisual = React.forwardRef<
  HTMLDivElement,
  ScoreRingVisualProps
>(({ children, className, ...props }, ref) => {
  const {
    circumference,
    clamped,
    gradientId,
    radius,
    safeMax,
    size,
    strokeWidth,
  } = useScoreRingContext();
  const dashOffset = circumference * (1 - clamped / safeMax);

  return (
    <div
      className={twMerge("relative", className)}
      ref={ref}
      style={{ height: size, width: size }}
      {...props}
    >
      <svg className="absolute inset-0 -rotate-90" height={size} width={size}>
        <title>{`${clamped}/${safeMax}`}</title>
        <defs>
          <linearGradient id={gradientId} x1="0%" x2="100%" y1="0%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-green)" />
            <stop offset="65%" stopColor="var(--color-accent-amber)" />
            <stop offset="100%" stopColor="var(--color-accent-red)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke="var(--color-border-subtle)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="transparent"
          r={radius}
          stroke={`url(#${gradientId})`}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          strokeWidth={strokeWidth}
        />
      </svg>

      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
});

ScoreRingVisual.displayName = "ScoreRingVisual";

export type ScoreRingValueProps = React.HTMLAttributes<HTMLDivElement>;

export const ScoreRingValue = React.forwardRef<
  HTMLDivElement,
  ScoreRingValueProps
>(({ className, ...props }, ref) => {
  const { clamped, safeMax } = useScoreRingContext();

  return (
    <div
      className={twMerge(
        "font-mono flex items-end gap-1 text-foreground-inverse",
        className,
      )}
      ref={ref}
      {...props}
    >
      <span className="text-5xl leading-none font-bold">{clamped}</span>
      <span className="pb-2 text-base leading-none text-foreground-muted">
        /{safeMax}
      </span>
    </div>
  );
});

ScoreRingValue.displayName = "ScoreRingValue";

export type ScoreRingLabelProps = React.HTMLAttributes<HTMLDivElement>;

export const ScoreRingLabel = React.forwardRef<
  HTMLDivElement,
  ScoreRingLabelProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={twMerge(
        "font-mono text-sm text-foreground-inverse",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

ScoreRingLabel.displayName = "ScoreRingLabel";

export type ScoreRingDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export const ScoreRingDescription = React.forwardRef<
  HTMLDivElement,
  ScoreRingDescriptionProps
>(({ children, className, ...props }, ref) => {
  return (
    <div
      className={twMerge("text-sm text-foreground-secondary", className)}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

ScoreRingDescription.displayName = "ScoreRingDescription";
