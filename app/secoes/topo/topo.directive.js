/**
 * Seção <topo>: saudação e campo de busca.
 * A busca usa ng-model ligado ao estado compartilhado do DestinosService,
 * então a galeria (outra seção) filtra enquanto a pessoa digita.
 */
angular.module('rotaLivre.secoes').directive('topo', function () {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <div class="topo">
        <div>
          <h1>{{t.ui.saudacao.titulo}}</h1>
          <p class="texto-suave">{{t.ui.saudacao.texto}}</p>
        </div>
        <div class="topo__busca">
          <label for="campo-busca">{{t.ui.busca.rotulo}}</label>
          <input id="campo-busca" type="search" autocomplete="off"
                 ng-model="estado.busca" ng-change="aoBuscar()"
                 placeholder="{{t.ui.busca.placeholder}}">
        </div>
      </div>
    `,
    controller: ['$scope', 'TraducaoService', 'DestinosService', function ($scope, TraducaoService, DestinosService) {
      TraducaoService.vincular($scope);
      $scope.estado = DestinosService.estado; // two-way binding com ng-model

      $scope.aoBuscar = function () {
        DestinosService.voltarParaPrimeiraPagina();
      };
    }],
  };
});
