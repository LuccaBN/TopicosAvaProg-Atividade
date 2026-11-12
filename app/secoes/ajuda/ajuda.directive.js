/**
 * Seção <ajuda>: perguntas frequentes.
 * Usa o componente <acordeao>; as perguntas vêm do arquivo do idioma atual (t.faq).
 */
angular.module('rotaLivre.secoes').directive('ajuda', function () {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <section id="ajuda" class="secao ajuda" aria-labelledby="titulo-ajuda">
        <h2 id="titulo-ajuda">{{t.ui.ajuda.titulo}}</h2>
        <p class="texto-suave">{{t.ui.ajuda.texto}}</p>
        <acordeao itens="t.faq" aberto-inicial="cancelamento"></acordeao>
      </section>
    `,
    controller: ['$scope', 'TraducaoService', function ($scope, TraducaoService) {
      TraducaoService.vincular($scope);
    }],
  };
});
