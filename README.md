# Central do Viajante — Rota Livre (AngularJS)

Aplicação web responsiva da agência de viagens fictícia **Rota Livre**, feita para a **atividade de AngularJS** (Tópicos Avançados de Programação — UCSal).

É uma **Central do Viajante** com cara de aplicativo: menu lateral, destino em destaque, galeria de destinos, checklist com envio de documentos e central de ajuda. Foi feita com **AngularJS 1.8** e CSS puro, organizada **por componentes**: cada componente e cada seção têm a própria pasta, com o JavaScript (lógica e template), o CSS e os dados dela.

## Como executar

Não precisa instalar nada: o AngularJS já está na pasta `vendor/`.

- **No Codespaces:** clique com o botão direito no `index.html` e escolha **Open with Live Server**.
- **No computador:** abra o `index.html` direto no navegador.

## Estrutura

```
index.html                     → monta a página com as seções
vendor/angular.min.js          → AngularJS 1.8.3
img/                           → logo e ilustrações
app/
├── app.module.js              → cria os módulos (vem antes de tudo)
├── app.controller.js          → controlador da página (idioma inicial, rodapé)
├── app.css                    → cores, botões e estrutura geral
│
├── compartilhado/             → usado por todo o app
│   ├── destinos/
│   │   ├── destinos.data.js       → dados dos destinos (preço, data, vagas)
│   │   └── destinos.service.js    → busca, filtros, ordenação e destaque
│   ├── traducao/
│   │   ├── traducao.service.js    → idioma atual e textos
│   │   └── idiomas/ pt.js · en.js · es.js
│   └── filtros/filtros.js         → moedaLocal, dataLocal e paginar
│
├── componentes/               → os 6 componentes da atividade (reutilizáveis)
│   ├── acordeao/          acordeao.directive.js        + acordeao.css
│   ├── paginacao/         paginacao.directive.js       + paginacao.css
│   ├── barra-progresso/   barra-progresso.directive.js + barra-progresso.css
│   ├── abas/              abas.directive.js            + abas.css
│   ├── menu-suspenso/     menu-suspenso.directive.js   + menu-suspenso.css
│   └── toast/             toast.service.js + toast.directive.js + toast.css
│
└── secoes/                    → partes da página, montadas com os componentes
    ├── menu-lateral/      menu-lateral.directive.js + .css   (usa <menu-suspenso>)
    ├── topo/              topo.directive.js + .css           (busca com ng-model)
    ├── destaque/          destaque.directive.js + .css       (usa <abas>)
    ├── explorar/          explorar.directive.js + .css       (usa <menu-suspenso> e <paginacao>)
    ├── minha-viagem/      minha-viagem.directive.js + .data.js + .css (usa <barra-progresso>)
    └── ajuda/             ajuda.directive.js + .css          (usa <acordeao>)
```

**Como ler:**
- **Componentes** são peças genéricas: recebem tudo por bindings e não sabem nada de viagens, então podem ir para qualquer outro projeto.
- **Seções** são as partes da página. Cada seção tem seu template, seu controlador e seu CSS, e monta a tela usando os componentes.
- **Compartilhado** é o que várias seções usam: dados, serviços, textos e filtros.

### Módulos

| Módulo | O que tem |
|--------|-----------|
| `rotaLivre` | Módulo principal (`ng-app`), junta os outros três |
| `rotaLivre.compartilhado` | Dados, `TraducaoService`, `DestinosService` e filtros |
| `rotaLivre.componentes` | As 6 diretivas e o `ToastService` |
| `rotaLivre.secoes` | As seções da página |

## Componentes (diretivas)

