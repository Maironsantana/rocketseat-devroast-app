"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import * as React from "react";
import { twMerge } from "tailwind-merge";

import { buttonVariants } from "@/components/ui";

type HomepageLeaderboardCodePreviewProps = {
  children: React.ReactNode;
  isExpandable: boolean;
  preview: React.ReactNode;
};

function ChevronIcon({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 10 10"
      {...props}
    >
      <path d="M3.5 9L7.5 5L3.5 1" stroke="currentColor" />
    </svg>
  );
}

export function HomepageLeaderboardCodePreview({
  children,
  isExpandable,
  preview,
}: HomepageLeaderboardCodePreviewProps) {
  const [open, setOpen] = React.useState(false);

  if (!isExpandable) {
    return <div className="min-w-0">{children}</div>;
  }

  return (
    <Collapsible.Root className="min-w-0" onOpenChange={setOpen} open={open}>
      {open ? (
        <Collapsible.Panel className="h-[var(--collapsible-panel-height)] overflow-hidden transition-[height] duration-150 ease-out data-[ending-style]:h-0 data-[starting-style]:h-0 [&[hidden]:not([hidden='until-found'])]:hidden">
          {children}
        </Collapsible.Panel>
      ) : (
        <div className="relative overflow-hidden">
          {preview}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-canvas-base via-canvas-base/85 to-transparent" />
        </div>
      )}

      <Collapsible.Trigger
        className={buttonVariants({
          className:
            "group mt-3 rounded-sm px-2.5 py-1.5 text-[11px] uppercase tracking-[0.08em]",
          size: "sm",
          variant: "secondary",
        })}
      >
        <ChevronIcon
          className={twMerge(
            "size-3 transition-transform duration-150 ease-out",
            open && "rotate-90",
          )}
        />
        <span>{open ? "show less" : "show more"}</span>
      </Collapsible.Trigger>
    </Collapsible.Root>
  );
}
