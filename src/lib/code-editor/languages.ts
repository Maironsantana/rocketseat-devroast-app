import type { BundledLanguage } from "shiki";

export const codeLanguageIds = [
  "plaintext",
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "json",
  "html",
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

export type CodeLanguageId = (typeof codeLanguageIds)[number];

export type CodeLanguageOption = {
  detectAliases: string[];
  fileExtension: string;
  id: CodeLanguageId;
  label: string;
  shiki: BundledLanguage | null;
};

export const codeLanguageOptions: CodeLanguageOption[] = [
  {
    detectAliases: ["plaintext", "text", "txt"],
    fileExtension: "txt",
    id: "plaintext",
    label: "Plain text",
    shiki: null,
  },
  {
    detectAliases: ["javascript", "js"],
    fileExtension: "js",
    id: "javascript",
    label: "JavaScript",
    shiki: "javascript",
  },
  {
    detectAliases: ["typescript", "ts"],
    fileExtension: "ts",
    id: "typescript",
    label: "TypeScript",
    shiki: "typescript",
  },
  {
    detectAliases: ["jsx"],
    fileExtension: "jsx",
    id: "jsx",
    label: "JSX",
    shiki: "jsx",
  },
  {
    detectAliases: ["tsx"],
    fileExtension: "tsx",
    id: "tsx",
    label: "TSX",
    shiki: "tsx",
  },
  {
    detectAliases: ["json"],
    fileExtension: "json",
    id: "json",
    label: "JSON",
    shiki: "json",
  },
  {
    detectAliases: ["html", "xml"],
    fileExtension: "html",
    id: "html",
    label: "HTML",
    shiki: "html",
  },
  {
    detectAliases: ["css"],
    fileExtension: "css",
    id: "css",
    label: "CSS",
    shiki: "css",
  },
  {
    detectAliases: ["bash", "shell", "sh", "zsh"],
    fileExtension: "sh",
    id: "bash",
    label: "Bash",
    shiki: "bash",
  },
  {
    detectAliases: ["sql"],
    fileExtension: "sql",
    id: "sql",
    label: "SQL",
    shiki: "sql",
  },
  {
    detectAliases: ["python", "py"],
    fileExtension: "py",
    id: "python",
    label: "Python",
    shiki: "python",
  },
  {
    detectAliases: ["java"],
    fileExtension: "java",
    id: "java",
    label: "Java",
    shiki: "java",
  },
  {
    detectAliases: ["go", "golang"],
    fileExtension: "go",
    id: "go",
    label: "Go",
    shiki: "go",
  },
  {
    detectAliases: ["php"],
    fileExtension: "php",
    id: "php",
    label: "PHP",
    shiki: "php",
  },
  {
    detectAliases: ["ruby", "rb"],
    fileExtension: "rb",
    id: "ruby",
    label: "Ruby",
    shiki: "ruby",
  },
  {
    detectAliases: ["rust", "rs"],
    fileExtension: "rs",
    id: "rust",
    label: "Rust",
    shiki: "rust",
  },
  {
    detectAliases: ["yaml", "yml"],
    fileExtension: "yml",
    id: "yaml",
    label: "YAML",
    shiki: "yaml",
  },
  {
    detectAliases: ["markdown", "md"],
    fileExtension: "md",
    id: "markdown",
    label: "Markdown",
    shiki: "markdown",
  },
  {
    detectAliases: ["dockerfile", "docker"],
    fileExtension: "Dockerfile",
    id: "dockerfile",
    label: "Dockerfile",
    shiki: "dockerfile",
  },
];

export const codeLanguageOptionsById = Object.fromEntries(
  codeLanguageOptions.map((language) => [language.id, language]),
) as Record<CodeLanguageId, CodeLanguageOption>;

export const codeLanguageSelectOptions = codeLanguageOptions.filter(
  (language) => language.id !== "plaintext",
);

export const codeEditorPreloadedLanguages: BundledLanguage[] = [
  "javascript",
  "typescript",
  "jsx",
  "tsx",
  "json",
  "html",
  "css",
  "bash",
  "sql",
  "python",
  "yaml",
  "markdown",
];

export const codeLanguageLabels = Object.fromEntries(
  codeLanguageOptions.map((language) => [language.id, language.label]),
) as Record<CodeLanguageId, string>;
