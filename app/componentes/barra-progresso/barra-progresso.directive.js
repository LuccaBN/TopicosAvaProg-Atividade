/**
 * Componente <barra-progresso>.
 *
 * Uso:
 *   <barra-progresso valor="progresso" rotulo="'Enviando…'"></barra-progresso>
 *
 * Bindings:
 *   valor              (<)  número de 0 a 100
 *   rotulo             (<)  texto que descreve a tarefa
 *   mostrar-percentual (<?) mostra o número ao lado (padrão: sim)
 */
angular.module('rotaLivre.componentes').directive('barraProgresso', function () {
  return {
    restrict: 'E',
    scope: {
      valor: '<',
      rotulo: '<',
      mostrarPercentual: '<?',
    },
    template: `
      <div class="barra-progresso">
        <div class="barra-progresso__topo">
          <span class="barra-progresso__rotulo">{{rotulo}}</span>
          <span class="barra-progresso__valor" ng-if="mostrarPercentual !== false">{{percentual()}}%</span>
        </div>
        <div class="barra-progresso__trilho" role="progressbar" aria-label="{{rotulo}}"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="{{percentual()}}">
          <div class="barra-progresso__barra"
               ng-class="{'barra-progresso__barra--completa': percentual() === 100}"
               ng-style="{width: percentual() + '%'}"></div>
        </div>
      </div>
    `,
    link: function (scope) {
      // Garante um número inteiro entre 0 e 100
      scope.percentual = function () {
        var numero = Number(scope.valor) || 0;
        return Math.round(Math.min(100, Math.max(0, numero)));
      };
    },
  };
});
