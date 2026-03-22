# Especificacao de dados para Drizzle ORM + Postgres

## Objetivo

Documentar a primeira camada de persistencia do DevRoast para substituir os dados estaticos atuais por uma base Postgres gerenciada com Drizzle ORM.

Esta especificacao parte de duas fontes:

- `README.md`, que descreve o produto como um app para colar codigo, receber um roast e navegar por uma leaderboard comunitaria.
- `arquivo.pen`, que mostra tres fluxos principais de interface: entrada de codigo, tela de resultado do roast e leaderboard.

## O que o layout indica que precisamos persistir

Pelo layout atual, o backend precisa sustentar pelo menos estes blocos de informacao:

- envio de codigo com conteudo, linguagem e opcao de `roast mode`
- resultado consolidado do roast com score, verdict e frase principal
- metadados agnosticos do provider de IA via camada baseada em AI SDK
- metadados de exibicao como quantidade de linhas e timestamps
- analises detalhadas por item, com severidade, titulo e descricao
- sugestao de melhoria em formato diff
- leaderboard baseada nos piores scores publicados

## Escopo da primeira versao

Para a V1, a persistencia deve cobrir:

- submissao de codigo
- armazenamento do roast gerado
- armazenamento de itens detalhados da analise
- armazenamento do diff sugerido
- consulta da leaderboard

Fica fora do escopo inicial:

- autenticacao
- perfis de usuario
- comentarios, likes ou reacoes
- versionamento de multiplas analises para a mesma submissao
- compartilhamento social com integracoes externas

## Modelo de dominio proposto

### 1. `submissions`

Representa o codigo enviado pelo usuario.

Campos sugeridos:

- `id` uuid pk
- `public_id` varchar unico para URLs e compartilhamento publico
- `source_code` text not null
- `language` enum `code_language` not null
- `roast_mode` boolean not null default `true`
- `line_count` integer not null
- `char_count` integer not null
- `status` enum `submission_status` not null
- `source_hash` varchar(64) opcional para deduplicacao futura
- `created_at` timestamp not null default now
- `updated_at` timestamp not null default now

Observacoes:

- `line_count` aparece explicitamente nas telas de resultado e leaderboard.
- `public_id` evita expor UUID bruto em links publicos.
- `status` permite distinguir filas futuras como `pending`, `processing`, `completed`, `failed`.

### 2. `roasts`

Representa o resultado principal retornado para uma submissao.

Relacao:

- uma submissao tem um roast principal na V1

Campos sugeridos:

- `id` uuid pk
- `submission_id` uuid not null unique fk -> `submissions.id`
- `score` numeric(3,1) not null
- `verdict` enum `roast_verdict` not null
- `headline` text not null
- `summary` text opcional caso queiramos separar a frase hero de um resumo curto
- `provider_key` varchar not null para identificar a abstracao de provider usada pela camada de IA
- `model` varchar opcional para auditoria futura
- `provider_request_id` varchar opcional para correlacao externa
- `provider_metadata` jsonb opcional para armazenar dados agnosticos do provider
- `tokens_used` integer opcional
- `completed_at` timestamp not null default now
- `created_at` timestamp not null default now

Observacoes:

- o layout de resultado mostra `score`, `verdict` e uma frase principal em destaque
- `score` tambem alimenta a leaderboard
- os campos de provider devem ficar desacoplados de vendor especifico, pensando em uso com AI SDK

### 3. `roast_findings`

Representa os cards da secao `detailed_analysis`.

Relacao:

- um roast possui muitos findings

Campos sugeridos:

- `id` uuid pk
- `roast_id` uuid not null fk -> `roasts.id`
- `severity` enum `finding_severity` not null
- `title` varchar(160) not null
- `description` text not null
- `sort_order` integer not null
- `created_at` timestamp not null default now

Observacoes:

- o layout mostra severidades `critical`, `warning` e `good`
- `sort_order` preserva a ordem visual exibida na tela

### 4. `roast_suggested_fixes`

Representa o bloco `suggested_fix` da tela de resultados.

Relacao:

- um roast pode ter zero ou um diff principal na V1

Campos sugeridos:

- `id` uuid pk
- `roast_id` uuid not null unique fk -> `roasts.id`
- `original_file_name` varchar(120) opcional
- `suggested_file_name` varchar(120) opcional
- `diff_text` text not null
- `created_at` timestamp not null default now

