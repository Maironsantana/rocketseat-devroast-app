# DevRoast

DevRoast e um app para colar trechos de codigo e receber uma analise em tom de roast: direta, divertida e sem aliviar para maus habitos.

## O que o app faz

- permite colar ou escrever codigo em uma interface inspirada em terminal
- aplica um modo de roast para deixar o feedback mais pesado e bem-humorado
- mostra uma leaderboard com os codigos mais vergonhosos enviados pela comunidade
- transforma problemas comuns de codigo em uma experiencia mais divertida de revisar

## Experiencia do produto

O foco do DevRoast e pegar algo normalmente tecnico e deixar mais compartilhavel, visual e memoravel. Em vez de apenas apontar erros, o app brinca com os problemas do codigo sem perder a utilidade da analise.

## Contexto do projeto

Este app esta sendo construido durante o evento NLW da Rocketseat, acompanhando as aulas e evoluindo a interface e a experiencia ao longo do evento.

## Status atual

Hoje o projeto ja conta com:

- homepage com editor de codigo com syntax highlight
- deteccao automatica de linguagem com opcao de selecao manual
- limite de caracteres com fallback para plaintext e feedback visual
- componentes visuais reutilizaveis para a interface
- visual dark inspirado em terminal
- preview de leaderboard na homepage
- especificacao da feature de editor em `specs/editor-syntax-highlight-spec.md`
- base de persistencia com Postgres + Drizzle ORM
- schema, migrations e seed inicial em `src/db`
- Docker Compose e scripts de banco para ambiente local

## Proximos passos naturais

- conectar o envio do editor com o fluxo real de submissao
- persistir novas submissoes e resultados no banco via Drizzle
- integrar a camada de IA para gerar o roast de forma real
- substituir a leaderboard estatico por dados vindos do banco
- criar a tela dedicada de resultado do roast
- expandir a leaderboard com paginacao, filtros e navegacao
