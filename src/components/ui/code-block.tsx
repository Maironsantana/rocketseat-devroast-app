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
  fileName?: string;
  lang: BundledLanguage;
  showLineNumbers?: boolean;
};

export async function CodeBlock({
  chrome = true,
  code,
  fileName,
  lang,
  showLineNumbers = true,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  return (
    <PanelRoot padding="none" variant="terminal">
      {chrome || fileName ? (
        <PanelHeader>
          {chrome ? <PanelChrome /> : null}
          {fileName ? <PanelFileName>{fileName}</PanelFileName> : null}
        </PanelHeader>
      ) : null}
      <PanelContent padding="none">
        <div
          className={twMerge(
            "code-block-wrapper",
            showLineNumbers && "code-block-with-lines",
          )}
          // biome-ignore lint/security/noDangerouslySetInnerHtml: Shiki returns trusted server-rendered HTML for syntax highlighting.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </PanelContent>
    </PanelRoot>
  );
}
