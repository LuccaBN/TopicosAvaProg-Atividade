# Central do Viajante — Rota Livre (AngularJS)

Aplicação web responsiva da agência de viagens fictícia **Rota Livre**, feita para a **atividade de AngularJS** (Tópicos Avançados de Programação — UCSal).

Usa o mesmo tema das outras versões, mas com outra proposta: uma **Central do Viajante** com cara de aplicativo. Tem menu lateral, destino em destaque, galeria de destinos, checklist com envio de documentos e central de ajuda. Foi feita com **AngularJS 1.8** (módulos, controlador, serviços, factories, filtros e **6 componentes como diretivas**) e CSS puro.

## Como executar

Não precisa instalar nada: o AngularJS já está na pasta `vendor/`.

- **No Codespaces:** clique com o botão direito no `index.html` e escolha **Open with Live Server**.
- **No computador:** abra o `index.html` direto no navegador.

## Estrutura

```
index.html                         → página (usa as diretivas como tags HTML)
css/estilo.css                     → estilos e responsividade
vendor/angular.min.js              → AngularJS 1.8.3
img/                               → logo e ilustrações dos destinos
js/
├── app.js                         → módulo principal: junta os outros módulos
├── dados/
│   ├── destinos.js                → constant DESTINOS (preço, data, vagas)
│   └── traducoes.js               → constant TRADUCOES (textos em PT, EN e ES)
├── servicos/
│   ├── traducaoService.js         → service: idioma atual e textos
│   ├── destinosService.js         → factory: busca, filtro e ordenação dos destinos
│   └── toastService.js            → factory: lista de notificações com $timeout
├── filtros/filtros.js             → filtros moedaLocal, dataLocal e paginar
├── controladores/
│   └── principalController.js     → controlador da página ($scope)
└── diretivas/                     → os 6 componentes
    ├── accordion.js               → <acordeao>
    ├── paginacao.js               → <paginacao>
    ├── barraProgresso.js          → <barra-progresso>
    ├── abas.js                    → <abas> e <aba>
    ├── menuSuspenso.js            → <menu-suspenso>
    └── toast.js                   → <toast-container>
```

### Módulos

| Módulo | O que tem |
|--------|-----------|
| `rotaLivre` | Módulo principal (`ng-app`), depende de todos os outros |
| `rotaLivre.dados` | Constantes `DESTINOS` e `TRADUCOES` |
| `rotaLivre.servicos` | `TraducaoService`, `DestinosService` e `ToastService` |
| `rotaLivre.filtros` | Filtros `moedaLocal`, `dataLocal` e `paginar` |
| `rotaLivre.componentes` | As diretivas |

## Componentes (diretivas)

| # | Diretiva | Onde aparece | Bindings | Como funciona |
|---|----------|--------------|----------|---------------|
| 1 | `<acordeao>` | *Central de ajuda* | `itens` (`<`), `aberto-inicial` (`@`) | Guarda no `scope` qual item está aberto, então só um fica aberto por vez. A transição é suave, feita com CSS |
| 2 | `<paginacao>` | Abaixo da galeria (6 destinos por página) | `total-paginas` (`<`), `pagina-atual` (`<`), `ao-mudar` (`&`), `textos` (`<`) | Gera os botões das páginas. Anterior/Próxima ficam com `ng-disabled` nas pontas. Chama `ao-mudar({pagina})` para avisar o controlador |
| 3 | `<barra-progresso>` | *Minha viagem* | `valor` (`<`), `rotulo` (`<`), `mostrar-percentual` (`<?`) | A largura muda com `ng-style` conforme o valor de 0 a 100. Aparece no checklist, em cada documento e no total enviado (`$interval`) |
| 4 | `<abas>` + `<aba>` | *Destino em destaque* | `rotulo`, `reiniciar-quando` / `titulo` (`@`) | `<abas>` guarda a aba ativa no seu `$scope`. Cada `<aba>` se registra no controlador do pai (`require: '^^abas'`) e recebe o conteúdo por transclusão. Navega com as setas do teclado |
| 5 | `<menu-suspenso>` | Idioma (menu lateral), *Mostrar* e *Ordenar* | `rotulo`, `opcoes`, `valor-selecionado` (`<`), `ao-selecionar` (`&`), `alinhamento` (`@`) | `scope.aberto` controla a visibilidade. Fecha ao escolher ou ao clicar fora (`$document` + `$apply`, com limpeza no `$destroy`). Cada opção pode ter seu próprio callback |
| 6 | `<toast-container>` + `ToastService` | Topo da tela | `titulos`, `rotulo-fechar` (`<`) | O serviço guarda as notificações e usa `$timeout` para apagá-las em 4 segundos. A diretiva só exibe a lista. Tipos: sucesso, erro e info |

### Onde cada toast aparece

- **Info:** ao trocar o idioma ou clicar em *Ver destino*.
- **Sucesso:** ao reservar, completar o checklist ou terminar o envio de cada documento.
- **Erro:** ao reservar **Fernando de Noronha** (esgotado) ou informar um número de viajantes inválido.

## Conceitos de AngularJS usados

- **Módulos:** `angular.module(...)`, com o módulo principal no `app.js`.
- **Controlador:** o `PrincipalController` coloca dados e funções no `$scope`.
- **Diretivas:**
  - escopo isolado com bindings `<` (dado), `@` (texto) e `&` (callback);
  - `template`, `link` e `controller`;
  - `transclude` e `require` nas abas.
- **Two-way data binding com `ng-model`:**
  - **Buscar destino:** filtra a galeria enquanto você digita.
  - **Viajantes:** recalcula o total da reserva na hora.
  - **Checklist:** cada checkbox muda `item.feito`, e a barra de progresso acompanha.
- **Serviços e factories:** guardam o idioma, as regras da lista de destinos e as notificações.
- **Filtros:**
  - `{{ preco | moedaLocal:t.local }}` formata o preço;
  - `{{ saida | dataLocal:t.local }}` formata a data;
  - `ng-repeat="d in destinos | paginar:paginaAtual:6"` corta a lista para a página atual;
  - o filtro nativo `uppercase` aparece no ícone dos arquivos.
- **Eventos:** `ng-click`, `ng-change`, `ng-keydown` e `ng-mouseenter`.
- **Outras diretivas nativas:** `ng-repeat`, `ng-if`, `ng-show`, `ng-class`, `ng-style`, `ng-disabled` e `ng-src`.
- **Serviços do AngularJS:** `$timeout`, `$interval` e `$document`.

## Idiomas (PT / EN / ES)

O menu **Idioma**, no menu lateral, troca a página inteira: textos, destinos, perguntas, toasts e o formato de data e preço. O `TraducaoService` guarda o idioma atual, e o controlador coloca os textos em `$scope.t`.

## Responsividade

- **Celular:** o menu lateral vira uma barra no topo, com os links rolando para o lado. O destaque fica com a imagem em cima, e a galeria em 1 coluna.
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
- O `lang` da página muda junto com o idioma.
