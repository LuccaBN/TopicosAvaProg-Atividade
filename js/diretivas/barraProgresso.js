/**
 * Diretiva <barra-progresso>.
 * Uso:
 *   <barra-progresso valor="progressoReserva" rotulo="'Etapa 1 de 4'"></barra-progresso>
 * Bindings:
 *   valor              → número de 0 a 100
 *   rotulo             → texto que descreve a tarefa
 *   mostrar-percentual → exibe o número (padrão: sim)
 */
angular.module('rotaLivre.componentes').directive('barraProgresso', function () {
  return {
    restrict: 'E',
    scope: {
      valor: '<',
      rotulo: '<',
      mostrarPercentual: '<?',
    },
    template:
      '<div class="progress">' +
      '  <div class="progress__topo">' +
      '    <span class="progress__rotulo">{{rotulo}}</span>' +
      '    <span class="progress__valor" ng-if="mostrarPercentual !== false">{{percentual()}}%</span>' +
      '  </div>' +
      '  <div class="progress__trilho" role="progressbar" aria-label="{{rotulo}}"' +
      '       aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{percentual()}}">' +
      '    <div class="progress__barra" ng-class="{\'progress__barra--completa\': percentual() === 100}"' +
      '         ng-style="{width: percentual() + \'%\'}"></div>' +
      '  </div>' +
      '</div>',
    link: function (scope) {
      // Garante um número inteiro entre 0 e 100
      scope.percentual = function () {
        var numero = Number(scope.valor) || 0;
        return Math.round(Math.min(100, Math.max(0, numero)));
      };
    },
  };
});
