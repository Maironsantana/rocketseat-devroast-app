import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import go from "highlight.js/lib/languages/go";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import php from "highlight.js/lib/languages/php";
import plaintext from "highlight.js/lib/languages/plaintext";
import python from "highlight.js/lib/languages/python";
import ruby from "highlight.js/lib/languages/ruby";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

import {
  CODE_EDITOR_DETECT_MIN_CHARACTERS,
  CODE_EDITOR_MAX_CHARACTERS,
} from "./constants";
import { type CodeLanguageId, codeLanguageOptions } from "./languages";

let hasRegisteredLanguages = false;

function registerDetectionLanguages() {
  if (hasRegisteredLanguages) {
    return;
  }

  hljs.registerLanguage("bash", bash);
  hljs.registerLanguage("css", css);
  hljs.registerLanguage("dockerfile", dockerfile);
  hljs.registerLanguage("go", go);
  hljs.registerLanguage("java", java);
  hljs.registerLanguage("javascript", javascript);
  hljs.registerLanguage("json", json);
  hljs.registerLanguage("markdown", markdown);
  hljs.registerLanguage("php", php);
  hljs.registerLanguage("plaintext", plaintext);
  hljs.registerLanguage("python", python);
  hljs.registerLanguage("ruby", ruby);
  hljs.registerLanguage("rust", rust);
  hljs.registerLanguage("sql", sql);
  hljs.registerLanguage("typescript", typescript);
  hljs.registerLanguage("xml", xml);
  hljs.registerLanguage("yaml", yaml);

  hasRegisteredLanguages = true;
}

const detectionSubset = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "json",
  "xml",
  "css",
  "bash",
  "sql",
  "python",
  "java",
  "go",
  "php",
  "ruby",
  "rust",
  "yaml",
  "markdown",
  "dockerfile",
] as const;

function hasJsxMarkup(code: string) {
  return /<([A-Z][\w]*|[a-z][\w-]*)(\s[^>]*)?>/.test(code);
}

function isLikelyTsx(code: string) {
  return (
    hasJsxMarkup(code) &&
    /(interface\s+\w+|type\s+\w+\s*=|:\s*[A-Z][\w<>{}, |[\]]*|as\s+const|satisfies\s+)/.test(
      code,
    )
  );
}

function isLikelyJsx(code: string) {
  return (
    hasJsxMarkup(code) &&
    /(return\s*\(|React\.|useState\(|useEffect\(|className=|onClick=)/.test(
      code,
    )
  );
}

function detectJsxFamily(code: string, detected: CodeLanguageId) {
  if (!hasJsxMarkup(code)) {
    return detected;
  }

  if (detected === "typescript") {
    return "tsx";
  }

  if (detected === "javascript" || detected === "html") {
    if (/interface\s+\w+|type\s+\w+\s*=|:\s*[A-Z][\w<>, ]*/.test(code)) {
      return "tsx";
    }

    return "jsx";
  }

  return detected;
}

function mapDetectedLanguage(language: string | undefined): CodeLanguageId {
  if (!language) {
    return "plaintext";
  }

  const match = codeLanguageOptions.find((option) =>
    option.detectAliases.includes(language),
  );

  return match?.id ?? "plaintext";
}

export function detectCodeLanguage(code: string): CodeLanguageId {
  registerDetectionLanguages();

  const trimmedCode = code.trim();

  if (
    trimmedCode.length < CODE_EDITOR_DETECT_MIN_CHARACTERS ||
    code.length > CODE_EDITOR_MAX_CHARACTERS
  ) {
    return "plaintext";
  }

  if (isLikelyTsx(code)) {
    return "tsx";
  }

  if (isLikelyJsx(code)) {
    return "jsx";
  }

  const result = hljs.highlightAuto(code, [...detectionSubset]);
  const secondBestRelevance = result.secondBest?.relevance ?? 0;

  if (result.relevance < 2 || result.relevance - secondBestRelevance < 1) {
    return "plaintext";
  }

  return detectJsxFamily(code, mapDetectedLanguage(result.language));
}
