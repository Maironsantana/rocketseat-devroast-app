import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const diffLineVariants = tv({
  base: "font-mono flex w-full items-center gap-2 px-4 py-2 text-[13px]",
  variants: {
    variant: {
      added: "bg-surface-diff-added text-foreground-inverse",
      context: "text-foreground-muted",
      removed: "bg-surface-diff-removed text-foreground-muted",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

export const diffPrefixVariants = tv({
  base: "w-3 shrink-0",
  variants: {
    variant: {
      added: "text-accent-green",
      context: "text-foreground-secondary",
      removed: "text-accent-red",
    },
  },
  defaultVariants: {
    variant: "context",
  },
});

export type DiffLineProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof diffLineVariants> & {
    prefix?: React.ReactNode;
  };

export const DiffLine = React.forwardRef<HTMLDivElement, DiffLineProps>(
  ({ children, className, prefix, variant, ...props }, ref) => {
    const resolvedPrefix =
      prefix ?? (variant === "added" ? "+" : variant === "removed" ? "-" : " ");

    return (
      <div
        className={diffLineVariants({ className, variant })}
        ref={ref}
        {...props}
      >
        <span className={diffPrefixVariants({ variant })}>
          {resolvedPrefix}
        </span>
        <span className="min-w-0">{children}</span>
      </div>
    );
  },
);

DiffLine.displayName = "DiffLine";
