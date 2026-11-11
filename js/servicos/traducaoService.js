/**
 * Serviço de tradução: guarda o idioma atual e entrega os textos dele.
 * Como serviços são únicos (singleton), qualquer parte do app enxerga o mesmo idioma.
 */
angular.module('rotaLivre.servicos').service('TraducaoService', ['TRADUCOES', function (TRADUCOES) {
  var idiomaAtual = 'pt';

  this.idiomasDisponiveis = ['pt', 'en', 'es'];

  this.getIdioma = function () {
    return idiomaAtual;
  };

  this.setIdioma = function (idioma) {
    if (TRADUCOES[idioma]) {
      idiomaAtual = idioma;
      document.documentElement.lang = TRADUCOES[idioma].local; // leitores de tela usam o lang
    }
  };

  // Textos do idioma atual (ou de outro, se informado)
  this.textos = function (idioma) {
    return TRADUCOES[idioma || idiomaAtual];
  };
}]);
