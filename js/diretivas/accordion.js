/**
 * Diretiva <acordeao>: só um item fica aberto por vez.
 * Uso:
 *   <acordeao itens="t.faq" aberto-inicial="cancelamento"></acordeao>
 * Bindings:
 *   itens          → lista de { id, titulo, conteudo }
 *   aberto-inicial → id do item que começa aberto (texto)
 */
angular.module('rotaLivre.componentes').directive('acordeao', function () {
  return {
    restrict: 'E',
    scope: {
      itens: '<',
      abertoInicial: '@',
    },
    template:
      '<div class="accordion">' +
      '  <div class="accordion__item" ng-repeat="item in itens track by item.id"' +
      '       ng-class="{\'accordion__item--aberto\': estaAberto(item)}">' +
      '    <h3 class="accordion__cabecalho">' +
      '      <button type="button" class="accordion__botao" id="acordeao-botao-{{item.id}}"' +
      '              aria-controls="acordeao-painel-{{item.id}}" aria-expanded="{{estaAberto(item)}}"' +
      '              ng-click="alternar(item)">' +
      '        {{item.titulo}}' +
      '        <span class="accordion__icone" aria-hidden="true">+</span>' +
      '      </button>' +
      '    </h3>' +
      // o painel fica sempre no DOM para a transição suave funcionar
      '    <div class="accordion__painel" id="acordeao-painel-{{item.id}}" role="region"' +
      '         aria-labelledby="acordeao-botao-{{item.id}}" aria-hidden="{{!estaAberto(item)}}">' +
      '      <div class="accordion__conteudo"><p>{{item.conteudo}}</p></div>' +
      '    </div>' +
      '  </div>' +
      '</div>',
    link: function (scope) {
      // Estado interno da diretiva: qual item está aberto
      scope.itemAberto = scope.abertoInicial || null;

      scope.estaAberto = function (item) {
        return scope.itemAberto === item.id;
      };

      // Clicar no item aberto fecha; clicar em outro abre ele e fecha o anterior
      scope.alternar = function (item) {
        scope.itemAberto = scope.estaAberto(item) ? null : item.id;
      };
    },
  };
});
