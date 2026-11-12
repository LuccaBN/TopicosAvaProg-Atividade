/**
 * Factory de destinos: dados + regras de negócio usados por várias seções.
 *
 * Guarda um "estado" compartilhado:
 *  - a busca e os filtros (usados pelo topo e pela galeria)
 *  - o destino em destaque (escolhido na galeria e mostrado no destaque)
 */
angular.module('rotaLivre.compartilhado').factory('DestinosService', ['DESTINOS', 'TraducaoService', function (DESTINOS, TraducaoService) {
  var POR_PAGINA = 6;

  var estado = {
    busca: '',
    regiao: 'todos',
    ordem: 'nome',
    pagina: 1,
    idDestaque: 'lisboa',
  };

  // Junta os dados fixos com os textos do idioma atual
  function traduzir(destino) {
    return angular.extend({}, destino, TraducaoService.textos().destinos[destino.id]);
  }

  // Lista com busca, filtro de região e ordenação aplicados
  function filtrados() {
    var termo = estado.busca.trim().toLowerCase();
    var local = TraducaoService.textos().local;

    return DESTINOS.map(traduzir)
      .filter(function (d) {
        return estado.regiao === 'todos' || d.regiao === estado.regiao;
      })
      .filter(function (d) {
        if (!termo) return true;
        return (d.nome + ' ' + d.resumo + ' ' + d.roteiro.join(' ')).toLowerCase().indexOf(termo) !== -1;
      })
      .sort(function (a, b) {
        if (estado.ordem === 'menor-preco') return a.preco - b.preco;
        if (estado.ordem === 'maior-preco') return b.preco - a.preco;
        if (estado.ordem === 'duracao') return b.dias - a.dias;
        return a.nome.localeCompare(b.nome, local);
      });
  }

  function destaque() {
    var destino = DESTINOS.filter(function (d) { return d.id === estado.idDestaque; })[0];
    return traduzir(destino);
  }

  function destacar(id) {
    estado.idDestaque = id;
  }

  // Ao mudar busca ou filtros, volta para a primeira página
  function voltarParaPrimeiraPagina() {
    estado.pagina = 1;
  }

  return {
    POR_PAGINA: POR_PAGINA,
    estado: estado,
    filtrados: filtrados,
    destaque: destaque,
    destacar: destacar,
    voltarParaPrimeiraPagina: voltarParaPrimeiraPagina,
  };
}]);
