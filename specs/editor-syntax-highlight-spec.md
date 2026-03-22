# Editor com syntax highlight

## Objetivo

Construir na homepage um editor focado em colar codigo, com syntax highlight em tempo real, descoberta automatica de linguagem e opcao de selecao manual pelo usuario.

O editor precisa manter a linguagem visual atual do DevRoast: dark, terminal-inspired, compacto e code-first.

## Contexto atual do projeto

- A homepage hoje usa `CodeEditorInput`, que e um `textarea` estilizado com numeracao de linhas, sem syntax highlight.
- O projeto ja usa `shiki` (`^4.0.2`) para renderizar blocos estaticos via `CodeBlock` em server components.
- A homepage atual e client component (`src/app/page.tsx`), entao o editor editavel tambem deve ser client-side.
- A base visual ja possui primitives reutilizaveis em `src/components/ui`, especialmente `Panel`, `Button` e `Switch`.

## O que precisa entregar

- Campo editavel onde o usuario cola codigo.
- Syntax highlight aplicado conforme a linguagem detectada.
- Deteccao automatica de linguagem quando o usuario cola ou altera o codigo.
- Override manual de linguagem na homepage.
- Fallback estavel para `plaintext` quando a deteccao for fraca ou inconclusiva.
- Base preparada para reuso futuro em outras telas sem acoplar tudo na homepage.

## Pesquisa de abordagens

### Opcao A - `textarea` sobreposto + camada destacada com Shiki + auto-detect separado

Essa e a abordagem mais parecida com Ray.so.

Como funciona:

- Um `textarea` transparente fica responsavel por input, cursor, selecao, colar e acessibilidade.
- Abaixo ou atras dele, uma camada renderiza o mesmo conteudo ja destacado.
- O scroll, padding, line-height e fonte precisam ficar 100% sincronizados entre as duas camadas.
- A deteccao automatica de linguagem fica em uma etapa separada.

Pontos fortes:

- Mantem total controle visual sobre o editor.
- Bundle menor que Monaco.
- Casa melhor com a UI atual do DevRoast.
- Boa experiencia para o caso principal, que e colar codigo e submeter.
- Permite continuar usando Shiki, que ja existe no projeto.

Pontos fracos:

- Precisamos implementar detalhes de edicao manualmente: sincronizacao de scroll, selecao visual, tabs, enter/indentacao, mobile quirks.
- Auto-highlight durante digitacao exige cuidado com performance.
- Nao oferece recursos avancados de IDE por padrao.

Conclusao:

- Melhor equilibrio para a v1 do DevRoast.
- Recomendacao principal.

### Opcao B - CodeMirror 6

CodeMirror 6 e a melhor opcao se o produto quiser virar um editor mais completo.

O que a documentacao atual confirma:

- O setup recomendado usa `EditorView`, `basicSetup` e extensoes de linguagem.
- Linguagens podem ser trocadas dinamicamente com extensoes/compartments.
- Em React, `@uiw/react-codemirror` entrega API controlada simples com `value`, `onChange` e `extensions`.
- Existe carregamento dinamico de linguagens com `loadLanguage` no ecossistema `uiw`.

Pontos fortes:

- Editor real, robusto e maduro.
- Melhor tratamento de selecao, cursor, historico, indentacao e atalhos.
- Escala melhor se quisermos autocomplete, lint, fold ou formatacao inline no futuro.

Pontos fracos:

- Mais complexo de estilizar para ficar com o look exato do DevRoast.
- Bundle e custo conceitual maiores que a abordagem Ray.so-like.
- Auto-detect continua sendo problema separado; CodeMirror nao resolve isso sozinho.

Conclusao:

- Excelente plano B se o escopo crescer rapido.
- Hoje parece mais ferramenta do que a feature precisa.

### Opcao C - Monaco Editor

O que a documentacao atual confirma:

- Monaco exige carregamento dinamico e configuracao de workers.
- O bundle e significativamente mais pesado.
- Faz mais sentido quando precisamos de experiencia tipo VS Code: diagnostics, IntelliSense, models e language services.

Pontos fortes:

