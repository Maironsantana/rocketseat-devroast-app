"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";
import { tv, type VariantProps } from "tailwind-variants";

export const panelRootVariants = tv({
  base: "overflow-hidden border border-border-subtle",
  variants: {
    variant: {
      default: "bg-canvas-base",
      terminal: "bg-surface-panel",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const panelHeaderVariants = tv({
  base: "flex items-center gap-3 border-b border-border-subtle px-4",
  variants: {
    variant: {
      default: "min-h-11 bg-canvas-base",
      terminal: "min-h-10 bg-surface-panel",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export const panelContentVariants = tv({
  variants: {
    padding: {
      none: "",
      md: "p-5",
      lg: "p-6",
    },
  },
  defaultVariants: {
    padding: "md",
  },
});

const chromeDotClasses = [
  "bg-accent-red",
  "bg-accent-amber",
  "bg-accent-green",
] as const;

type PanelContextValue = {
  padding?: VariantProps<typeof panelContentVariants>["padding"];
  variant?: VariantProps<typeof panelRootVariants>["variant"];
};

const PanelContext = React.createContext<PanelContextValue>({
  padding: "md",
  variant: "default",
});

function usePanelContext() {
  return React.useContext(PanelContext);
}

export type PanelRootProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof panelRootVariants> &
  VariantProps<typeof panelContentVariants>;

export const PanelRoot = React.forwardRef<HTMLDivElement, PanelRootProps>(
  ({ children, className, padding, variant, ...props }, ref) => {
    return (
      <PanelContext.Provider value={{ padding, variant }}>
        <div
          className={panelRootVariants({ className, variant })}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </PanelContext.Provider>
    );
  },
);

PanelRoot.displayName = "PanelRoot";

export type PanelHeaderProps = React.HTMLAttributes<HTMLDivElement>;

export const PanelHeader = React.forwardRef<HTMLDivElement, PanelHeaderProps>(
  ({ children, className, ...props }, ref) => {
    const { variant } = usePanelContext();

    return (
      <div
        className={panelHeaderVariants({ className, variant })}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

PanelHeader.displayName = "PanelHeader";

export type PanelChromeProps = React.HTMLAttributes<HTMLDivElement>;

export const PanelChrome = React.forwardRef<HTMLDivElement, PanelChromeProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={twMerge("flex items-center gap-3", className)}
        ref={ref}
        {...props}
      >
        {chromeDotClasses.map((dotClass) => (
          <span
            className={twMerge("h-2.5 w-2.5 rounded-full", dotClass)}
            key={dotClass}
          />
        ))}
      </div>
    );
  },
);

PanelChrome.displayName = "PanelChrome";

export type PanelFileNameProps = React.HTMLAttributes<HTMLSpanElement>;

export const PanelFileName = React.forwardRef<
  HTMLSpanElement,
  PanelFileNameProps
>(({ children, className, ...props }, ref) => {
  return (
    <span
      className={twMerge(
        "ml-auto font-mono text-[12px] text-foreground-muted",
        className,
      )}
      ref={ref}
      {...props}
    >
      {children}
    </span>
  );
});

PanelFileName.displayName = "PanelFileName";

export type PanelTitleProps = React.HTMLAttributes<HTMLDivElement>;

export const PanelTitle = React.forwardRef<HTMLDivElement, PanelTitleProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={twMerge(
          "font-mono text-[13px] text-foreground-inverse",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

PanelTitle.displayName = "PanelTitle";

export type PanelDescriptionProps = React.HTMLAttributes<HTMLDivElement>;

export const PanelDescription = React.forwardRef<
  HTMLDivElement,
  PanelDescriptionProps
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

PanelDescription.displayName = "PanelDescription";

export type PanelContentProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof panelContentVariants>;

export const PanelContent = React.forwardRef<HTMLDivElement, PanelContentProps>(
  ({ children, className, padding, ...props }, ref) => {
    const { padding: inheritedPadding } = usePanelContext();

    return (
      <div
        className={panelContentVariants({
          className,
          padding: padding ?? inheritedPadding,
        })}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

PanelContent.displayName = "PanelContent";

export type PanelFooterProps = React.HTMLAttributes<HTMLDivElement>;

export const PanelFooter = React.forwardRef<HTMLDivElement, PanelFooterProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div
        className={twMerge(
          "border-t border-border-subtle px-4 py-3",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  },
);

PanelFooter.displayName = "PanelFooter";
