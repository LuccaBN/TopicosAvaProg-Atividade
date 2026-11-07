# Rota Livre Viagens — Bootstrap 5

Página responsiva de uma agência de viagens fictícia, feita para a **Atividade Bootstrap e Tailwind CSS** (Tópicos Avançados de Programação — UCSal).

## Como executar

1. Abra a pasta no VS Code (ou no GitHub Codespaces).
2. Abra o `index.html` com a extensão **Live Server**, ou direto no navegador.

O Bootstrap e os ícones já estão na pasta `vendor/`, então a página funciona sem internet.

## Estrutura

```
index.html        → página (header, main com 4 sections, footer)
style.css         → poucos ajustes visuais próprios
script.js         → JavaScript nativo (modal e formulário)
img/              → logo e ilustrações dos destinos (SVG)
vendor/           → Bootstrap 5.3.3 e Bootstrap Icons
```

## Componentes

| # | Componente | Onde está | O que tem |
|---|------------|-----------|-----------|
| 1 | **Navbar** | Topo da página | Logo, 4 links, botão "Reserve já" e menu hambúrguer (`navbar-expand-lg` + `collapse`) em telas menores |
| 2 | **Carrossel** | Seção *Início* | 3 slides (Rio, Paris, Tóquio), botões anterior/próximo, indicadores, transição `carousel-fade` e auto-play a cada 5 s |
| 3 | **Cards** | Seção *Destinos* | 6 cards com imagem, etiqueta, título, descrição, preço e botão. Grid `row-cols-1 row-cols-md-2 row-cols-lg-3` (1, 2 ou 3 colunas) |
| 4 | **Tabela** | Seção *Pacotes* | 7 linhas de saídas, cabeçalho com `scope`, `table-striped`, `table-hover` e `table-responsive` (rolagem horizontal no celular) |
| 5 | **Formulário** | Seção *Reserva* | 7 campos + aceite dos termos, todos com `label`. Validação HTML5 (`required`, `type="email"`, `pattern`, `min`/`max`) com o visual `was-validated` do Bootstrap |
| 6 | **Modal** | Botões "Detalhes" e envio do formulário | Modal de detalhes (preenchido com os `data-*` do card) e modal de confirmação da reserva. Tem overlay escuro e fecha ao clicar fora |

## Responsividade

- **Celular:** menu hambúrguer, 1 card por linha, tabela com rolagem e campos do formulário empilhados.
- **Tablet:** 2 cards por linha e formulário em 2 colunas.
- **Desktop:** menu aberto, 3 cards por linha e carrossel mais alto.

## Acessibilidade

- Tags semânticas: `header`, `nav`, `main`, `section`, `article`, `footer` e `address`.
- Link "Pular para o conteúdo" para quem navega pelo teclado.
- `aria-label`, `aria-controls`, `aria-expanded`, `aria-labelledby` e `aria-current` na navbar, no carrossel, nas seções e nos modais.
- Texto alternativo (`alt`) em todas as imagens e `caption` na tabela.
- O foco vai para o primeiro campo com erro no formulário.
- Respeita a preferência de reduzir animações (`prefers-reduced-motion`).

## Tecnologias

- HTML5
- Bootstrap 5.3.3
- Bootstrap Icons 1.11.3
- JavaScript nativo
