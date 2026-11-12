/**
 * Seção <destaque>: o destino escolhido, com imagem grande, abas e reserva.
 * Usa os componentes <abas> e <aba>.
 */
angular.module('rotaLivre.secoes').directive('destaque', function () {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <section id="destaque" class="destaque" aria-labelledby="titulo-destaque">
        <div class="destaque__banner">
          <img ng-src="{{destino.imagem}}" alt="{{destino.alt}}">
          <div class="destaque__legenda">
            <p class="sobretitulo">{{t.ui.destaque.sobretitulo}}</p>
            <h2 id="titulo-destaque">{{destino.nome}}</h2>
            <span class="selo selo--{{destino.regiao}}">{{t.ui.selo[destino.regiao]}}</span>
          </div>
        </div>

        <div class="destaque__info">
          <abas rotulo="t.ui.destaque.rotuloAbas(destino.nome)" reiniciar-quando="destino.id">
            <aba titulo="{{t.ui.destaque.abas.visao}}">
              <p>{{destino.resumo}}</p>
              <dl class="destaque__ficha">
                <div><dt>{{t.ui.destaque.ficha.saida}}</dt><dd>{{destino.saida | dataLocal:t.local}}</dd></div>
                <div><dt>{{t.ui.destaque.ficha.duracao}}</dt><dd>{{t.ui.item.dias(destino.dias)}}</dd></div>
                <div><dt>{{t.ui.destaque.ficha.vagas}}</dt><dd>{{destino.vagas === 0 ? t.ui.item.esgotado : destino.vagas}}</dd></div>
              </dl>
            </aba>
            <aba titulo="{{t.ui.destaque.abas.roteiro}}">
              <ol class="destaque__roteiro">
                <li ng-repeat="dia in destino.roteiro track by $index">
                  <span>{{t.ui.destaque.dia($index + 1)}}</span>{{dia}}
                </li>
              </ol>
            </aba>
            <aba titulo="{{t.ui.destaque.abas.incluso}}">
              <ul class="destaque__incluso">
                <li ng-repeat="item in destino.incluso track by $index">{{item}}</li>
              </ul>
            </aba>
            <aba titulo="{{t.ui.destaque.abas.dicas}}">
              <p class="destaque__dica">💡 {{destino.dicas}}</p>
            </aba>
          </abas>

          <!-- Reserva: viajantes com ng-model, total recalculado na hora -->
          <div class="destaque__reserva">
            <div class="destaque__valor">
              <strong>{{destino.preco | moedaLocal:t.local}}</strong>
              <span>{{t.ui.destaque.porPessoa}}</span>
            </div>
            <div class="destaque__viajantes">
              <label for="campo-viajantes">{{t.ui.destaque.viajantes}}</label>
              <input id="campo-viajantes" type="number" min="1" max="10" ng-model="reserva.viajantes">
            </div>
            <div class="destaque__valor destaque__valor--total">
              <span>{{t.ui.destaque.total}}</span>
              <strong>{{precoTotal() | moedaLocal:t.local}}</strong>
            </div>
            <button type="button" class="botao botao--destaque" ng-click="reservar()">{{t.ui.destaque.reservar}}</button>
          </div>
        </div>
      </section>
    `,
    controller: ['$scope', 'TraducaoService', 'DestinosService', 'ToastService',
      function ($scope, TraducaoService, DestinosService, ToastService) {
        TraducaoService.vincular($scope);
        $scope.reserva = { viajantes: 2 };
        $scope.destino = DestinosService.destaque();

        // Atualiza o destino quando muda o destaque ou o idioma
        $scope.$watchGroup(
          [function () { return DestinosService.estado.idDestaque; }, TraducaoService.getIdioma],
          function () { $scope.destino = DestinosService.destaque(); }
        );

        $scope.precoTotal = function () {
          return $scope.destino.preco * ($scope.reserva.viajantes || 0);
        };

        $scope.reservar = function () {
          var viajantes = Number($scope.reserva.viajantes);
          var mensagens = $scope.t.mensagens;

          if (!viajantes || viajantes < 1 || viajantes > 10) {
            ToastService.mostrar('erro', mensagens.viajantesInvalido);
          } else if ($scope.destino.vagas === 0) {
            ToastService.mostrar('erro', mensagens.semVagas($scope.destino.nome));
          } else {
            ToastService.mostrar('sucesso', mensagens.confirmada($scope.destino.nome, viajantes));
          }
        };
      },
    ],
  };
});
