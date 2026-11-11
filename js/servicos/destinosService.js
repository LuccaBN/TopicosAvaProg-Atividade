/**
 * Factory de destinos: concentra a lógica de negócio da lista de pacotes
 * (traduzir, buscar, filtrar e ordenar).
 */
angular.module('rotaLivre.servicos').factory('DestinosService', ['DESTINOS', 'TraducaoService', function (DESTINOS, TraducaoService) {

  // Junta os dados fixos com os textos do idioma atual
  function listarTraduzidos() {
    var textos = TraducaoService.textos();
    return DESTINOS.map(function (destino) {
      return angular.extend({}, destino, textos.destinos[destino.id]);
    });
  }

  function buscarPorId(id) {
    return listarTraduzidos().filter(function (destino) {
      return destino.id === id;
    })[0];
  }

  // Aplica busca por texto, filtro de região e ordenação
  function pesquisar(opcoes) {
    var termo = (opcoes.busca || '').trim().toLowerCase();
    var local = TraducaoService.textos().local;

    return listarTraduzidos()
      .filter(function (destino) {
        return opcoes.regiao === 'todos' || destino.regiao === opcoes.regiao;
      })
      .filter(function (destino) {
        if (!termo) return true;
        var texto = (destino.nome + ' ' + destino.resumo + ' ' + destino.roteiro.join(' ')).toLowerCase();
        return texto.indexOf(termo) !== -1;
      })
      .sort(function (a, b) {
        if (opcoes.ordem === 'menor-preco') return a.preco - b.preco;
        if (opcoes.ordem === 'maior-preco') return b.preco - a.preco;
        if (opcoes.ordem === 'duracao') return b.dias - a.dias;
        return a.nome.localeCompare(b.nome, local);
      });
  }

  return {
    listarTraduzidos: listarTraduzidos,
    buscarPorId: buscarPorId,
    pesquisar: pesquisar,
  };
}]);
