# Rota Livre Viagens — React

Aplicação web responsiva da agência de viagens fictícia **Rota Livre**, feita para a **atividade de React.js** (Tópicos Avançados de Programação — UCSal).

Usa o mesmo tema e os mesmos destinos da versão em Bootstrap, mas com outro visual (verde-água e coral) e organizada como um **planejador de viagem**: você escolhe o pacote, vê os detalhes e conclui a reserva em etapas. Foi feita com **React 19 + Vite** e estilizada com **CSS puro**.

## Como executar

```bash
npm install
npm run dev
```

No Codespaces, quando aparecer o aviso da porta **5173**, clique em **Abrir no navegador**. Também dá para abrir pela aba **Portas**.

## Estrutura

```
src/
├── App.jsx              → componente principal: guarda o estado e orquestra os demais
├── main.jsx             → ponto de entrada (renderiza o App)
├── index.css / App.css  → cores e layout responsivo
├── data/destinos.js     → dados fixos dos destinos (preço, data, vagas)
├── data/traducoes.js    → todos os textos em português, inglês e espanhol
├── utils/formatar.js    → formata preço e data conforme o idioma
└── components/
    ├── Accordion/       → acordeão (perguntas frequentes)
    ├── Pagination/      → paginação (lista de destinos)
    ├── ProgressBar/     → barra de progresso
    ├── Tabs/            → abas (detalhes do destino)
    ├── Dropdown/        → menu suspenso (idioma, filtro, ordenação)
    ├── Toast/           → notificações temporárias
    └── DestinoItem/     → linha da lista de pacotes (componente de apoio)
```

## Componentes

| # | Componente | Onde aparece | Props | State / Hooks |
|---|------------|--------------|-------|---------------|
| 1 | **Accordion** | *Perguntas frequentes* | `itens`, `abertoInicial` | `useState` guarda o item aberto (só um por vez). A transição é suave, feita com CSS |
| 2 | **Pagination** | Abaixo da lista de pacotes (4 por página) | `totalPaginas`, `paginaAtual`, `onMudarPagina` | Controlada pelo `App`. Anterior/Próxima ficam desabilitados nas pontas, e a página atual leva `aria-current` |
| 3 | **ProgressBar** | Painel *Sua reserva* | `valor` (0–100), `rotulo`, `mostrarPercentual` | A largura muda conforme o `valor`. Mostra as etapas da reserva (Avançar/Voltar) e o envio simulado do documento (`useEffect` + `setInterval`) |
| 4 | **Tabs** | *Pacote escolhido* | `abas`, `rotulo` | `useState` guarda a aba ativa e `useRef` controla o foco. Navega com as setas do teclado |
| 5 | **Dropdown** | Cabeçalho (idioma) e filtros da lista | `rotulo`, `opcoes`, `valorSelecionado`, `onSelecionar`, `alinhamento` | `useState` controla se está aberto. `useEffect` fecha ao clicar fora. Cada opção pode ter seu próprio callback (`aoSelecionar`) |
| 6 | **Toast** | Canto inferior da tela | `tipo`, `mensagem`, `duracao`, `onFechar` | `useEffect` + `setTimeout` faz a notificação sumir sozinha. Tipos: sucesso, erro e info |

### Onde cada toast aparece

- **Sucesso:** ao confirmar a reserva de um pacote com vagas ou terminar o envio do documento.
- **Erro:** ao tentar confirmar a reserva de **Fernando de Noronha**, que está esgotado.
- **Info:** ao trocar o idioma (a mensagem já aparece no idioma novo) ou escolher um pacote.

## Idiomas (PT / EN / ES)

O menu **Idioma**, no topo, troca a página inteira: menus, botões, destinos, roteiros, perguntas, toasts e até o formato de data e preço.

- O `App` guarda o idioma no state (`useState('pt')`).
- O `App` pega os textos daquele idioma em `traducoes.js` e passa para os componentes por **props**. Exemplos: `textos` na Paginação, `titulos` no Toast e `rotulo` no Dropdown.
- Um `useEffect` atualiza o `lang` do `<html>`, para o leitor de tela pronunciar no idioma certo.

## Conceitos de React usados

- **Componentes funcionais:** todos os componentes.
- **Props:** dados e callbacks passados do `App` para os filhos, como `onMudarPagina`, `onSelecionar` e `onFechar`.
- **State:** idioma, filtros, página, pacote escolhido, etapa da reserva e toasts.
- **Hooks:** `useState`, `useEffect`, `useRef` (nas abas e no dropdown), `useCallback` e `useId`.
- **Eventos:** `onClick`, `onChange`, `onKeyDown` e `onMouseEnter`.
- **Renderização de listas:** `map` com `key`.
- **Renderização condicional:** destino esgotado, botões desabilitados e lista do dropdown.

## Responsividade

- **Celular:** tudo em uma coluna, pacotes com a imagem em cima e abas com rolagem lateral.
- **Tablet:** pacotes com a imagem ao lado do texto.
- **Desktop:** lista de pacotes e painel *Sua reserva* lado a lado. O painel fica fixo ao rolar.

## Acessibilidade

- Tags semânticas: `header`, `nav`, `main`, `section`, `article`, `footer` e `address`.
- Padrões ARIA:
  - **Abas:** `tablist`, `tab` e `tabpanel`.
  - **Dropdown:** `listbox`, `option` e `aria-activedescendant`.
  - **Barra de progresso:** `progressbar`.
  - **Acordeão:** `aria-expanded` e `aria-controls`.
  - **Toasts:** `aria-live`, `role="status"` e `role="alert"`.
- Tudo funciona pelo teclado: setas, Enter, Esc e Home/End.
- Link "Pular para o conteúdo" e contorno de foco visível.
- Respeita a preferência de reduzir animações (`prefers-reduced-motion`).
