# Homepage shame leaderboard preview

## Objetivo

Substituir o preview estatico da shame leaderboard na homepage por dados reais, exibindo os 3 piores trechos de codigo e um rodape com o total de roasts.

## Contexto atual do projeto

- a homepage ainda renderiza a leaderboard com dados mockados em `src/app/home-page-client.tsx`
- o projeto ja possui `tRPC` no App Router com o primeiro fluxo de metricas da homepage
- a homepage segue um wrapper server component em `src/app/page.tsx` e um client component para a parte interativa do editor

## O que precisa entregar

- query real para o preview da homepage via `tRPC`
- apenas 3 resultados
- ordenacao pelos piores scores
- rodape com total de roasts
- loading state com `Suspense` e skeleton
- integracao sem mover a homepage inteira para client-side

## Recomendacao final

Seguir o mesmo padrao usado nas metricas da homepage:

- server component faz prefetch da query
- `HydrationBoundary` entrega o estado ao cliente
- um client component pequeno usa `useSuspenseQuery`
- `src/app/page.tsx` monta um `Suspense` com skeleton especifico para a leaderboard

## Especificacao de implementacao

### Query

Criar `leaderboard.homepagePreview` no `tRPC` retornando:

- `entries`: lista com 3 itens
- `totalRoasts`: total de roasts concluidos usados no ranking

Cada item deve incluir:

- `rank`
- `score`
- `language`
- `sourceCode`

### Regras de dados

- considerar apenas submissions com `status = completed`
- join com `roasts`
- ordenar por `score asc`
- desempatar por `createdAt desc`
- limitar em 3 resultados

### Integracao na homepage

- remover os dados mockados da tabela da homepage
- manter a estrutura visual atual da tabela compacta
- substituir o bloco da leaderboard por um `leaderboardSlot` recebido do wrapper server
- no rodape, renderizar `showing top 3 of X roasts`

### Loading state

- criar skeleton especifico para a leaderboard preview
- usar `Suspense` perto da secao da homepage
- o skeleton deve preservar o espaco da tabela e do rodape

## Criterios de aceite

- a homepage mostra 3 resultados reais da leaderboard
- o rodape mostra o total real de roasts
- o loading usa `Suspense` com skeleton, sem texto generico
- a homepage continua com o editor em client component e os dados em fluxo server-first

## Riscos

- misturar a tabela real dentro do client component maior pode diluir o ganho de SSR
- usar dados sem filtro de `completed` pode poluir o ranking

## To-dos de implementacao

- [ ] criar query `leaderboard.homepagePreview`
- [ ] criar service para leitura do preview
- [ ] criar componentes de preview e skeleton
- [ ] integrar novo slot no wrapper da homepage
- [ ] validar lint e build
