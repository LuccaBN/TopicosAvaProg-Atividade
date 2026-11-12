/**
 * Seção <menu-lateral>: logo, links da página e troca de idioma.
 * No desktop fica fixo à esquerda; no celular vira uma barra no topo.
 */
angular.module('rotaLivre.secoes').directive('menuLateral', function () {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <header class="menu-lateral">
        <a href="#destaque" class="menu-lateral__logo">
          <img src="img/logo.svg" alt="" width="38" height="38">
          <span>Rota<strong>Livre</strong></span>
        </a>

        <nav class="menu-lateral__nav" aria-label="{{t.ui.menuPrincipal}}">
          <ul>
            <li><a href="#destaque"><span aria-hidden="true">★</span>{{t.ui.menu.destaque}}</a></li>
            <li><a href="#explorar"><span aria-hidden="true">◎</span>{{t.ui.menu.explorar}}</a></li>
            <li><a href="#viagem"><span aria-hidden="true">✈</span>{{t.ui.menu.viagem}}</a></li>
            <li><a href="#ajuda"><span aria-hidden="true">?</span>{{t.ui.menu.ajuda}}</a></li>
          </ul>
        </nav>

        <div class="menu-lateral__idioma">
          <menu-suspenso rotulo="t.ui.idioma" opcoes="opcoesIdioma" valor-selecionado="idioma()"
                         ao-selecionar="trocarIdioma(opcao)"></menu-suspenso>
        </div>
      </header>
    `,
    controller: ['$scope', 'TraducaoService', 'ToastService', function ($scope, TraducaoService, ToastService) {
      var NOMES = { pt: '🇧🇷 Português', en: '🇺🇸 English', es: '🇪🇸 Español' };

      TraducaoService.vincular($scope);
      $scope.idioma = TraducaoService.getIdioma;

      // Cada opção tem seu próprio callback: a mensagem já sai no idioma escolhido
      $scope.opcoesIdioma = TraducaoService.idiomasDisponiveis.map(function (codigo) {
        return {
          valor: codigo,
          texto: NOMES[codigo],
          aoSelecionar: function () {
            ToastService.mostrar('info', TraducaoService.textos(codigo).mensagens.idiomaAlterado);
          },
        };
      });

      $scope.trocarIdioma = function (opcao) {
        TraducaoService.setIdioma(opcao.valor);
      };
    }],
  };
});
