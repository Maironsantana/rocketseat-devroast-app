# Leaderboard page design

## Objetivo

Implementar o funcionamento real da tela `src/app/leaderboard/page.tsx` com dados vindos do banco via `tRPC`, mantendo a linguagem visual do shame leaderboard da homepage e exibindo os 20 piores resultados sem paginacao.

## Contexto atual do projeto

- a homepage ja usa `tRPC` com `HydrationBoundary` e `Suspense` para leaderboard preview e metricas
- existe um service de leaderboard em `src/server/api/services/leaderboard-service.ts`, hoje focado apenas no preview de 3 itens da homepage
- a tela `src/app/leaderboard/page.tsx` ainda usa dados mockados para stats e entradas
- o comportamento de codigo colapsavel com syntax highlight ja existe em `src/app/_components/homepage-leaderboard.tsx` e `src/app/_components/homepage-leaderboard-code-preview.tsx`
- a pagina dedicada precisa continuar alinhada ao App Router server-first e ao uso de `CodeBlock` server-side

## O que precisa entregar

- query real para a pagina dedicada da leaderboard via `tRPC`
- lista com 20 resultados quando houver dados suficientes, sem paginacao
- ordenacao identica a homepage: `score asc` com desempate por `createdAt desc`
- stats reais no topo da pagina: total de entradas elegiveis e media real de score
- codigo com syntax highlight e preview colapsavel
- roast sempre visivel abaixo do codigo em cada item
- estado vazio coerente quando nao houver entradas elegiveis

## Recomendacao final

Expandir o dominio atual de leaderboard sem generalizar cedo demais:

- manter `leaderboard.homepagePreview` como contrato leve para a homepage
- adicionar uma nova query publica dedicada para a tela completa (`leaderboard.page`)
- concentrar regras de elegibilidade, ordenacao e mapeamento no service
- deixar `src/app/leaderboard/page.tsx` como wrapper server com prefetch, `HydrationBoundary` e `Suspense`
- mover a UI principal para componentes dedicados da leaderboard page, mantendo a renderizacao do `CodeBlock` no servidor e isolando no cliente apenas o estado interativo do colapsavel

Essa abordagem preserva o padrao recente do projeto, evita acoplamento indevido entre homepage e pagina dedicada, e permite evoluir a tela completa sem inflar o contrato do preview.

## Especificacao de implementacao

### Contrato de dados

Criar uma nova query publica `leaderboard.page` em `src/server/api/routers/leaderboard.ts` para a tela dedicada retornando:

- `entries`: lista com ate 20 itens, sempre limitada aos 20 piores resultados elegiveis
- `stats`: resumo agregado do conjunto elegivel

Cada item de `entries` deve incluir:

- `rank`
- `score`
- `language`
- `sourceCode`
- `roast`
- `lines`

`stats` deve incluir:

- `totalEntries`
- `averageScore`

### Regras de elegibilidade e ranking

- considerar apenas submissions com `status = completed`
- considerar apenas registros com roast e score presentes
- ordenar por `score asc`
- desempatar por `submissions.createdAt desc`
- limitar em 20 resultados
- calcular `rank` a partir da ordem final retornada
- calcular `lines` a partir do conteudo de `sourceCode`

O total e a media devem ser calculados sobre todo o conjunto elegivel antes da aplicacao do limite de 20 itens, para evitar divergencia entre o topo da pagina e o recorte exibido na lista.

### Backend e services

- manter `src/server/api/routers/leaderboard.ts` fino, apenas expondo a nova procedure publica e delegando ao service
- expandir `src/server/api/services/leaderboard-service.ts` com um fluxo especifico para a leaderboard page
- reutilizar helpers internos de mapeamento e normalizacao quando fizer sentido, sem fundir os contratos da homepage e da pagina dedicada em um unico endpoint generico
- preservar a homepage com seu fluxo atual de preview, evitando regressao no contrato ja integrado

### Integracao no App Router

- transformar `src/app/leaderboard/page.tsx` em um server wrapper sem mocks
- fazer prefetch da nova query com `trpc.leaderboard.page.queryOptions()`
- entregar o estado com `dehydrate(queryClient)` e `HydrationBoundary`
- usar `Suspense` com fallback especifico para a tela, preservando a estrutura visual durante o carregamento
- manter a route em server component e remover `export const dynamic = "force-static"`, permitindo que a pagina siga o fluxo dinamico atual do `tRPC` no App Router
- a query prefetched deve ser lida no servidor para montar a lista principal e alimentar componentes server-first; a hidratacao permanece disponivel para pequenos pontos clientes quando necessario, mas a lista nao deve depender de `useSuspenseQuery` para renderizar o `CodeBlock`

