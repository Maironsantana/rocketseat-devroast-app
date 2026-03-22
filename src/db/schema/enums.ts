import { pgEnum } from "drizzle-orm/pg-core";

export const codeLanguageEnum = pgEnum("code_language", [
  "javascript",
  "typescript",
  "sql",
  "python",
  "java",
  "csharp",
  "go",
  "rust",
  "php",
  "other",
]);

export const submissionStatusEnum = pgEnum("submission_status", [
  "pending",
  "processing",
  "completed",
  "failed",
]);

export const roastVerdictEnum = pgEnum("roast_verdict", [
  "needs_serious_help",
  "rough",
  "salvageable",
  "clean",
]);

export const findingSeverityEnum = pgEnum("finding_severity", [
  "critical",
  "warning",
  "good",
]);
