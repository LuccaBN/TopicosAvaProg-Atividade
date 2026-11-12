/**
 * Componente <acordeao>: só um item fica aberto por vez.
 *
 * Uso:
 *   <acordeao itens="t.faq" aberto-inicial="cancelamento"></acordeao>
 *
 * Bindings:
 *   itens          (<) lista de { id, titulo, conteudo }
 *   aberto-inicial (@) id do item que começa aberto
 */
angular.module('rotaLivre.componentes').directive('acordeao', function () {
  return {
    restrict: 'E',
    scope: {
      itens: '<',
      abertoInicial: '@',
    },
    template: `
      <div class="acordeao">
        <div class="acordeao__item" ng-repeat="item in itens track by item.id"
             ng-class="{'acordeao__item--aberto': estaAberto(item)}">
          <h3 class="acordeao__cabecalho">
            <button type="button" class="acordeao__botao"
                    id="acordeao-botao-{{item.id}}" aria-controls="acordeao-painel-{{item.id}}"
                    aria-expanded="{{estaAberto(item)}}" ng-click="alternar(item)">
              {{item.titulo}}
              <span class="acordeao__icone" aria-hidden="true">+</span>
            </button>
          </h3>

          <!-- o painel fica sempre na página para a transição suave funcionar -->
          <div class="acordeao__painel" id="acordeao-painel-{{item.id}}" role="region"
               aria-labelledby="acordeao-botao-{{item.id}}" aria-hidden="{{!estaAberto(item)}}">
            <div class="acordeao__conteudo"><p>{{item.conteudo}}</p></div>
          </div>
        </div>
      </div>
    `,
    link: function (scope) {
      // Estado do componente: qual item está aberto
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