Observacoes:

- guardar o diff inteiro em texto simplifica a V1
- se depois precisarmos de renderizacao estruturada, podemos materializar linhas em uma tabela filha ou jsonb

### 5. `leaderboard_snapshots` ou view derivada

Para a V1, recomendo nao criar tabela dedicada de ranking.

Sugestao:

- usar uma view SQL ou query Drizzle derivada de `submissions` + `roasts`
- ordenar por `score` ascendente para exibir os piores codigos no topo
- desempatar por `created_at` desc ou por uma heuristica futura
- incluir automaticamente todo roast concluido com sucesso, sem etapa manual de publicacao

Se houver necessidade de congelar rankings historicos depois, criar:

- `leaderboard_snapshots`
- `leaderboard_snapshot_entries`

Mas isso nao e necessario agora.

## Enums necessarios

### `code_language`

Valores iniciais sugeridos:

- `javascript`
- `typescript`
- `sql`
- `python`
- `java`
- `csharp`
- `go`
- `rust`
- `php`
- `other`

Justificativa:

- o layout hoje mostra `javascript`, `typescript` e `sql`
- a tabela deve nascer pronta para crescimento sem obrigar migration imediata a cada nova linguagem comum

### `submission_status`

Valores:

- `pending`
- `processing`
- `completed`
- `failed`

Justificativa:

- a homepage hoje ainda nao executa o roast real, entao o fluxo assicrono precisa estar previsto
- quando falhar, a submissao fica em `failed` e a nova tentativa fica para fluxo manual/futuro

### `roast_verdict`

Valores sugeridos:

- `needs_serious_help`
- `rough`
- `salvageable`
- `clean`

Justificativa:

- o layout mostra explicitamente `needs_serious_help`
- os demais valores cobrem uma escala coerente para score e comunicacao do produto

### `finding_severity`

Valores:

- `critical`
- `warning`
- `good`

Justificativa:

- sao exatamente as categorias expostas na secao `detailed_analysis`

## Relacionamentos

- `submissions` 1:1 `roasts`
- `roasts` 1:N `roast_findings`
- `roasts` 1:0..1 `roast_suggested_fixes`

## Regras de negocio iniciais

- uma submissao so entra na leaderboard quando `status = completed`
- uma submissao com roast falho nao aparece publicamente
- toda submissao e anonima; nao ha auth nem vinculo com usuario
- `line_count` deve ser calculado no servidor a partir de `source_code`
- `char_count` deve ser calculado no servidor a partir de `source_code`
- `score` deve ficar normalizado na escala `0.0` a `10.0`
- quanto menor o `score`, maior a vergonha na leaderboard
- findings devem ser retornados ja ordenados por `sort_order`
- todo roast concluido deve aparecer automaticamente na leaderboard
- falhas de processamento devem permanecer em `failed` ate nova tentativa manual/futura

## Estrutura sugerida de arquivos para Drizzle

```text
src/
  db/
    client.ts
    schema/
      enums.ts
      submissions.ts
      roasts.ts
      roast-findings.ts
      roast-suggested-fixes.ts
      index.ts
drizzle.config.ts
```

## Convencoes recomendadas no schema

Baseado na documentacao atual do Drizzle para PostgreSQL:

- usar `pgTable` para tabelas
- usar `pgEnum` para enums Postgres reais
- usar `uuid().defaultRandom()` para chaves primarias
- usar `timestamp(...).defaultNow().notNull()` para colunas temporais
- usar `jsonb()` para metadados agnosticos de provider quando necessario
- usar callback da tabela para `index(...)` e `unique(...)` quando houver constraints compostas
- usar `drizzle-orm/node-postgres` com `pg`

## Indices recomendados

### `submissions`

- unique index em `public_id`
- index em `status`
- index em `language`
- index em `created_at`
- index opcional em `source_hash`

### `roasts`

- unique index em `submission_id`
- index em `score`
- index em `verdict`
- index em `provider_key`
- index em `created_at`

### `roast_findings`

- index em `roast_id`
- index composto em (`roast_id`, `sort_order`)

### `roast_suggested_fixes`

- unique index em `roast_id`

## Query de leaderboard esperada

A leaderboard pode nascer como uma query paginada semelhante a:

