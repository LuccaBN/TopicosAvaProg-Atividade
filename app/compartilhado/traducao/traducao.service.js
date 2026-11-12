/**
 * Serviço de tradução: guarda o idioma atual e entrega os textos dele.
 * Os textos de cada idioma ficam em idiomas/pt.js, en.js e es.js.
 * Como o serviço é único (singleton), todas as seções enxergam o mesmo idioma.
 */
angular.module('rotaLivre.compartilhado').service('TraducaoService', [
  'TEXTOS_PT', 'TEXTOS_EN', 'TEXTOS_ES',
  function (TEXTOS_PT, TEXTOS_EN, TEXTOS_ES) {
    var idiomas = { pt: TEXTOS_PT, en: TEXTOS_EN, es: TEXTOS_ES };
    var idiomaAtual = 'pt';

    this.idiomasDisponiveis = Object.keys(idiomas);

    this.getIdioma = function () {
      return idiomaAtual;
    };

    this.setIdioma = function (idioma) {
      if (!idiomas[idioma]) return;
      idiomaAtual = idioma;
      document.documentElement.lang = idiomas[idioma].local; // leitores de tela usam o lang
      document.title = idiomas[idioma].ui.tituloPagina;
    };

    // Textos do idioma atual (ou de outro, se informado)
    this.textos = function (idioma) {
      return idiomas[idioma || idiomaAtual];
    };

    // Coloca os textos em $scope.t e mantém atualizado quando o idioma muda.
    // Usado por todas as seções: TraducaoService.vincular($scope);
    this.vincular = function (scope) {
      var servico = this;
      scope.$watch(servico.getIdioma, function () {
        scope.t = servico.textos();
      });
    };
  },
]);
