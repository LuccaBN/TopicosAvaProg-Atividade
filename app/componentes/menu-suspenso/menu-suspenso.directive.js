/**
 * Componente <menu-suspenso> (dropdown).
 *
 * Uso:
 *   <menu-suspenso rotulo="'Idioma'" opcoes="opcoesIdioma" valor-selecionado="idioma"
 *                  ao-selecionar="trocarIdioma(opcao)" alinhamento="direita"></menu-suspenso>
 *
 * Bindings:
 *   rotulo            (<) texto antes do valor
 *   opcoes            (<) lista de { valor, texto, aoSelecionar? } — cada opção pode ter seu callback
 *   valor-selecionado (<) valor marcado
 *   ao-selecionar     (&) callback geral, recebe a opção escolhida
 *   alinhamento       (@) 'esquerda' ou 'direita'
 */
angular.module('rotaLivre.componentes').directive('menuSuspenso', ['$document', '$timeout', function ($document, $timeout) {
  var contador = 0;

  return {
    restrict: 'E',
    scope: {
      rotulo: '<',
      opcoes: '<',
      valorSelecionado: '<',
      aoSelecionar: '&',
      alinhamento: '@',
    },
    template: `
      <div class="menu-suspenso">
        <button type="button" class="menu-suspenso__botao" aria-haspopup="listbox"
                aria-expanded="{{aberto}}" aria-controls="{{idLista}}"
                ng-click="alternar()" ng-keydown="tecladoBotao($event)">
          <span class="menu-suspenso__rotulo">{{rotulo}}:</span>
          <span>{{textoSelecionado()}}</span>
          <span class="menu-suspenso__seta" ng-class="{'menu-suspenso__seta--aberta': aberto}" aria-hidden="true">▾</span>
        </button>

        <ul class="menu-suspenso__lista menu-suspenso__lista--{{alinhamento || 'esquerda'}}" ng-if="aberto"
            id="{{idLista}}" role="listbox" tabindex="-1" aria-label="{{rotulo}}"
            aria-activedescendant="{{idLista}}-opcao-{{indiceFocado}}" ng-keydown="tecladoLista($event)">
          <li ng-repeat="opcao in opcoes track by opcao.valor" id="{{idLista}}-opcao-{{$index}}"
              role="option" class="menu-suspenso__opcao" aria-selected="{{opcao.valor === valorSelecionado}}"
              ng-class="{
                'menu-suspenso__opcao--focada': $index === indiceFocado,
                'menu-suspenso__opcao--selecionada': opcao.valor === valorSelecionado
              }"
              ng-click="selecionar(opcao)" ng-mouseenter="focar($index)">
            {{opcao.texto}}
            <span ng-if="opcao.valor === valorSelecionado" aria-hidden="true">✓</span>
          </li>
        </ul>
      </div>
    `,
    link: function (scope, elemento) {
      // Estado do componente no $scope
      scope.aberto = false;
      scope.indiceFocado = 0;
      scope.idLista = 'menu-suspenso-' + (++contador);

      scope.textoSelecionado = function () {
        var opcao = (scope.opcoes || []).filter(function (o) { return o.valor === scope.valorSelecionado; })[0];
        return opcao ? opcao.texto : '—';
      };

      scope.focar = function (indice) {
        scope.indiceFocado = indice;
      };

      function abrir() {
        var indice = scope.opcoes.map(function (o) { return o.valor; }).indexOf(scope.valorSelecionado);
        scope.indiceFocado = indice >= 0 ? indice : 0;
        scope.aberto = true;
        // espera a lista aparecer na tela para colocar o foco nela
        $timeout(function () {
          var lista = elemento[0].querySelector('[role="listbox"]');
          if (lista) lista.focus();
        });
      }

      function fechar(devolverFoco) {
        scope.aberto = false;
        if (devolverFoco) elemento[0].querySelector('.menu-suspenso__botao').focus();
      }

      scope.alternar = function () {
        scope.aberto ? fechar(false) : abrir();
      };

      scope.selecionar = function (opcao) {
        if (opcao.aoSelecionar) opcao.aoSelecionar(opcao); // callback da própria opção
        scope.aoSelecionar({ opcao: opcao }); // callback geral do componente
        fechar(true);
      };

      scope.tecladoBotao = function (evento) {
        if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
          evento.preventDefault();
          abrir();
        }
      };

      scope.tecladoLista = function (evento) {
        var total = scope.opcoes.length;
        if (evento.key === 'ArrowDown') { evento.preventDefault(); scope.indiceFocado = (scope.indiceFocado + 1) % total; }
        else if (evento.key === 'ArrowUp') { evento.preventDefault(); scope.indiceFocado = (scope.indiceFocado - 1 + total) % total; }
        else if (evento.key === 'Enter' || evento.key === ' ') { evento.preventDefault(); scope.selecionar(scope.opcoes[scope.indiceFocado]); }
        else if (evento.key === 'Escape') { evento.preventDefault(); fechar(true); }
        else if (evento.key === 'Tab') { fechar(false); }
      };

      // Fecha ao clicar fora do componente
      function cliqueFora(evento) {
        if (scope.aberto && !elemento[0].contains(evento.target)) {
          scope.$apply(function () { fechar(false); }); // evento de fora do AngularJS precisa de $apply
        }
      }
      $document.on('mousedown', cliqueFora);

      // Limpeza: remove o evento quando o componente sai da tela
      scope.$on('$destroy', function () {
        $document.off('mousedown', cliqueFora);
      });
    },
  };
}]);