- UX muito poderosa.
- Suporte amplo de linguagens e servicos.

Pontos fracos:

- Overkill para a homepage do DevRoast.
- Integracao com Next e mais trabalhosa.
- Piora custo de performance para um caso de uso paste-first.
- Visual fica menos "nosso" e mais "IDE embutida".

Conclusao:

- Nao recomendado para esta feature.

## Auto-detect de linguagem

### O que faz sentido usar

Para deteccao automatica, a melhor composicao hoje e:

- `highlight.js` para inferir a linguagem com `highlightAuto(code, subset)`.
- `Shiki` para renderizar o syntax highlight final.

Motivo:

- A documentacao do `highlight.js` continua oferecendo auto-detect nativo, com retorno de `language`, `relevance` e `secondBest`.
- A documentacao do `Shiki` nao posiciona auto-detect como funcionalidade principal; ele e excelente para highlight, nao para inferencia heuristica.
- Essa combinacao replica a ideia usada pelo Ray.so: detectar com uma biblioteca, renderizar com outra.

### Regra recomendada de deteccao

1. Se o usuario escolheu linguagem manualmente, ela sempre vence.
2. Rodar `highlightAuto` com um subconjunto curado de linguagens suportadas.
3. So aceitar o resultado automatico se a confianca passar um limiar definido no spec tecnico.
4. Quando a confianca for baixa ou houver empate forte, usar `plaintext` e exibir estado "Auto" sem travar highlight errado.

### Linguagens iniciais da v1

Para reduzir erros de deteccao e custo de bundle, a v1 deve focar em um conjunto curado de linguagens populares de web + backend, com estrutura para expansao futura:

- `javascript`
- `typescript`
- `tsx`
- `jsx`
- `json`
- `html`
- `css`
- `bash`
- `sql`
- `python`
- `java`
- `go`
- `php`
- `ruby`
- `rust`
- `yaml`
- `markdown`
- `dockerfile`
- `plaintext`

Esse conjunto cobre boa parte do uso esperado sem abrir o catalogo inteiro de linguagens logo no dia 1.

## O que o Ray.so faz

Analise do repositorio `raycast/ray-so`:

- O editor usa uma estrategia de duas camadas em `app/(navigation)/(code)/components/Editor.tsx`:
  - `textarea` real para edicao.
  - `HighlightedCode` para exibir o HTML destacado.
- O highlight e feito com `Shiki` no cliente em `HighlightedCode.tsx`.
- O Ray.so carrega algumas linguagens iniciais e faz `loadLanguage` sob demanda quando o usuario muda a linguagem.
- A deteccao automatica fica no estado em `store/code.ts` e usa `highlight.js` com `highlightAuto`.
- O seletor manual de linguagem existe em `LanguageControl.tsx`, com uma opcao explicita de `Auto-Detect`.

O que vale reaproveitar conceitualmente:

- Separar editor editavel de motor de highlight.
- Manter modo `Auto` e modo manual como estados diferentes.
- Lazy load de linguagens no Shiki.
- Fallback para `plaintext`.

O que nao precisa copiar literalmente:

- Atalhos e edicao mais rica do Ray.so.
- Toda a complexidade de export, resize, screenshot e customizacoes visuais.
- Estado global grande; para DevRoast, estado local ou contexto pequeno deve bastar.

## Recomendacao final

Implementar a feature com a arquitetura abaixo:

- UI do editor no cliente, na homepage.
- Base visual mantida com `Panel` e primitives atuais.
- Entrada com estrategia Ray.so-like: `textarea` sobreposto em uma camada destacada.
- Highlight com `Shiki` no cliente apenas dentro do editor.
- Auto-detect com `highlight.js`, limitado a um subconjunto curado de linguagens.
- Seletor manual com opcao `Auto` + linguagens suportadas.
- `CodeBlock` atual continua server-side para visualizacao de codigo fora do editor.

Essa combinacao preserva:

- qualidade visual do highlight;
- experiencia paste-first;
- controle do design;
- bundle e complexidade dentro de um limite razoavel.

## Especificacao de implementacao

### 1. Arquitetura de componentes

