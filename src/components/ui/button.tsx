import * as React from "react";
import { tv, type VariantProps } from "tailwind-variants";

export const buttonVariants = tv({
  base: [
    "font-mono inline-flex cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-none border border-transparent",
    "text-[13px] font-medium transition-colors duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    variant: {
      primary: "bg-accent-green text-canvas-base hover:bg-accent-green-hover",
      secondary:
        "border-border-subtle bg-transparent text-foreground-inverse hover:border-foreground-muted hover:bg-surface-subtle hover:text-foreground-inverse",
      link: "border-border-subtle bg-transparent text-foreground-secondary hover:border-foreground-muted hover:bg-surface-subtle hover:text-foreground-inverse",
    },
    size: {
      sm: "px-3 py-1.5 text-xs",
      md: "px-6 py-2.5",
      lg: "px-7 py-3 text-sm",
    },
    fullWidth: {
      true: "w-full",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
    fullWidth: false,
  },
  compoundVariants: [
    {
      className: "px-4 py-2 text-[12px]",
      size: "sm",
      variant: "secondary",
    },
    {
      className: "px-3 py-1.5 text-[12px]",
      size: "md",
      variant: "link",
    },
  ],
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, fullWidth, size, type = "button", variant, ...props }, ref) => {
    return (
      <button
        className={buttonVariants({ className, fullWidth, size, variant })}
        ref={ref}
        type={type}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
