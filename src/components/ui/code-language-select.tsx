"use client";

import { Select } from "@base-ui/react/select";
import * as React from "react";
import { tv } from "tailwind-variants";

import {
  type CodeLanguageId,
  codeLanguageSelectOptions,
} from "@/lib/code-editor/languages";

export const codeLanguageSelectLabelVariants = tv({
  base: "font-mono text-[11px] uppercase tracking-[0.18em] text-foreground-muted",
});

export const codeLanguageSelectTriggerVariants = tv({
  base: [
    "font-mono flex h-10 min-w-40 items-center justify-between gap-3 border border-border-subtle bg-canvas-base px-3 text-[12px] text-foreground-inverse transition-colors duration-200 select-none",
    "hover:border-foreground-muted hover:bg-surface-subtle",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-base",
    "data-[popup-open]:border-foreground-muted data-[popup-open]:bg-surface-subtle",
  ],
});

export const codeLanguageSelectIconVariants = tv({
  base: "text-foreground-muted transition-transform duration-200 data-[popup-open]:rotate-180",
});

export const codeLanguageSelectPopupVariants = tv({
  base: [
    "z-50 min-w-[var(--anchor-width)] overflow-hidden border border-border-subtle bg-surface-panel shadow-[0_18px_60px_rgba(0,0,0,0.45)] outline-none",
    "origin-[var(--transform-origin)] transition-[transform,opacity] duration-150 data-[starting-style]:scale-95 data-[starting-style]:opacity-0 data-[ending-style]:scale-95 data-[ending-style]:opacity-0",
  ],
});

export const codeLanguageSelectListVariants = tv({
  base: "max-h-72 overflow-y-auto p-1",
});

export const codeLanguageSelectItemVariants = tv({
  base: [
    "font-mono grid cursor-default grid-cols-[12px_1fr] items-center gap-3 px-3 py-2 text-[12px] text-foreground-secondary outline-none transition-colors duration-150 select-none",
    "data-[highlighted]:bg-surface-subtle data-[highlighted]:text-foreground-inverse",
    "data-[selected]:text-accent-green",
  ],
});

type CodeLanguageSelectItem = {
  label: string;
  value: CodeLanguageId | "auto";
};

const autoItem: CodeLanguageSelectItem = {
  label: "Auto",
  value: "auto",
};

const items: CodeLanguageSelectItem[] = [
  autoItem,
  ...codeLanguageSelectOptions.map((language) => ({
    label: language.label,
    value: language.id,
  })),
];

function ChevronDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
      {...props}
    >
      <path
        d="M2.25 4.5 6 8.25 9.75 4.5"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="10"
      viewBox="0 0 10 10"
      width="10"
      {...props}
    >
      <path
        d="M1.5 5.25 3.75 7.5 8.5 2.75"
        stroke="currentColor"
        strokeLinecap="square"
        strokeWidth="1.25"
      />
    </svg>
  );
}

export type CodeLanguageSelectProps = React.HTMLAttributes<HTMLDivElement> & {
  onValueChange: (value: CodeLanguageId | null) => void;
  value: CodeLanguageId | null;
};

export const CodeLanguageSelect = React.forwardRef<
  HTMLButtonElement,
  CodeLanguageSelectProps
>(({ className, onValueChange, value, ...props }, ref) => {
  const selectedValue = value ?? "auto";

  return (
    <div className={className} {...props}>
      <div className="flex flex-col gap-1">
        <span className={codeLanguageSelectLabelVariants()}>language</span>

        <Select.Root
          items={items}
          onValueChange={(nextValue) =>
            onValueChange(
              nextValue === "auto"
                ? null
                : ((nextValue as CodeLanguageId | null) ?? null),
            )
          }
          value={selectedValue}
        >
          <Select.Trigger
            className={codeLanguageSelectTriggerVariants()}
            ref={ref}
          >
            <Select.Value />

            <Select.Icon className={codeLanguageSelectIconVariants()}>
              <ChevronDownIcon />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Positioner className="z-50 outline-none" sideOffset={8}>
              <Select.Popup className={codeLanguageSelectPopupVariants()}>
                <Select.List className={codeLanguageSelectListVariants()}>
                  {items.map((item) => (
                    <Select.Item
                      className={codeLanguageSelectItemVariants()}
                      key={item.value}
                      value={item.value}
                    >
                      <Select.ItemIndicator className="flex items-center justify-center text-accent-green">
                        <CheckIcon />
                      </Select.ItemIndicator>
                      <Select.ItemText>{item.label}</Select.ItemText>
                    </Select.Item>
                  ))}
                </Select.List>
              </Select.Popup>
            </Select.Positioner>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  );
});

CodeLanguageSelect.displayName = "CodeLanguageSelect";