Criar a feature separando responsabilidades:

- `src/components/ui/code-editor.tsx`
  - shell principal do editor editavel.
  - controla layout, chrome, line numbers e sincronizacao.
- `src/components/ui/code-editor-highlight.tsx`
  - recebe `code`, `language`, `theme` e renderiza a camada destacada.
- `src/components/ui/code-language-select.tsx`
  - seletor manual com `Auto` + lista de linguagens.
- `src/components/ui/detected-language-badge.tsx`
  - badge exibida ao lado do seletor quando o modo `Auto` estiver ativo.
- `src/lib/code-editor/languages.ts`
  - catalogo curado de linguagens, aliases e extensoes.
- `src/lib/code-editor/detect-language.ts`
  - pipeline de deteccao automatica.
- `src/lib/code-editor/shiki-client.ts`
  - singleton/lazy loader do highlighter cliente.

Observacao:

- Se o time preferir nao promover isso ainda para `src/components/ui`, pode nascer em uma pasta de feature e ser promovido quando estabilizar. Mesmo assim, a API deve nascer composable.

### 2. Estado minimo da feature

Estado recomendado na homepage:

- `code: string`
- `manualLanguage: string | null`
- `detectedLanguage: string | null`
- `resolvedLanguage: string`
- `isDetectingLanguage: boolean`
- `isHighlightReady: boolean`
- `isSnippetTooLarge: boolean`

Resolucao final:

- `resolvedLanguage = manualLanguage ?? detectedLanguage ?? "plaintext"`

### 3. Fluxo de deteccao

- Ao colar ou editar codigo, disparar deteccao com debounce curto (`150ms` a `250ms`).
- Se o codigo estiver vazio ou curto demais, cair direto para `plaintext`.
- Se o codigo ultrapassar o limite de caracteres da v1, interromper o auto-detect e aplicar modo degradado de highlight.
- Se houver override manual, nao rodar troca visual automatica.
- Ao detectar uma nova linguagem valida, atualizar apenas `detectedLanguage`.
- Ao trocar `resolvedLanguage`, carregar a gramatica do Shiki sob demanda se ainda nao estiver carregada.

### 4. Regras de UX

- O seletor deve mostrar `Auto` quando `manualLanguage === null`.
- Quando `Auto` estiver ativo, o trigger continua mostrando apenas `Auto`.
- Ao lado do seletor, uma `Badge` deve mostrar a linguagem detectada automaticamente.
- Em modo `Auto`, a badge pode assumir tres estados: `detecting...`, linguagem detectada (ex: `TypeScript`) ou `Plain text`.
- Se a deteccao ou troca de highlight demorar mais do que o esperado, exibir um sinal de loading proximo da badge de linguagem.
- Quando o usuario escolher manualmente uma linguagem, o estado automatico continua existindo internamente, mas nao domina a UI.
- Quando o usuario escolher manualmente uma linguagem, a badge de linguagem detectada nao precisa aparecer.
- Deve existir placeholder claro para colagem, por exemplo `// cole seu codigo aqui`.
- Em linguagens desconhecidas ou confianca baixa, destacar como `plaintext` em vez de arriscar cor errada.

### 5. Performance

- Reutilizar uma unica instancia de highlighter cliente.
- Carregar apenas `vesper` e linguagens iniciais no bootstrap.
- Lazy load para linguagens extras.
- Debounce na deteccao automatica.
- Se necessario, atrasar highlight de trechos muito grandes para o proximo frame ou usar `useDeferredValue`.
- Definir um limite de caracteres para input muito extenso; acima disso, desabilitar auto-detect continuo ou simplificar o highlight.

### 6. Acessibilidade e comportamento

- O elemento editavel continua sendo `textarea`, preservando semantica nativa.
- `spellCheck={false}`.
- Manter navegacao por teclado e foco visivel.
- Garantir contraste suficiente entre texto, caret e tema.
- Em mobile, validar scroll horizontal, altura minima e comportamento de teclado virtual.

### 7. Integracao com a homepage

Na `src/app/page.tsx`:

