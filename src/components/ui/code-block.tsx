import { type BundledLanguage, codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

import {
  PanelChrome,
  PanelContent,
  PanelFileName,
  PanelHeader,
  PanelRoot,
} from "./panel";

export type CodeBlockProps = {
  chrome?: boolean;
  code: string;
  className?: string;
  fileName?: string;
  lang: BundledLanguage;
  showLineNumbers?: boolean;
  variant?: "default" | "inline";
};

export async function CodeBlock({
  chrome = true,
  className,
  code,
  fileName,
  lang,
  showLineNumbers = true,
  variant = "default",
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  const content = (
    <div
      className={twMerge(
        "code-block-wrapper overflow-x-auto",
        showLineNumbers && "code-block-with-lines",
        className,
      )}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki returns trusted server-rendered HTML for syntax highlighting.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );

  if (variant === "inline") {
    return content;
  }

  return (
    <PanelRoot padding="none" variant="terminal">
      {chrome || fileName ? (
        <PanelHeader>
          {chrome ? <PanelChrome /> : null}
          {fileName ? <PanelFileName>{fileName}</PanelFileName> : null}
        </PanelHeader>
      ) : null}
      <PanelContent padding="none">{content}</PanelContent>
    </PanelRoot>
  );
}
