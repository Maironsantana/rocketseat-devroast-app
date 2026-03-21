import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const badgeVariants = tv({
  base: "font-mono inline-flex items-center gap-2 text-[12px] leading-none",
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      default: "text-foreground-secondary",
    },
    size: {
      sm: "text-[12px]",
      md: "text-[13px]",
    },
  },
  defaultVariants: {
    size: "sm",
    variant: "default",
  },
});

export const badgeDotVariants = tv({
  base: "h-2 w-2 shrink-0 rounded-full",
  variants: {
    variant: {
      critical: "bg-accent-red",
      warning: "bg-accent-amber",
      good: "bg-accent-green",
      default: "bg-foreground-secondary",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants> & {
    dot?: boolean;
  };

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, className, dot = true, size, variant, ...props }, ref) => {
    return (
      <span
        className={badgeVariants({ className, size, variant })}
        ref={ref}
        {...props}
      >
        {dot ? <span className={badgeDotVariants({ variant })} /> : null}
        <span>{children}</span>
      </span>
    );
  },
);

Badge.displayName = "Badge";