| # | Diretiva | Usada em | Bindings | Como funciona |
|---|----------|----------|----------|---------------|
| 1 | `<acordeao>` | Ajuda | `itens` (`<`), `aberto-inicial` (`@`) | Guarda no `scope` qual item está aberto, então só um fica aberto por vez. A transição é suave, feita com CSS |
| 2 | `<paginacao>` | Explorar (6 por página) | `total-paginas`, `pagina-atual` (`<`), `ao-mudar` (`&`), `textos` (`<`) | Gera os botões das páginas. Anterior/Próxima ficam com `ng-disabled` nas pontas. Chama `ao-mudar({pagina})` |
| 3 | `<barra-progresso>` | Minha viagem | `valor`, `rotulo` (`<`), `mostrar-percentual` (`<?`) | A largura muda com `ng-style` conforme o valor de 0 a 100. Aparece no checklist, em cada documento e no total |
| 4 | `<abas>` + `<aba>` | Destaque | `rotulo`, `reiniciar-quando` (`<`) / `titulo` (`@`) | `<abas>` guarda a aba ativa no seu `$scope`. Cada `<aba>` se registra no pai (`require: '^^abas'`) e recebe o conteúdo por transclusão. Navega com as setas do teclado |
| 5 | `<menu-suspenso>` | Menu lateral e Explorar | `rotulo`, `opcoes`, `valor-selecionado` (`<`), `ao-selecionar` (`&`), `alinhamento` (`@`) | `scope.aberto` controla a visibilidade. Fecha ao escolher ou ao clicar fora (`$document` + `$apply`, com limpeza no `$destroy`). Cada opção pode ter seu próprio callback |
| 6 | `<toast-container>` + `ToastService` | Página inteira | `titulos`, `rotulo-fechar` (`<`) | O serviço guarda as notificações e usa `$timeout` para apagá-las em 4 segundos. A diretiva só exibe a lista. Tipos: sucesso, erro e info |

### Onde cada toast aparece

- **Info:** ao trocar o idioma ou clicar em *Ver destino*.
- **Sucesso:** ao reservar, completar o checklist ou terminar o envio de cada documento.
- **Erro:** ao reservar **Fernando de Noronha** (esgotado) ou informar um número de viajantes inválido.

## Conceitos de AngularJS usados

- **Módulos:** quatro, criados no `app.module.js`.
- **Controladores:** o `AppController` da página e um controlador dentro de cada seção, sempre usando o `$scope`.
- **Diretivas:**
  - escopo isolado com bindings `<` (dado), `@` (texto) e `&` (callback);
  - `template`, `link` e `controller`;
  - `transclude` e `require` nas abas.
- **Two-way data binding com `ng-model`:**
  - **Busca (topo):** muda o estado do `DestinosService`, e a galeria (outra seção) filtra na hora.
  - **Viajantes (destaque):** recalcula o total da reserva.
  - **Checklist (minha viagem):** cada checkbox muda `item.feito`, e a barra de progresso acompanha.
- **Serviços e factories:**
  - `TraducaoService` guarda o idioma e os textos;
  - `DestinosService` guarda as regras dos destinos e o estado compartilhado entre as seções;
  - `ToastService` guarda as notificações.
- **Filtros:**
  - `moedaLocal` formata o preço;
  - `dataLocal` formata a data;
  - `paginar` corta a lista no `ng-repeat`;
  - o filtro nativo `uppercase` aparece no ícone dos arquivos.
- **Eventos:** `ng-click`, `ng-change`, `ng-keydown` e `ng-mouseenter`.
- **Watchers:** `$watch` e `$watchGroup` atualizam as seções quando o idioma ou os filtros mudam.
- **Serviços do AngularJS:** `$timeout`, `$interval` e `$document`.

## Idiomas (PT / EN / ES)

Os textos de cada idioma ficam num arquivo próprio, em `app/compartilhado/traducao/idiomas/`. Cada seção chama `TraducaoService.vincular($scope)` para receber os textos em `$scope.t` e se atualizar sozinha quando o idioma muda.

## Responsividade

- **Celular:** o menu lateral vira uma barra presa no topo, com os links rolando para o lado. O destaque fica com a imagem em cima, e a galeria em 1 coluna.
- **Tablet:** a galeria fica em 2 colunas.
- **Desktop:** o menu lateral fica fixo à esquerda. O destaque fica com a imagem ao lado das abas, e a galeria em 3 colunas.

## Acessibilidade

- Tags semânticas: `header`, `nav`, `main`, `section`, `article` e `footer`.
- Padrões ARIA:
  - **Abas:** `tablist`, `tab` e `tabpanel`.
  - **Menu suspenso:** `listbox`, `option` e `aria-activedescendant`.
  - **Barra de progresso:** `progressbar`.
  - **Acordeão:** `aria-expanded` e `aria-controls`.
  - **Toasts:** `aria-live` e `role="alert"`.
- Tudo funciona pelo teclado: setas, Enter, Esc e Home/End.
- O `lang` e o título da página mudam junto com o idioma.
