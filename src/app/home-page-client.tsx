"use client";

import * as React from "react";

import {
  Badge,
  Button,
  CodeEditor,
  CodeLanguageSelect,
  DetectedLanguageBadge,
  SwitchControl,
  SwitchDescription,
  SwitchField,
  SwitchLabel,
  SwitchRoot,
} from "@/components/ui";
import {
  CODE_EDITOR_DETECT_DEBOUNCE_MS,
  CODE_EDITOR_MAX_CHARACTERS,
} from "@/lib/code-editor/constants";
import { detectCodeLanguage } from "@/lib/code-editor/detect-language";
import {
  type CodeLanguageId,
  codeLanguageLabels,
  codeLanguageOptionsById,
} from "@/lib/code-editor/languages";

const sampleCode = [
  "function calculateTotal(items) {",
  "  var total = 0;",
  "  for (var i = 0; i < items.length; i++) {",
  "    total = total + items[i].price;",
  "  }",
  "",
  "  if (total > 100) {",
  '    console.log("discount applied");',
  "    total = total * 0.9;",
  "  }",
  "",
  "  // TODO: handle tax calculation",
  "  // TODO: handle currency conversion",
  "",
  "  return total;",
  "}",
].join("\n");

type HomePageClientProps = {
  leaderboardSlot: React.ReactNode;
  metricsSlot: React.ReactNode;
};

export function HomePageClient({
  leaderboardSlot,
  metricsSlot,
}: HomePageClientProps) {
  const [code, setCode] = React.useState(sampleCode);
  const [manualLanguage, setManualLanguage] =
    React.useState<CodeLanguageId | null>(null);
  const [detectedLanguage, setDetectedLanguage] =
    React.useState<CodeLanguageId>("plaintext");
  const [isDetectingLanguage, setIsDetectingLanguage] = React.useState(false);
  const [isHighlighting, setIsHighlighting] = React.useState(false);
  const hasExceededLimit = code.length > CODE_EDITOR_MAX_CHARACTERS;

  React.useEffect(() => {
    if (hasExceededLimit || code.trim().length === 0) {
      setDetectedLanguage("plaintext");
      setIsDetectingLanguage(false);
      return;
    }

    if (manualLanguage) {
      setIsDetectingLanguage(false);
      return;
    }

    setIsDetectingLanguage(true);

    const timeout = window.setTimeout(() => {
      setDetectedLanguage(detectCodeLanguage(code));
      setIsDetectingLanguage(false);
    }, CODE_EDITOR_DETECT_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [code, hasExceededLimit, manualLanguage]);

  const resolvedLanguage = hasExceededLimit
    ? "plaintext"
    : (manualLanguage ?? detectedLanguage);
  const fileName = React.useMemo(() => {
    const extension = codeLanguageOptionsById[resolvedLanguage].fileExtension;

    return extension === "Dockerfile" ? extension : `pasted.${extension}`;
  }, [resolvedLanguage]);
  const showDetectedBadge = manualLanguage === null;
  const detectedBadgeLabel =
    isDetectingLanguage || isHighlighting
      ? "detecting..."
      : codeLanguageLabels[resolvedLanguage];

  return (
    <main className="px-6 py-12 md:px-10 md:py-20">
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-8">
        <section className="space-y-3">
          <div className="font-mono flex items-center gap-3 text-[36px] font-bold leading-none tracking-tight text-foreground-inverse">
            <span className="text-accent-green">$</span>
            <h1>paste your code. get roasted.</h1>
          </div>

          <p className="max-w-2xl text-sm leading-6 text-foreground-secondary md:text-base">
            {
              "// drop your code below and we'll rate it - brutally honest or full roast mode"
            }
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-end gap-3">
              <CodeLanguageSelect
                onValueChange={setManualLanguage}
                value={manualLanguage}
              />

              {showDetectedBadge ? (
                <DetectedLanguageBadge
                  isDetecting={isDetectingLanguage || isHighlighting}
                  label={detectedBadgeLabel}
                />
              ) : null}

              {hasExceededLimit ? (
                <Badge variant="critical">
                  {`limit exceeded - ${CODE_EDITOR_MAX_CHARACTERS} chars max`}
                </Badge>
              ) : null}
            </div>
          </div>

          <CodeEditor
            fileName={fileName}
            language={resolvedLanguage}
            minRows={16}
            onHighlightingChange={setIsHighlighting}
            onValueChange={setCode}
            placeholder="// paste your code here"
            value={code}
          />
        </section>

        <section className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <SwitchRoot defaultChecked>
            <SwitchControl />
            <SwitchField>
              <SwitchLabel>roast mode</SwitchLabel>
              <SwitchDescription>
                {"// maximum sarcasm enabled"}
              </SwitchDescription>
            </SwitchField>
          </SwitchRoot>

          <Button disabled={code.trim().length === 0}>$ roast_my_code</Button>
        </section>

        <section className="flex justify-center">{metricsSlot}</section>

        <div className="h-7" />

        {leaderboardSlot}
      </div>
    </main>
  );
}
