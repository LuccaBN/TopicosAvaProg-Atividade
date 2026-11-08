import { useState } from 'react';
import './Accordion.css';

/**
 * Acordeão: só um item fica aberto por vez.
 * Props:
 *  - itens: [{ id, titulo, conteudo }]
 *  - abertoInicial: id do item que começa aberto (opcional)
 */
function Accordion({ itens, abertoInicial = null }) {
  const [itemAberto, setItemAberto] = useState(abertoInicial);

  function alternarItem(id) {
    // Clicar no item aberto fecha; clicar em outro abre ele e fecha o anterior
    setItemAberto((atual) => (atual === id ? null : id));
  }

  return (
    <div className="accordion">
      {itens.map((item) => {
        const aberto = itemAberto === item.id;
        const idBotao = `acordeao-botao-${item.id}`;
        const idPainel = `acordeao-painel-${item.id}`;

        return (
          <div key={item.id} className={`accordion__item ${aberto ? 'accordion__item--aberto' : ''}`}>
            <h3 className="accordion__cabecalho">
              <button
                type="button"
                id={idBotao}
                className="accordion__botao"
                aria-expanded={aberto}
                aria-controls={idPainel}
                onClick={() => alternarItem(item.id)}
              >
                {item.titulo}
                <span className="accordion__icone" aria-hidden="true">+</span>
              </button>
            </h3>

            {/* O painel fica sempre no DOM para permitir a transição suave */}
            <div
              id={idPainel}
              role="region"
              aria-labelledby={idBotao}
              className="accordion__painel"
              inert={!aberto}
            >
              <div className="accordion__conteudo">
                <p>{item.conteudo}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
