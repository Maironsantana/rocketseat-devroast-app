import type { BundledLanguage } from "shiki";

export function getCodeBlockLanguage(language: string): BundledLanguage {
  switch (language) {
    case "javascript":
    case "typescript":
    case "sql":
    case "python":
    case "java":
    case "csharp":
    case "go":
    case "rust":
    case "php":
      return language;
    default:
      return "text" as BundledLanguage;
  }
}
