# Guia de specs

Crie um spec em `specs/` antes de implementar qualquer feature nova.

## Quando criar

- toda feature nova
- refactors grandes que mudam arquitetura ou contrato
- integracoes novas com infra, banco ou APIs

## Nome do arquivo

- usar kebab-case
- terminar com `-spec.md`
- descrever a feature, exemplo: `editor-syntax-highlight-spec.md`

## Estrutura minima

Todo spec deve ter, nesta ordem:

1. `# Titulo`
2. `## Objetivo`
3. `## Contexto atual do projeto` ou equivalente
4. `## O que precisa entregar` ou `## Escopo`
5. `## Recomendacao final` ou decisao proposta
6. `## Especificacao de implementacao`
7. `## Criterios de aceite`
8. `## Riscos`, `## Perguntas em aberto` e `## To-dos de implementacao` quando fizer sentido

## Como escrever

- ser direto, pratico e orientado a decisao
- documentar o por que e o que sera feito, nao so ideias soltas
- registrar escopo da v1 e o que fica fora
- preferir listas e secoes curtas
- manter alinhamento com o produto atual e os componentes existentes

## Resultado esperado

O spec deve deixar claro:

- problema
- abordagem escolhida
- impacto tecnico
- passos de implementacao
- como validar a entrega
