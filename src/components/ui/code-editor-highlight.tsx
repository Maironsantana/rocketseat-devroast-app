"use client";

import * as React from "react";

import {
  type CodeLanguageId,
  codeLanguageOptionsById,
} from "@/lib/code-editor/languages";
import {
  codeEditorTheme,
  ensureCodeEditorLanguage,
} from "@/lib/code-editor/shiki-client";

export type CodeEditorHighlightProps = {
  code: string;
  language: CodeLanguageId;
  onHighlightingChange?: (isHighlighting: boolean) => void;
  placeholder?: string;
};

function escapeHtml(code: string) {
  return code
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function renderPlainTextHtml(code: string) {
  const lines = code.split("\n");

  return [
    '<pre class="shiki shiki-editor-plain" style="background-color:transparent">',
    "<code>",
    ...lines.map(
      (line) => `<span class="line">${escapeHtml(line) || " "}</span>`,
    ),
    "</code>",
    "</pre>",
  ].join("");
}

function normalizeShikiHtml(html: string) {
  return html.replace(
    /background-color:[^;"]+;?/g,
    "background-color:transparent;",
  );
}

export function CodeEditorHighlight({
  code,
  language,
  onHighlightingChange,
  placeholder,
}: CodeEditorHighlightProps) {
  const [html, setHtml] = React.useState<string>("");

  React.useEffect(() => {
    let isActive = true;

    if (!code) {
      setHtml("");
      onHighlightingChange?.(false);
      return () => {
        isActive = false;
      };
    }

    if (language === "plaintext") {
      setHtml(renderPlainTextHtml(code));
      onHighlightingChange?.(false);
      return () => {
        isActive = false;
      };
    }

    onHighlightingChange?.(true);

    void ensureCodeEditorLanguage(language)
      .then((highlighter) => {
        const shikiLanguage = codeLanguageOptionsById[language].shiki;

        if (!shikiLanguage) {
          return renderPlainTextHtml(code);
        }

        return highlighter.codeToHtml(code, {
          lang: shikiLanguage,
          theme: codeEditorTheme,
        });
      })
      .then((nextHtml) => {
        if (!isActive) {
          return;
        }

        setHtml(normalizeShikiHtml(nextHtml));
        onHighlightingChange?.(false);
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setHtml(renderPlainTextHtml(code));
        onHighlightingChange?.(false);
      });

    return () => {
      isActive = false;
    };
  }, [code, language, onHighlightingChange]);

  if (!code) {
    return (
      <pre className="font-mono px-4 py-4 text-[12px] leading-[20px] tracking-normal text-foreground-disabled [font-variant-ligatures:none] [tab-size:2]">
        {placeholder}
      </pre>
    );
  }

  return (
    <div
      className="code-editor-highlight"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki returns trusted HTML and plaintext fallback is escaped.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
