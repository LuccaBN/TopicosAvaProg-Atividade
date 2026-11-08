import { formatarData, formatarPreco } from '../../utils/formatar.js';
import './DestinoItem.css';

/**
 * Linha da lista de pacotes (componente de apoio, usado com a Paginação).
 * Props:
 *  - destino: dados do pacote já com os textos no idioma atual
 *  - textos: rótulos do card no idioma atual
 *  - selo: nome da etiqueta (Nacional / Internacional)
 *  - local: idioma para formatar preço e data (ex.: 'pt-BR')
 *  - selecionado, onEscolher
 */
function DestinoItem({ destino, textos, selo, local, selecionado, onEscolher }) {
  const esgotado = destino.vagas === 0;

  return (
    <article className={`destino-item ${selecionado ? 'destino-item--selecionado' : ''}`}>
      <img src={destino.imagem} alt={destino.alt} className="destino-item__imagem" width="600" height="400" />

      <div className="destino-item__info">
        <div className="destino-item__topo">
          <h3 className="destino-item__titulo">{destino.nome}</h3>
          <span className={`selo selo--${destino.regiao}`}>{selo}</span>
        </div>
        <p className="destino-item__resumo">{destino.resumo}</p>
        <ul className="destino-item__meta" aria-label={textos.infoRotulo}>
          <li>🗓 {textos.saida} {formatarData(destino.saida, local)}</li>
          <li>⏱ {textos.dias(destino.dias)}</li>
          <li className={esgotado ? 'texto-erro' : ''}>
            {esgotado ? `✕ ${textos.esgotado}` : `👤 ${textos.vagas(destino.vagas)}`}
          </li>
        </ul>
      </div>

      <div className="destino-item__acao">
        <span className="destino-item__preco">
          <small>{textos.aPartirDe}</small>
          {formatarPreco(destino.preco, local)}
        </span>
        <button
          type="button"
          className={`botao ${selecionado ? 'botao--primario' : 'botao--suave'}`}
          onClick={() => onEscolher(destino)}
          aria-pressed={selecionado}
          aria-label={textos.escolherRotulo(destino.nome)}
        >
          {selecionado ? textos.escolhido : textos.escolher}
        </button>
      </div>
    </article>
  );
}

export default DestinoItem;