- substituir `CodeEditorInput` pelo novo editor enriquecido;
- adicionar o seletor manual de linguagem no bloco principal do editor;
- adicionar a badge da linguagem detectada ao lado do seletor quando `Auto` estiver ativo;
- adicionar o estado visual de loading perto da badge quando a deteccao/highlight estiverem lentos;
- manter o CTA `$ roast_my_code` dependente apenas de `code.trim()`;
- preparar o estado para enviar `code` e `resolvedLanguage` na futura submissao.

### 8. Contrato de dados para o backend futuro

Mesmo sem implementar agora, a API futura deve receber:

```ts
type RoastRequest = {
  code: string;
  language: string;
};
```

## Criterios de aceite

- Usuario cola codigo e ve syntax highlight aplicado em ate poucos instantes.
- Linguagem e detectada automaticamente na maioria dos casos comuns da lista curada.
- Usuario pode trocar manualmente a linguagem na homepage.
- Troca manual prevalece sobre auto-detect.
- Highlight continua consistente com o tema visual do produto.
- Performance continua boa em desktop e mobile para snippets de tamanho comum.
- Quando a deteccao falhar, a UI continua funcional com `plaintext`.

## Riscos e mitigacoes

### Risco: deteccao errada entre linguagens parecidas

Mitigacao:

- limitar o subset da deteccao;
- usar fallback para `plaintext` se a confianca for baixa.

### Risco: highlight pesado durante digitacao

Mitigacao:

- debounce;
- highlighter singleton;
- lazy load de linguagens;
- limite de caracteres para comportamento degradado.

### Risco: bugs visuais por overlay `textarea` + camada destacada

Mitigacao:

- sincronizar font-family, font-size, line-height, padding e scroll com testes manuais dedicados;
- validar desktop, Safari e mobile cedo.

## Decisoes recomendadas

- Escolher a abordagem Ray.so-like como base da v1.
- Manter `Shiki` como renderer de syntax highlight.
- Adotar `highlight.js` apenas para auto-detect.
- Suportar um conjunto curado de linguagens na primeira entrega.
- Preservar `CodeBlock` server-side para exibicao nao editavel.

## To-dos de implementacao

- [ ] Definir a lista final de linguagens da v1 e seus aliases.
- [ ] Definir aliases e subset de auto-detect para a lista curada de web + backend.
- [ ] Definir a UX final do seletor (`Auto`) e da badge de linguagem detectada.
- [ ] Definir o limite de caracteres da v1 e o comportamento degradado acima dele.
- [ ] Criar catalogo de linguagens em `src/lib/code-editor/languages.ts`.
- [ ] Criar pipeline de deteccao em `src/lib/code-editor/detect-language.ts`.
- [ ] Criar singleton do Shiki cliente com lazy load de linguagens.
- [ ] Implementar o novo componente de editor com overlay de highlight.
- [ ] Sincronizar scroll, line numbers, caret e placeholder.
- [ ] Integrar o seletor manual na homepage.
- [ ] Integrar a badge de linguagem detectada na homepage.
- [ ] Integrar o loading visual ao lado da badge para deteccao/highlight lentos.
- [ ] Preparar o submit para enviar `resolvedLanguage`.
- [ ] Validar snippets grandes, paste rapido e troca frequente de linguagem.
- [ ] Testar responsividade e comportamento mobile.
- [ ] Testar acessibilidade basica por teclado e leitura visual.

## Perguntas em aberto

1. Qual deve ser o limite de caracteres da v1 para entrar em modo degradado?

## Recomendacao objetiva

Se a implementacao comecasse hoje, eu seguiria este plano:

1. v1 com `textarea` sobreposto + `Shiki` + `highlight.js`.
2. Lista curada de linguagens populares de web + backend.
3. Seletor manual com modo `Auto` e badge ao lado para a linguagem detectada.
4. Loading visual perto da badge quando deteccao ou highlight demorarem.
5. Limite de caracteres com degradacao controlada para snippets muito grandes.
6. `plaintext` como fallback seguro.
7. Evoluir para CodeMirror apenas se a feature deixar de ser paste-first e passar a exigir comportamento de editor mais avancado.
