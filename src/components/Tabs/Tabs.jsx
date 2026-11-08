import { useRef, useState } from 'react';
import './Tabs.css';

/**
 * Abas.
 * Props:
 *  - abas: [{ id, titulo, conteudo }]  (conteudo pode ser qualquer JSX)
 *  - rotulo: descrição do grupo de abas para leitores de tela
 */
function Tabs({ abas, rotulo }) {
  const [abaAtiva, setAbaAtiva] = useState(abas[0].id);
  const refsBotoes = useRef([]);

  // Setas esquerda/direita, Home e End trocam de aba (padrão de acessibilidade WAI-ARIA)
  function tratarTeclado(evento, indice) {
    const total = abas.length;
    let novoIndice = null;

    if (evento.key === 'ArrowRight') novoIndice = (indice + 1) % total;
    if (evento.key === 'ArrowLeft') novoIndice = (indice - 1 + total) % total;
    if (evento.key === 'Home') novoIndice = 0;
    if (evento.key === 'End') novoIndice = total - 1;

    if (novoIndice !== null) {
      evento.preventDefault();
      setAbaAtiva(abas[novoIndice].id);
      refsBotoes.current[novoIndice].focus();
    }
  }

  return (
    <div className="tabs">
      <div className="tabs__lista" role="tablist" aria-label={rotulo}>
        {abas.map((aba, indice) => {
          const ativa = aba.id === abaAtiva;
          return (
            <button
              key={aba.id}
              ref={(el) => (refsBotoes.current[indice] = el)}
              type="button"
              role="tab"
              id={`aba-${aba.id}`}
              aria-selected={ativa}
              aria-controls={`painel-${aba.id}`}
              tabIndex={ativa ? 0 : -1}
              className={`tabs__aba ${ativa ? 'tabs__aba--ativa' : ''}`}
              onClick={() => setAbaAtiva(aba.id)}
              onKeyDown={(e) => tratarTeclado(e, indice)}
            >
              {aba.titulo}
            </button>
          );
        })}
      </div>

      {abas.map((aba) => (
        <div
          key={aba.id}
          role="tabpanel"
          id={`painel-${aba.id}`}
          aria-labelledby={`aba-${aba.id}`}
          hidden={aba.id !== abaAtiva}
          tabIndex={0}
          className="tabs__painel"
        >
          {aba.conteudo}
        </div>
      ))}
    </div>
  );
}

export default Tabs;
