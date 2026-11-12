/**
 * Seção <explorar>: galeria de destinos com filtro, ordenação e paginação.
 * Usa os componentes <menu-suspenso> e <paginacao>.
 */
angular.module('rotaLivre.secoes').directive('explorar', function () {
  var VALORES_REGIAO = ['todos', 'nacional', 'internacional'];
  var VALORES_ORDEM = ['nome', 'menor-preco', 'maior-preco', 'duracao'];

  return {
    restrict: 'E',
    scope: {},
    template: `
      <section id="explorar" class="secao" aria-labelledby="titulo-explorar">
        <div class="secao__topo">
          <div>
            <h2 id="titulo-explorar">{{t.ui.explorar.titulo}}</h2>
            <p class="texto-suave">{{t.ui.explorar.contagem(destinos.length)}}</p>
          </div>
          <div class="explorar__filtros">
            <menu-suspenso rotulo="t.ui.explorar.mostrar" opcoes="opcoesRegiao"
                           valor-selecionado="estado.regiao" ao-selecionar="filtrar('regiao', opcao)"></menu-suspenso>
            <menu-suspenso rotulo="t.ui.explorar.ordenar" opcoes="opcoesOrdem"
                           valor-selecionado="estado.ordem" ao-selecionar="filtrar('ordem', opcao)"
                           alinhamento="direita"></menu-suspenso>
          </div>
        </div>

        <div class="explorar__galeria">
          <!-- o filtro "paginar" mostra só os destinos da página atual -->
          <article class="cartao-destino" ng-class="{'cartao-destino--destaque': destino.id === estado.idDestaque}"
                   ng-repeat="destino in destinos | paginar:estado.pagina:porPagina track by destino.id">
            <div class="cartao-destino__imagem">
              <img ng-src="{{destino.imagem}}" alt="{{destino.alt}}" width="600" height="400">
              <span class="cartao-destino__preco">{{t.ui.item.aPartirDe}} {{destino.preco | moedaLocal:t.local}}</span>
              <span class="cartao-destino__marca" ng-if="destino.id === estado.idDestaque">★ {{t.ui.explorar.emDestaque}}</span>
            </div>
            <div class="cartao-destino__corpo">
              <span class="selo selo--{{destino.regiao}}">{{t.ui.selo[destino.regiao]}}</span>
              <h3>{{destino.nome}}</h3>
              <p>{{destino.resumo}}</p>
            </div>
            <div class="cartao-destino__rodape">
              <span ng-class="{'texto-erro': destino.vagas === 0}">
                {{t.ui.item.dias(destino.dias)}} ·
                {{destino.vagas === 0 ? t.ui.item.esgotado : t.ui.item.vagas(destino.vagas)}}
              </span>
              <button type="button" class="botao botao--contorno" ng-click="verDestino(destino)"
                      aria-label="{{t.ui.explorar.verRotulo(destino.nome)}}">{{t.ui.explorar.ver}}</button>
            </div>
          </article>
        </div>

        <p class="explorar__vazio" ng-if="destinos.length === 0">{{t.ui.busca.nenhum}}</p>

        <paginacao total-paginas="totalPaginas()" pagina-atual="estado.pagina"
                   ao-mudar="irParaPagina(pagina)" textos="t.ui.paginacao"></paginacao>
      </section>
    `,
    controller: ['$scope', 'TraducaoService', 'DestinosService', 'ToastService',
      function ($scope, TraducaoService, DestinosService, ToastService) {
        TraducaoService.vincular($scope);
        $scope.estado = DestinosService.estado;
        $scope.porPagina = DestinosService.POR_PAGINA;

        // Opções dos menus montadas com os textos do idioma atual
        $scope.$watch('t', function (t) {
          if (!t) return;
          $scope.opcoesRegiao = VALORES_REGIAO.map(function (valor) {
            return { valor: valor, texto: t.ui.explorar.regiao[valor] };
          });
          $scope.opcoesOrdem = VALORES_ORDEM.map(function (valor) {
            return { valor: valor, texto: t.ui.explorar.ordem[valor] };
          });
        });

        // Recalcula a lista quando a busca, os filtros ou o idioma mudam
        $scope.$watchGroup(
          [
            function () { return DestinosService.estado.busca; },
            function () { return DestinosService.estado.regiao; },
            function () { return DestinosService.estado.ordem; },
            TraducaoService.getIdioma,
          ],
          function () { $scope.destinos = DestinosService.filtrados(); }
        );

        $scope.totalPaginas = function () {
          return Math.max(1, Math.ceil(($scope.destinos || []).length / $scope.porPagina));
        };

        // campo = 'regiao' ou 'ordem'
        $scope.filtrar = function (campo, opcao) {
          DestinosService.estado[campo] = opcao.valor;
          DestinosService.voltarParaPrimeiraPagina();
        };

        // Callback passado para o componente <paginacao>
        $scope.irParaPagina = function (pagina) {
          DestinosService.estado.pagina = pagina;
        };

        // Coloca o destino no topo, em destaque
        $scope.verDestino = function (destino) {
          DestinosService.destacar(destino.id);
          ToastService.mostrar('info', $scope.t.mensagens.destaque(destino.nome));
          var topo = document.getElementById('destaque');
          if (topo) topo.scrollIntoView({ behavior: 'smooth', block: 'start' });
        };
      },
    ],
  };
});
