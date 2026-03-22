# Homepage leaderboard collapsible code preview

## Objetivo

Melhorar a coluna de codigo da shame leaderboard da homepage para mostrar syntax highlight com `CodeBlock`, mantendo o estado fechado compacto com 6 linhas e permitindo expandir o restante.

## Contexto atual do projeto

- a homepage ja usa dados reais para o preview da leaderboard
- hoje a coluna de codigo renderiza o texto bruto completo dentro da tabela
- o projeto ja possui `CodeBlock` server-side com Shiki e usa Base UI para primitivos interativos

## O que precisa entregar

- syntax highlight na coluna de codigo da homepage
- estado fechado limitado a 6 linhas
- botao de expandir e recolher para codigos maiores
- uso de Base UI para o comportamento de collapsible
- manter a homepage em fluxo server-first

## Recomendacao final

Renderizar o highlight no servidor com `CodeBlock` e delegar apenas o estado aberto/fechado para um client component pequeno com `@base-ui/react/collapsible`.

## Especificacao de implementacao

### Renderizacao do codigo

- usar `CodeBlock` na homepage em uma variante embutida, sem chrome
- no estado fechado, renderizar apenas as 6 primeiras linhas do codigo
- no estado aberto, renderizar o bloco completo

### Colapsavel

- criar um componente cliente pequeno para o toggle
- usar `Collapsible.Root`, `Collapsible.Trigger` e `Collapsible.Panel`
- esconder o trigger quando o codigo tiver 6 linhas ou menos

### UX

- texto do trigger: `show more` e `show less`
- manter a tabela compacta quando fechado
- preservar legibilidade e responsividade da tabela

## Criterios de aceite

- a homepage mostra codigo com syntax highlight na leaderboard
- linhas longas ficam compactas no estado fechado
- codigos com mais de 6 linhas podem ser expandidos e recolhidos
- o comportamento usa Base UI e nao move o highlight para o cliente

## Riscos

- duplicar preview e codigo completo aumenta um pouco o custo de highlight, mas o preview tem apenas 3 itens
- uma variante inadequada do `CodeBlock` pode deixar a tabela visualmente pesada

## To-dos de implementacao

- [ ] ajustar `CodeBlock` para uso embutido
- [ ] criar wrapper colapsavel para o preview
- [ ] integrar o novo comportamento na homepage
- [ ] validar lint e build
