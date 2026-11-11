/**
 * Diretivas <abas> e <aba> (trabalham juntas).
 * Uso:
 *   <abas rotulo="'Detalhes do pacote'" reiniciar-quando="destino.id">
 *     <aba titulo="{{t.ui.detalhes.abas.visao}}"> ...conteúdo... </aba>
 *     <aba titulo="{{t.ui.detalhes.abas.roteiro}}"> ...conteúdo... </aba>
 *   </abas>
 *
 * <abas> guarda no seu $scope qual aba está ativa.
 * Cada <aba> se registra no controlador da diretiva <abas> (require: '^^abas').
 */
angular.module('rotaLivre.componentes')

  .directive('abas', ['$timeout', function ($timeout) {
    var contador = 0;

    return {
      restrict: 'E',
      transclude: true,
      scope: {
        rotulo: '<',
        reiniciarQuando: '<?', // quando este valor muda, volta para a primeira aba
      },
      template:
        '<div class="tabs">' +
        '  <div class="tabs__lista" role="tablist" aria-label="{{rotulo}}">' +
        '    <button type="button" role="tab" class="tabs__aba" ng-repeat="aba in abas"' +
        '            id="{{aba.idAba}}" aria-controls="{{aba.idPainel}}"' +
        '            aria-selected="{{aba.ativa}}" tabindex="{{aba.ativa ? 0 : -1}}"' +
        '            ng-class="{\'tabs__aba--ativa\': aba.ativa}"' +
        '            ng-click="selecionar(aba)" ng-keydown="teclado($event, $index)">{{aba.titulo}}</button>' +
        '  </div>' +
        '  <div ng-transclude></div>' +
        '</div>',
      controller: ['$scope', '$element', function ($scope, $element) {
        $scope.abas = [];
        var prefixo = 'abas-' + (++contador);

        // Chamado por cada <aba> quando ela é criada
        this.registrar = function (aba) {
          aba.idAba = prefixo + '-aba-' + $scope.abas.length;
          aba.idPainel = prefixo + '-painel-' + $scope.abas.length;
          aba.ativa = $scope.abas.length === 0; // a primeira começa ativa
          $scope.abas.push(aba);
        };

        $scope.selecionar = function (abaEscolhida) {
          $scope.abas.forEach(function (aba) {
            aba.ativa = aba === abaEscolhida;
          });
        };

        // Setas, Home e End trocam de aba (padrão de acessibilidade)
        $scope.teclado = function (evento, indice) {
          var total = $scope.abas.length;
          var novo = null;
          if (evento.key === 'ArrowRight') novo = (indice + 1) % total;
          if (evento.key === 'ArrowLeft') novo = (indice - 1 + total) % total;
          if (evento.key === 'Home') novo = 0;
          if (evento.key === 'End') novo = total - 1;
          if (novo === null) return;

          evento.preventDefault();
          $scope.selecionar($scope.abas[novo]);
          $timeout(function () {
            $element[0].querySelectorAll('[role="tab"]')[novo].focus();
          });
        };

        // Ao trocar de pacote, volta para a primeira aba
        $scope.$watch('reiniciarQuando', function (novoValor, valorAntigo) {
          if (novoValor !== valorAntigo && $scope.abas.length) $scope.selecionar($scope.abas[0]);
        });
      }],
    };
  }])

  .directive('aba', function () {
    return {
      restrict: 'E',
      require: '^^abas',
      transclude: true,
      scope: {
        titulo: '@',
      },
      template:
        '<div role="tabpanel" class="tabs__painel" id="{{aba.idPainel}}" aria-labelledby="{{aba.idAba}}"' +
        '     tabindex="0" ng-show="aba.ativa" ng-transclude></div>',
      link: function (scope, elemento, atributos, abasCtrl) {
        // O objeto "aba" é compartilhado com a diretiva pai
        scope.aba = { titulo: scope.titulo };
        abasCtrl.registrar(scope.aba);

        // O título pode mudar (ex.: troca de idioma)
        atributos.$observe('titulo', function (valor) {
          scope.aba.titulo = valor;
        });
      },
    };
  });