### Composicao da interface

- criar um componente dedicado server-first para renderizar a leaderboard completa com os dados ja resolvidos
- renderizar o topo da pagina com stats reais do backend no lugar dos valores mockados
- manter o layout dark, compacto e inspirado em terminal ja usado no produto
- manter a lista como uma coluna de itens, nao como tabela, para preservar a estrutura visual existente da pagina dedicada

Cada card deve mostrar:

- rank
- score
- linguagem
- numero de linhas
- bloco de codigo com syntax highlight
- roast visivel logo abaixo do codigo

### Codigo colapsavel e syntax highlight

- reaproveitar o comportamento de preview colapsavel ja usado na homepage
- o collapse deve afetar apenas o codigo
- o roast deve ficar sempre fora do colapsavel para leitura imediata
- quando o codigo tiver 6 linhas ou menos, nao mostrar trigger de expandir, reaproveitando o mesmo limite visual da homepage
- manter o highlight no servidor via `CodeBlock`, evitando migrar a renderizacao de codigo para o cliente
- o componente cliente continua restrito ao controle de abrir e fechar, recebendo `preview` e `children` ja renderizados pelo servidor, como acontece hoje na homepage

### Formatacao de valores

- `score` deve ser transportado como numero e exibido com uma casa decimal em cada card
- `stats.averageScore` deve ser transportado como numero e exibido com uma casa decimal no topo, seguido de `/10`
- `stats.totalEntries` deve ser exibido com separador de milhar no topo

### Normalizacao de linguagem

- reutilizar ou extrair a logica que converte a linguagem armazenada em uma `BundledLanguage` segura para o `CodeBlock`
- linguagens desconhecidas devem cair para `text`, sem quebrar a pagina
- essa normalizacao deve ser compartilhavel entre homepage e leaderboard page para evitar duplicacao de regras

### Estado vazio e resiliencia

- se nao houver entradas elegiveis, manter cabecalho e stats coerentes com zero
- mostrar uma mensagem de estado vazio alinhada ao tom do produto, sem cards vazios ou placeholders quebrados
- em caso de falha de leitura no backend, o service retorna estrutura vazia com `entries: []`, `stats.totalEntries = 0` e `stats.averageScore = 0`, seguindo o padrao de degradacao graciosa ja usado no service da homepage

## Fora de escopo

- paginacao
- filtros por linguagem ou score
- navegacao por periodos
- mudancas na homepage alem do necessario para reaproveitar utilitarios compartilhados
- refactors amplos fora do dominio de leaderboard

## Criterios de aceite

- `src/app/leaderboard/page.tsx` deixa de usar dados mockados
- a pagina mostra 20 resultados reais quando houver dados suficientes, ou menos apenas quando o conjunto elegivel tiver menos de 20 itens
- a ordenacao replica a regra da homepage: menor score, depois mais recente
- cada item mostra codigo com syntax highlight e roast sempre visivel
- o preview do codigo pode ser expandido e recolhido quando houver linhas suficientes
- o topo da pagina mostra total real de entradas elegiveis e media real de score
- entries sem roast ou sem score nao aparecem
- a pagina continua seguindo o fluxo server-first com `tRPC`, `HydrationBoundary` e `Suspense`
- quando nao houver dados elegiveis, a tela exibe estado vazio consistente

## Riscos

- se a regra de elegibilidade divergir entre query principal e agregados, os stats do topo podem nao bater com a lista
- duplicar a logica de normalizacao de linguagem entre homepage e pagina dedicada pode gerar inconsistencias visuais
- mover markup demais para client component pode enfraquecer o padrao server-first consolidado no projeto

## To-dos de implementacao

- [ ] adicionar query publica da leaderboard page no router
- [ ] expandir o service com leitura de 20 entradas e stats agregadas
- [ ] extrair ou compartilhar a normalizacao de linguagem para `CodeBlock`
- [ ] criar wrapper server e fallback da leaderboard page
- [ ] manter a lista em componente server-first e limitar o cliente ao wrapper de collapse
- [ ] remover mocks da route atual
- [ ] validar lint e build
