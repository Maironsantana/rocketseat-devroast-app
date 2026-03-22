import {
  type BundledLanguage,
  type BundledTheme,
  createHighlighter,
} from "shiki/bundle/web";

import {
  type CodeLanguageId,
  codeEditorPreloadedLanguages,
  codeLanguageOptionsById,
} from "./languages";

type CodeEditorHighlighter = Awaited<ReturnType<typeof createHighlighter>>;

const codeEditorTheme: BundledTheme = "vesper";

let highlighterPromise: Promise<CodeEditorHighlighter> | null = null;

function createCodeEditorHighlighter() {
  return createHighlighter({
    langs: codeEditorPreloadedLanguages,
    themes: [codeEditorTheme],
  });
}

export function getCodeEditorHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = createCodeEditorHighlighter();
  }

  return highlighterPromise;
}

export async function ensureCodeEditorLanguage(languageId: CodeLanguageId) {
  const highlighter = await getCodeEditorHighlighter();
  const language = codeLanguageOptionsById[languageId].shiki;

  if (!language) {
    return highlighter;
  }

  const loadedLanguages = highlighter.getLoadedLanguages();

  if (!loadedLanguages.includes(language)) {
    await highlighter.loadLanguage(language as BundledLanguage);
  }

  return highlighter;
}

export { codeEditorTheme };