- filtrar `submissions.status = completed`
- join com `roasts`
- selecionar `submission.public_id`, `submission.language`, `submission.line_count`, `roast.score`, `roast.verdict`, `submission.source_code`, `submission.created_at`
- ordenar por `roast.score asc`, depois `submission.created_at desc`
- limitar numero de linhas conforme pagina ou preview

Comportamento esperado:

- nao existe acao manual de publish
- roast concluido com sucesso aparece automaticamente no ranking
- roast com `status = failed` fica fora do ranking

## Docker Compose para Postgres local

Devemos introduzir um `docker-compose.yml` com um servico `postgres` para desenvolvimento local.

Configuracao sugerida:

- imagem `postgres:17-alpine`
- porta `5432:5432`
- volume nomeado para persistencia local
- `POSTGRES_DB=devroast`
- `POSTGRES_USER=devroast`
- `POSTGRES_PASSWORD=devroast`
- healthcheck com `pg_isready`

Variaveis de ambiente esperadas no app:

- `DATABASE_URL=postgresql://devroast:devroast@localhost:5432/devroast`

Opcionalmente, manter tambem:

- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`

Mas para a V1 eu recomendo padronizar tudo em `DATABASE_URL` e derivar o restante apenas se realmente necessario.

## Dependencias esperadas

Dependencias de runtime:

- `drizzle-orm`
- `pg`

Dependencias de desenvolvimento:

- `drizzle-kit`
- `dotenv`

## Scripts sugeridos no `package.json`

- `db:up` -> sobe o Postgres com Docker Compose
- `db:down` -> derruba os containers
- `db:logs` -> acompanha logs do Postgres
- `db:generate` -> gera migration com Drizzle Kit
- `db:migrate` -> aplica migrations
- `db:studio` -> abre Drizzle Studio

## To-dos de implementacao

### Infra

- criar `docker-compose.yml` para Postgres local
- criar `.env.example` com `DATABASE_URL`
- adicionar dependencias `drizzle-orm`, `drizzle-kit`, `pg`, `dotenv`

### Setup do Drizzle

- criar `drizzle.config.ts` com dialeto `postgresql`
- criar `src/db/client.ts` com conexao via `drizzle-orm/node-postgres`
- criar `src/db/schema/index.ts` exportando todo o schema

### Schema

- criar enums Postgres
- criar tabela `submissions`
- criar tabela `roasts`
- criar tabela `roast_findings`
- criar tabela `roast_suggested_fixes`
- adicionar indices e uniques

### Migrations

- gerar migration inicial
- subir banco local via Docker Compose
- aplicar migration no banco local
- validar se enums, fks e indices foram criados corretamente

### Seed e dados de desenvolvimento

- criar seed com ao menos 3 submissoes equivalentes ao preview atual
- popular leaderboard com exemplos de `javascript`, `typescript` e `sql`
- incluir findings e diff para pelo menos 1 resultado completo
- incluir exemplos com metadados de provider simulados via `provider_metadata`

### Integracao com app

- substituir `leaderboardRows` estatico da homepage por query real
- criar rota ou server action para persistir novas submissoes
- preparar fluxo para salvar roast via camada agnostica baseada em AI SDK
- criar pagina real de leaderboard
- criar pagina real de resultado do roast usando `public_id`
- marcar falhas como `failed` sem retry automatico na V1
- deixar reprocessamento para acao manual/futura

## Assuncoes importantes

- nao existe usuario autenticado na V1; as submissoes sao anonimas
- leaderboard e derivada dos resultados salvos, nao de um ranking materializado
- todo roast concluido entra automaticamente na leaderboard
- cada submissao tem um unico roast principal na V1
- `roast mode` e salvo na submissao, pois impacta a geracao do resultado
- a camada de IA sera implementada com abstracao de provider, sem acoplamento direto ao vendor

## Riscos e decisoes em aberto

- decidir se `source_code` deve ser armazenado integralmente ou com algum limite maximo
- decidir se `diff_text` basta para a UI ou se a renderizacao futura pede estrutura em `jsonb`
- decidir se `public_id` sera aleatorio curto, slug ou hash derivado do UUID
- definir o conjunto minimo de chaves aceitas em `provider_metadata` para nao virar um deposito arbitrario

## Recomendacao final

Comecar com um schema pequeno e estavel:

- `submissions`
- `roasts`
- `roast_findings`
- `roast_suggested_fixes`

Esse conjunto cobre o que o README promete e o que o layout ja desenha, sem antecipar complexidades de auth, social ou historico de ranking.
