import {
  Badge,
  Button,
  CodeBlock,
  DiffLine,
  PanelContent,
  PanelDescription,
  PanelHeader,
  PanelRoot,
  PanelTitle,
  ScoreRingDescription,
  ScoreRingLabel,
  ScoreRingRoot,
  ScoreRingValue,
  ScoreRingVisual,
  SwitchControl,
  SwitchDescription,
  SwitchField,
  SwitchLabel,
  SwitchRoot,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui";

const buttonVariants = ["primary", "secondary", "link"] as const;

const sampleCode = [
  "function calculateTotal(items) {",
  "  var total = 0;",
  "  for (var i = 0; i < items.length; i++) {",
  "    total = total + items[i].price;",
  "  }",
  "  return total;",
  "}",
].join("\n");

export default async function ComponentsPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] px-6 py-10 text-white md:px-10 md:py-14">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="space-y-4 border border-border-subtle bg-canvas-base px-6 py-6 md:px-8">
          <div className="font-mono flex items-center gap-2 text-[24px] font-bold tracking-tight">
            <span className="text-accent-green">{"//"}</span>
            <span className="text-foreground-inverse">component_library</span>
          </div>
          <p className="max-w-3xl text-sm leading-6 text-foreground-secondary md:text-base">
            Vitrine dos componentes genéricos derivados da Component Library do
            Pencil. A ideia aqui é validar rapidamente os blocos mais
            reaproveitáveis do app.
          </p>
        </header>

        <section className="space-y-4">
          <SectionTitle label="buttons" />
          <div className="flex flex-wrap items-center gap-4 border border-border-subtle bg-canvas-base px-6 py-6">
            {buttonVariants.map((variant) => (
              <Button key={variant} variant={variant}>
                {variant === "primary"
                  ? "$ roast_my_code"
                  : variant === "secondary"
                    ? "$ share_roast"
                    : "$ view_all >>"}
              </Button>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle label="toggle" />
          <div className="flex flex-wrap items-start gap-8 border border-border-subtle bg-canvas-base px-6 py-6">
            <SwitchRoot defaultChecked>
              <SwitchControl />
              <SwitchField>
                <SwitchLabel>roast mode</SwitchLabel>
              </SwitchField>
            </SwitchRoot>

            <SwitchRoot>
              <SwitchControl />
              <SwitchField>
                <SwitchLabel>roast mode</SwitchLabel>
              </SwitchField>
            </SwitchRoot>

            <SwitchRoot defaultChecked>
              <SwitchControl />
              <SwitchField>
                <SwitchLabel>roast mode</SwitchLabel>
                <SwitchDescription>
                  {"// maximum sarcasm enabled"}
                </SwitchDescription>
              </SwitchField>
            </SwitchRoot>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle label="badge_status" />
          <div className="flex flex-wrap items-center gap-6 border border-border-subtle bg-canvas-base px-6 py-6">
            <Badge variant="critical">critical</Badge>
            <Badge variant="warning">warning</Badge>
            <Badge variant="good">good</Badge>
            <Badge size="md" variant="critical">
              needs_serious_help
            </Badge>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle label="cards" />
          <div className="grid gap-6 xl:grid-cols-[480px_minmax(0,1fr)]">
            <PanelRoot variant="default">
              <PanelContent>
                <div className="flex flex-col gap-3">
                  <PanelTitle>
                    <Badge variant="critical">critical</Badge>
                  </PanelTitle>
                  <div className="font-mono text-[13px] text-foreground-inverse">
                    using var instead of const/let
                  </div>
                  <PanelDescription>
                    the var keyword is function-scoped rather than block-scoped,
                    which can lead to unexpected behavior and bugs. modern
                    javascript uses const for immutable bindings and let for
                    mutable ones.
                  </PanelDescription>
                </div>
              </PanelContent>
            </PanelRoot>

            <PanelRoot padding="none" variant="terminal">
              <PanelHeader />
              <PanelContent className="px-4 py-4" padding="none">
                <DiffLine variant="removed">var total = 0;</DiffLine>
                <DiffLine variant="added">const total = 0;</DiffLine>
                <DiffLine variant="context">
                  for (let i = 0; i &lt; items.length; i++) {"{"}
                </DiffLine>
              </PanelContent>
            </PanelRoot>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle label="code_block" />
          <div className="grid gap-6 xl:grid-cols-[560px_minmax(0,1fr)]">
            <CodeBlock code={sampleCode} fileName="calculate.js" lang="ts" />

            <PanelRoot variant="default">
              <PanelContent padding="lg">
                <div className="space-y-3">
                  <PanelTitle>server_only_code_block</PanelTitle>
                  <PanelDescription>
                    Renderizado com Shiki no servidor, usando o tema vesper, e
                    embalado em um Panel terminal para manter a linguagem visual
                    da library.
                  </PanelDescription>
                  <div className="space-y-3 text-sm leading-6 text-foreground-secondary">
                    <p>
                      O componente aceita `code`, `lang`, `fileName` e
                      `showLineNumbers`.
                    </p>
                    <p>
                      O highlight sai pronto do servidor e evita custo de
                      runtime no cliente.
                    </p>
                  </div>
                </div>
              </PanelContent>
            </PanelRoot>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle label="diff_line" />
          <div className="space-y-0 border border-border-subtle bg-canvas-base py-4">
            <DiffLine variant="removed">var total = 0;</DiffLine>
            <DiffLine variant="added">const total = 0;</DiffLine>
            <DiffLine variant="context">
              for (let i = 0; i &lt; items.length; i++) {"{"}{" "}
            </DiffLine>
          </div>
        </section>

        <section className="space-y-4">
          <SectionTitle label="table_row" />
          <Table>
            <TableHeader>
              <TableRow variant="header">
                <TableCell as="th" tone="muted">
                  #
                </TableCell>
                <TableCell as="th" tone="muted">
                  score
                </TableCell>
                <TableCell as="th" tone="muted">
                  code
                </TableCell>
                <TableCell as="th" tone="muted">
                  lang
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell tone="muted">#1</TableCell>
                <TableCell tone="score">2.1</TableCell>
                <TableCell tone="muted">
                  function calculateTotal(items) {"{"} var total = 0; ...
                </TableCell>
                <TableCell tone="muted">javascript</TableCell>
              </TableRow>
              <TableRow>
                <TableCell tone="muted">#2</TableCell>
                <TableCell tone="score">3.5</TableCell>
                <TableCell tone="muted">
                  eval(prompt(&quot;enter code&quot;))
                </TableCell>
                <TableCell tone="muted">javascript</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </section>

        <section className="space-y-4">
          <SectionTitle label="score_ring" />
          <div className="flex flex-wrap gap-8 border border-border-subtle bg-canvas-base px-6 py-6">
            <ScoreRingRoot max={10} value={3.5}>
              <ScoreRingVisual>
                <ScoreRingValue />
              </ScoreRingVisual>
              <div className="flex flex-col items-center gap-1 text-center">
                <ScoreRingLabel>roast_score</ScoreRingLabel>
                <ScoreRingDescription>
                  avg score from recent roasts
                </ScoreRingDescription>
              </div>
            </ScoreRingRoot>

            <ScoreRingRoot max={10} value={7.8}>
              <ScoreRingVisual>
                <ScoreRingValue />
              </ScoreRingVisual>
              <div className="flex flex-col items-center gap-1 text-center">
                <ScoreRingLabel>quality</ScoreRingLabel>
                <ScoreRingDescription>healthy baseline</ScoreRingDescription>
              </div>
            </ScoreRingRoot>
          </div>
        </section>
      </div>
    </main>
  );
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="font-mono flex items-center gap-2 text-sm font-bold tracking-tight">
      <span className="text-accent-green">{"//"}</span>
      <span className="text-foreground-inverse">{label}</span>
    </div>
  );
}
