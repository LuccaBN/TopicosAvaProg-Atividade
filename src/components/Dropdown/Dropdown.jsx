import { useEffect, useId, useRef, useState } from 'react';
import './Dropdown.css';

/**
 * Menu suspenso de seleção.
 * Props:
 *  - rotulo: texto do botão (ex.: "Região")
 *  - opcoes: [{ valor, texto, aoSelecionar? }]  — cada opção pode ter seu próprio callback
 *  - valorSelecionado: valor da opção marcada
 *  - onSelecionar: callback geral, recebe a opção escolhida
 *  - alinhamento: 'esquerda' | 'direita' (lado em que a lista abre)
 */
function Dropdown({ rotulo, opcoes, valorSelecionado, onSelecionar, alinhamento = 'esquerda' }) {
  const [aberto, setAberto] = useState(false);
  const [indiceFocado, setIndiceFocado] = useState(0);
  const refContainer = useRef(null);
  const refBotao = useRef(null);
  const refLista = useRef(null);
  const idBase = useId();

  const opcaoAtual = opcoes.find((o) => o.valor === valorSelecionado);

  // Fecha ao clicar fora do componente
  useEffect(() => {
    if (!aberto) return;

    function cliqueFora(evento) {
      if (refContainer.current && !refContainer.current.contains(evento.target)) {
        setAberto(false);
      }
    }
    document.addEventListener('mousedown', cliqueFora);
    // Limpeza: remove o ouvinte quando o menu fecha ou o componente sai da tela
    return () => document.removeEventListener('mousedown', cliqueFora);
  }, [aberto]);

  // Ao abrir, leva o foco para a lista (para navegar com o teclado)
  useEffect(() => {
    if (aberto) refLista.current?.focus();
  }, [aberto]);

  function abrir() {
    const indiceAtual = opcoes.findIndex((o) => o.valor === valorSelecionado);
    setIndiceFocado(indiceAtual >= 0 ? indiceAtual : 0);
    setAberto(true);
  }

  function fechar() {
    setAberto(false);
    refBotao.current?.focus();
  }

  function selecionar(opcao) {
    opcao.aoSelecionar?.(opcao); // callback da própria opção, se houver
    onSelecionar?.(opcao); // callback geral do componente
    fechar();
  }

  function tecladoBotao(evento) {
    if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
      evento.preventDefault();
      abrir();
    }
  }

  function tecladoLista(evento) {
    switch (evento.key) {
      case 'ArrowDown':
        evento.preventDefault();
        setIndiceFocado((i) => (i + 1) % opcoes.length);
        break;
      case 'ArrowUp':
        evento.preventDefault();
        setIndiceFocado((i) => (i - 1 + opcoes.length) % opcoes.length);
        break;
      case 'Enter':
      case ' ':
        evento.preventDefault();
        selecionar(opcoes[indiceFocado]);
        break;
      case 'Escape':
        evento.preventDefault();
        fechar();
        break;
      case 'Tab':
        setAberto(false);
        break;
      default:
        break;
    }
  }

  return (
    <div className="dropdown" ref={refContainer}>
      <button
        type="button"
        ref={refBotao}
        className="dropdown__botao"
        aria-haspopup="listbox"
        aria-expanded={aberto}
        aria-controls={`${idBase}-lista`}
        onClick={() => (aberto ? setAberto(false) : abrir())}
        onKeyDown={tecladoBotao}
      >
        <span className="dropdown__rotulo">{rotulo}:</span>
        <span>{opcaoAtual ? opcaoAtual.texto : 'Selecione'}</span>
        <span className={`dropdown__seta ${aberto ? 'dropdown__seta--aberta' : ''}`} aria-hidden="true">▾</span>
      </button>

      {aberto && (
        <ul
          id={`${idBase}-lista`}
          ref={refLista}
          role="listbox"
          tabIndex={-1}
          aria-label={rotulo}
          aria-activedescendant={`${idBase}-opcao-${indiceFocado}`}
          className={`dropdown__lista dropdown__lista--${alinhamento}`}
          onKeyDown={tecladoLista}
        >
          {opcoes.map((opcao, indice) => {
            const selecionada = opcao.valor === valorSelecionado;
            return (
              <li
                key={opcao.valor}
                id={`${idBase}-opcao-${indice}`}
                role="option"
                aria-selected={selecionada}
                className={`dropdown__opcao ${indice === indiceFocado ? 'dropdown__opcao--focada' : ''} ${selecionada ? 'dropdown__opcao--selecionada' : ''}`}
                onClick={() => selecionar(opcao)}
                onMouseEnter={() => setIndiceFocado(indice)}
              >
                {opcao.texto}
                {selecionada && <span aria-hidden="true">✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Dropdown;
