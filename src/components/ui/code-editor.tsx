"use client";

import * as React from "react";
import { twMerge } from "tailwind-merge";

import { CODE_EDITOR_MAX_CHARACTERS } from "@/lib/code-editor/constants";
import type { CodeLanguageId } from "@/lib/code-editor/languages";
import { CodeEditorHighlight } from "./code-editor-highlight";
import {
  PanelChrome,
  PanelContent,
  PanelFileName,
  PanelFooter,
  PanelHeader,
  PanelRoot,
} from "./panel";

export type CodeEditorProps = {
  fileName?: string;
  language: CodeLanguageId;
  maxHeightClassName?: string;
  minRows?: number;
  onHighlightingChange?: (isHighlighting: boolean) => void;
  onValueChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export const CodeEditor = React.forwardRef<
  HTMLTextAreaElement,
  CodeEditorProps
>(
  (
    {
      fileName = "pasted.txt",
      language,
      maxHeightClassName = "h-[min(70vh,32rem)]",
      minRows = 16,
      onHighlightingChange,
      onValueChange,
      placeholder,
      value,
    },
    ref,
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const overlayRef = React.useRef<HTMLDivElement | null>(null);
    const lineNumbersRef = React.useRef<HTMLDivElement | null>(null);
    const hasExceededLimit = value.length > CODE_EDITOR_MAX_CHARACTERS;
    const lineCount = Math.max(minRows, value.split("\n").length);
    const lineNumbers = React.useMemo(
      () => Array.from({ length: lineCount }, (_, index) => index + 1),
      [lineCount],
    );

    React.useImperativeHandle(
      ref,
      () => textareaRef.current as HTMLTextAreaElement,
    );

    const syncScroll = React.useCallback(() => {
      const textarea = textareaRef.current;

      if (!textarea) {
        return;
      }

      if (overlayRef.current) {
        overlayRef.current.scrollLeft = textarea.scrollLeft;
        overlayRef.current.scrollTop = textarea.scrollTop;
      }

      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = textarea.scrollTop;
      }
    }, []);

    return (
      <PanelRoot
        className="shadow-[0_24px_80px_rgba(0,0,0,0.28)] transition-shadow duration-200 focus-within:shadow-[0_28px_90px_rgba(0,0,0,0.38)]"
        padding="none"
        variant="terminal"
      >
        <PanelHeader>
          <PanelChrome />
          <PanelFileName>{fileName}</PanelFileName>
        </PanelHeader>

        <PanelContent padding="none">
          <div
            className={twMerge(
              "flex min-h-[360px] w-full border-b border-border-subtle bg-[linear-gradient(180deg,rgba(255,255,255,0.02),transparent_18%)]",
              maxHeightClassName,
            )}
          >
            <div
              className="flex h-full w-14 shrink-0 flex-col items-end gap-0 overflow-hidden border-r border-border-subtle bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(15,15,15,0.95))] px-3 py-4"
              ref={lineNumbersRef}
            >
              {lineNumbers.map((lineNumber) => (
                <span
                  className="font-mono h-5 text-xs leading-5 text-foreground-muted"
                  key={lineNumber}
                >
                  {lineNumber}
                </span>
              ))}
            </div>

            <div className="relative h-full min-h-[360px] flex-1 overflow-hidden bg-surface-panel">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-border-subtle/70" />
              <div
                className="pointer-events-none absolute inset-0 overflow-auto"
                ref={overlayRef}
              >
                <CodeEditorHighlight
                  code={value}
                  language={language}
                  onHighlightingChange={onHighlightingChange}
                  placeholder={placeholder}
                />
              </div>

              <textarea
                autoCapitalize="off"
                autoComplete="off"
                autoCorrect="off"
                className={twMerge(
                  "font-mono absolute inset-0 h-full min-h-[360px] w-full resize-none overflow-auto bg-transparent px-4 py-4 text-[12px] leading-[20px] tracking-normal text-transparent [font-variant-ligatures:none] [tab-size:2] caret-accent-green outline-none",
                  "selection:bg-accent-green/18 selection:text-transparent placeholder:text-transparent",
                )}
                onChange={(event) => onValueChange(event.target.value)}
                onScroll={syncScroll}
                placeholder={placeholder}
                ref={(node) => {
                  textareaRef.current = node;

                  if (typeof ref === "function") {
                    ref(node);
                    return;
                  }

                  if (ref) {
                    ref.current = node;
                  }
                }}
                spellCheck={false}
                value={value}
                wrap="off"
              />
            </div>
          </div>
        </PanelContent>

        <PanelFooter className="flex items-center justify-between gap-4 bg-[linear-gradient(180deg,rgba(17,17,17,0.95),rgba(10,10,10,0.98))] py-2.5">
          <p
            className={twMerge(
              "font-mono text-[11px] text-foreground-muted transition-colors duration-150",
              hasExceededLimit && "text-accent-red",
            )}
          >
            {hasExceededLimit
              ? `syntax highlight disabled above ${CODE_EDITOR_MAX_CHARACTERS} chars`
              : "auto-detect enabled for supported languages"}
          </p>

          <span
            className={twMerge(
              "font-mono rounded border border-border-subtle px-2 py-1 text-[11px] text-foreground-muted transition-colors duration-150",
              hasExceededLimit && "text-accent-red",
            )}
          >
            {value.length} / {CODE_EDITOR_MAX_CHARACTERS}
          </span>
        </PanelFooter>
      </PanelRoot>
    );
  },
);

CodeEditor.displayName = "CodeEditor";
