# tRPC como camada de API/backend

## Objetivo

Adicionar `tRPC` como camada principal de API/backend do DevRoast em cima do Next.js App Router, com suporte a SSR, React Server Components e integracao com TanStack React Query seguindo a documentacao oficial.

## Contexto atual do projeto

- o app usa Next.js App Router com React 19
- a homepage (`src/app/page.tsx`) ainda e client component e usa dados locais
- leaderboard e pagina de resultado ainda renderizam dados mockados
- o projeto ja possui banco com Drizzle em `src/db/client.ts` e schema em `src/db/schema`
- ainda nao existe camada formal de API, router backend ou estrategia compartilhada de fetch/cache

## O que precisa entregar

- setup base de `tRPC` no App Router
- integracao com `@trpc/tanstack-react-query`, nao com o stack legado de Next pages router
- suporte a uso em client components e prefetch em server components
- rota `/api/trpc` com fetch adapter
- contexto do backend preparado para acessar banco e headers da request
- primeiros routers para cobrir leaderboard, submissao e resultado do roast
- base pronta para substituir os mocks atuais por dados reais

## Recomendacao final

Seguir a abordagem recomendada pela documentacao atual do tRPC para Next.js App Router:

- usar `@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query` e `@tanstack/react-query`
- criar provider cliente com `createTRPCContext` e `httpBatchLink`
- criar proxy server-side com `createTRPCOptionsProxy`
- fazer prefetch em server components com `queryClient.prefetchQuery(...)`, `dehydrate(...)` e `HydrationBoundary`
- manter os routers finos, deixando regra de negocio e acesso ao Drizzle em camada propria

Essa abordagem casa com o que o projeto precisa agora: API tipada, boa DX, SSR real para paginas indexaveis e reuso do mesmo contrato no cliente e no servidor.

## Especificacao de implementacao

### Dependencias

Adicionar:

- `@trpc/server`
- `@trpc/client`
- `@trpc/tanstack-react-query`
- `@tanstack/react-query`
- `zod`

Observacao:

- para este projeto, a referencia deve ser a documentacao de App Router com `@trpc/tanstack-react-query`
- nao usar a integracao antiga de `pages` nem padroes legacy de `@trpc/next`

### Estrutura sugerida

```text
src/
  app/
    api/
      trpc/
        [trpc]/
          route.ts
  server/
    api/
      root.ts
      trpc.ts
      routers/
        health.ts
        leaderboard.ts
        submissions.ts
        roasts.ts
      services/
        leaderboard-service.ts
        submissions-service.ts
        roasts-service.ts
  trpc/
    client.tsx
    query-client.ts
    server.ts
```

### Backend base

Criar em `src/server/api/trpc.ts`:

- `createTRPCContext` recebendo `headers`
- `initTRPC`
- `createTRPCRouter`
- `publicProcedure`

O contexto inicial deve expor pelo menos:

- `db` vindo de `src/db/client.ts`
- `headers` da request

Se depois houver auth, esse contexto evolui sem quebrar os routers existentes.

### Root router

Criar em `src/server/api/root.ts` o `appRouter` unindo routers de dominio.

Exportar tambem:

- `type AppRouter = typeof appRouter`

### Route handler

Criar `src/app/api/trpc/[trpc]/route.ts` com `fetchRequestHandler`, como recomendado pela documentacao do App Router.

Comportamento esperado:

- expor `GET` e `POST`
- usar endpoint `/api/trpc`
- chamar `createTRPCContext` por request

### Query client e provider

Criar `src/trpc/query-client.ts` com um `makeQueryClient()` unico para o projeto.

Criar `src/trpc/client.tsx` como client component com:

- `QueryClientProvider`
- `createTRPCContext<AppRouter>()`
- `createTRPCClient`
- `httpBatchLink`
- singleton de `QueryClient` no browser e instancia nova no servidor

Esse provider deve ser montado em `src/app/layout.tsx` para que client components possam usar hooks e opcoes do tRPC em qualquer rota.

### Integracao com server components

Criar `src/trpc/server.ts` com:

- `server-only`
- `createTRPCOptionsProxy`
- `cache(makeQueryClient)` para manter um query client estavel por request
- `headers()` do Next para montar o contexto server-side

