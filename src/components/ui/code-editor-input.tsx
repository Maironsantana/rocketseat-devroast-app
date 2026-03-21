"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

import {
  PanelChrome,
  PanelContent,
  PanelFileName,
  PanelHeader,
  PanelRoot,
} from "./panel";

export type CodeEditorInputProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "children"
> & {
  fileName?: string;
  minRows?: number;
};

export const CodeEditorInput = React.forwardRef<
  HTMLTextAreaElement,
  CodeEditorInputProps
>(
  (
    {
      className,
      defaultValue,
      fileName,
      minRows = 16,
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    const initialValue = React.useMemo(() => {
      if (typeof value === "string") return value;
      if (typeof defaultValue === "string") return defaultValue;
      return "";
    }, [defaultValue, value]);

    const [uncontrolledValue, setUncontrolledValue] =
      React.useState(initialValue);

    const resolvedValue = typeof value === "string" ? value : uncontrolledValue;

    const lineCount = Math.max(minRows, resolvedValue.split("\n").length);
    const lineNumbers = React.useMemo(
      () => Array.from({ length: lineCount }, (_, index) => index + 1),
      [lineCount],
    );

    return (
      <PanelRoot padding="none" variant="terminal">
        <PanelHeader>
          <PanelChrome />
          {fileName ? <PanelFileName>{fileName}</PanelFileName> : null}
        </PanelHeader>
        <PanelContent padding="none">
          <div className="flex min-h-[360px] w-full">
            <div className="flex w-12 shrink-0 flex-col items-end gap-2 border-r border-border-subtle bg-surface-subtle px-3 py-4">
              {lineNumbers.map((lineNumber) => (
                <span
                  className="font-mono text-xs leading-5 text-foreground-muted"
                  key={lineNumber}
                >
                  {lineNumber}
                </span>
              ))}
            </div>

            <textarea
              className={twMerge(
                "font-mono min-h-[360px] w-full resize-none bg-surface-panel px-4 py-4 text-xs leading-5 text-foreground-soft caret-accent-green outline-none placeholder:text-foreground-disabled",
                className,
              )}
              defaultValue={defaultValue}
              onChange={(event) => {
                if (typeof value !== "string") {
                  setUncontrolledValue(event.target.value);
                }

                onChange?.(event);
              }}
              ref={ref}
              spellCheck={false}
              value={value}
              {...props}
            />
          </div>
        </PanelContent>
      </PanelRoot>
    );
  },
);

CodeEditorInput.displayName = "CodeEditorInput";
