/**
 * Componente <toast-container>: mostra as notificações guardadas no ToastService.
 *
 * Uso (uma vez na página):
 *   <toast-container titulos="t.ui.toast.titulos" rotulo-fechar="t.ui.toast.fechar"></toast-container>
 *
 * Bindings:
 *   titulos       (<) títulos de cada tipo no idioma atual ({ sucesso, erro, info })
 *   rotulo-fechar (<) texto do botão de fechar para leitores de tela
 */
angular.module('rotaLivre.componentes').directive('toastContainer', ['ToastService', function (ToastService) {
  var ICONES = { sucesso: '✓', erro: '✕', info: 'i' };

  return {
    restrict: 'E',
    scope: {
      titulos: '<',
      rotuloFechar: '<',
    },
    template: `
      <div class="toasts" aria-live="polite">
        <div class="toast toast--{{toast.tipo}}" ng-repeat="toast in toasts track by toast.id"
             ng-attr-role="{{toast.tipo === 'erro' ? 'alert' : 'status'}}">
          <span class="toast__icone" aria-hidden="true">{{icone(toast.tipo)}}</span>
          <div class="toast__texto">
            <strong>{{titulos[toast.tipo]}}</strong>
            <p>{{toast.mensagem}}</p>
          </div>
          <button type="button" class="toast__fechar" aria-label="{{rotuloFechar}}" ng-click="fechar(toast.id)">×</button>
          <span class="toast__tempo" aria-hidden="true" ng-style="{'animation-duration': toast.duracao + 'ms'}"></span>
        </div>
      </div>
    `,
    link: function (scope) {
      // A lista é a mesma do serviço: quando o serviço muda, a tela muda junto
      scope.toasts = ToastService.lista;
      scope.fechar = ToastService.fechar;
      scope.icone = function (tipo) {
        return ICONES[tipo];
      };
    },
  };
}]);