Uso esperado:

- server components fazem `prefetchQuery(trpc.algumaRota.queryOptions(...))`
- o resultado e hidratado com `HydrationBoundary` + `dehydrate(queryClient)`
- client components leem a mesma query ja hidratada

### Primeiros routers da v1

#### `health`

- `health.ping`
- usado para validar bootstrap do tRPC e smoke tests

#### `leaderboard`

- `leaderboard.list`
- retorna lista paginada ou limitada para homepage e pagina completa
- busca dados reais via Drizzle

Campos minimos esperados na resposta:

- `publicId`
- `score`
- `language`
- `lineCount`
- `sourceCode`
- `createdAt`

#### `roasts`

- `roasts.bySubmissionId`
- retorna score, verdict, headline, findings e suggested fix

#### `submissions`

- `submissions.create`
- recebe `sourceCode`, `language` e `roastMode`
- persiste a submissao e retorna ids necessarios para navegar para o resultado futuro

### Camada de servicos

Para evitar regra de negocio espalhada em procedures, cada router deve delegar para servicos em `src/server/api/services`.

Exemplo de responsabilidade:

- router valida input e define contrato
- service consulta Drizzle, aplica regra e monta shape de retorno

### Integracao inicial nas paginas

#### Homepage

- manter a UI principal como client component por causa do editor
- trocar preview estatico do leaderboard por query real via tRPC
- submissao do codigo passa a usar `submissions.create`

#### `src/app/leaderboard/page.tsx`

- migrar para buscar dados reais com prefetch no server component
- usar `HydrationBoundary` para a lista inicial
- manter vantagem de SSR para indexacao e first paint

#### `src/app/results/[submissionId]/page.tsx`

- buscar dados reais do roast via tRPC no servidor
- usar o parametro da rota para chamar `roasts.bySubmissionId`
- manter metadata dinamica baseada no resultado real quando possivel

### Convencoes recomendadas

- routers pequenos e por dominio
- inputs e outputs tipados com `zod` quando houver entrada externa
- sem acesso direto ao banco dentro de componentes React
- server components usam prefetch e hidratacao; client components usam hooks/opcoes do tRPC
- evitar duplicar queries REST paralelas para os mesmos dados

## Criterios de aceite

- existe endpoint funcional em `/api/trpc`
- existe provider global do tRPC integrado ao App Router
- existe proxy server-side para uso em server components
- leaderboard consegue ser prefetched no servidor e hidratado no cliente
- pagina de resultado consegue buscar dados reais via tRPC
- homepage consegue criar submissao via mutation tipada
- contratos tipados sao compartilhados entre backend e frontend sem codigo duplicado

## Riscos

- mistura incorreta entre cliente e servidor pode quebrar hidratacao
- colocar logica de banco direto nos routers tende a acoplar demais a API
- adotar APIs antigas do tRPC para Next pode gerar setup desalinhado com App Router

## Perguntas em aberto

1. `submissions.create` deve apenas persistir a submissao na v1 ou tambem disparar imediatamente a geracao do roast?
2. o identificador publico consumido nas rotas deve ser `submissionId` interno ou `publicId`?

## To-dos de implementacao

- [ ] instalar dependencias do tRPC, React Query e `zod`
- [ ] criar `src/server/api/trpc.ts`
- [ ] criar routers iniciais e `src/server/api/root.ts`
- [ ] criar route handler em `src/app/api/trpc/[trpc]/route.ts`
- [ ] criar `src/trpc/query-client.ts`
- [ ] criar provider em `src/trpc/client.tsx`
- [ ] montar provider no `src/app/layout.tsx`
- [ ] criar `src/trpc/server.ts` para prefetch em server components
- [ ] migrar leaderboard para dados reais via tRPC + SSR
- [ ] migrar pagina de resultado para dados reais via tRPC
- [ ] integrar `submissions.create` na homepage
- [ ] adicionar smoke test manual para `health.ping`

## Referencias de documentacao

- `https://trpc.io/docs/client/tanstack-react-query/setup`
- `https://trpc.io/docs/client/tanstack-react-query/server-components`
- `https://trpc.io/docs/client/nextjs/app-router-setup`
