import './Pagination.css';

/**
 * Paginação controlada pelo componente pai.
 * Props:
 *  - totalPaginas: número total de páginas
 *  - paginaAtual: página selecionada (começa em 1)
 *  - onMudarPagina: callback chamado com o número da nova página
 *  - textos: rótulos no idioma atual (anterior, proxima, pagina(n)...)
 */
const TEXTOS_PADRAO = {
  rotulo: 'Paginação',
  anterior: '‹ Anterior',
  proxima: 'Próxima ›',
  anteriorRotulo: 'Página anterior',
  proximaRotulo: 'Próxima página',
  pagina: (n) => `Página ${n}`,
};

function Pagination({ totalPaginas, paginaAtual, onMudarPagina, textos = TEXTOS_PADRAO }) {
  if (totalPaginas <= 1) return null;

  const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);
  const ehPrimeira = paginaAtual === 1;
  const ehUltima = paginaAtual === totalPaginas;

  return (
    <nav className="pagination" aria-label={textos.rotulo}>
      <button
        type="button"
        className="pagination__botao"
        onClick={() => onMudarPagina(paginaAtual - 1)}
        disabled={ehPrimeira}
        aria-label={textos.anteriorRotulo}
      >
        {textos.anterior}
      </button>

      <ul className="pagination__lista">
        {paginas.map((numero) => (
          <li key={numero}>
            <button
              type="button"
              className={`pagination__botao pagination__numero ${numero === paginaAtual ? 'pagination__numero--atual' : ''}`}
              onClick={() => onMudarPagina(numero)}
              aria-current={numero === paginaAtual ? 'page' : undefined}
              aria-label={textos.pagina(numero)}
            >
              {numero}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        className="pagination__botao"
        onClick={() => onMudarPagina(paginaAtual + 1)}
        disabled={ehUltima}
        aria-label={textos.proximaRotulo}
      >
        {textos.proxima}
      </button>
    </nav>
  );
}

export default Pagination;
