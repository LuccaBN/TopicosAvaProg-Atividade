/**
 * Diretiva <paginacao>.
 * Uso:
 *   <paginacao total-paginas="totalPaginas" pagina-atual="paginaAtual"
 *              ao-mudar="irParaPagina(pagina)" textos="t.ui.paginacao"></paginacao>
 * Bindings:
 *   total-paginas → número total de páginas
 *   pagina-atual  → página selecionada (começa em 1)
 *   ao-mudar      → callback chamado com a nova página
 *   textos        → rótulos no idioma atual
 */
angular.module('rotaLivre.componentes').directive('paginacao', function () {
  return {
    restrict: 'E',
    scope: {
      totalPaginas: '<',
      paginaAtual: '<',
      aoMudar: '&',
      textos: '<',
    },
    template:
      '<nav class="pagination" aria-label="{{textos.rotulo}}" ng-if="totalPaginas > 1">' +
      '  <button type="button" class="pagination__botao" ng-click="ir(paginaAtual - 1)"' +
      '          ng-disabled="paginaAtual === 1" aria-label="{{textos.anteriorRotulo}}">{{textos.anterior}}</button>' +
      '  <ul class="pagination__lista">' +
      '    <li ng-repeat="numero in paginas()">' +
      '      <button type="button" class="pagination__botao pagination__numero"' +
      '              ng-class="{\'pagination__numero--atual\': numero === paginaAtual}"' +
      '              ng-attr-aria-current="{{numero === paginaAtual ? \'page\' : undefined}}"' +
      '              aria-label="{{textos.pagina(numero)}}" ng-click="ir(numero)">{{numero}}</button>' +
      '    </li>' +
      '  </ul>' +
      '  <button type="button" class="pagination__botao" ng-click="ir(paginaAtual + 1)"' +
      '          ng-disabled="paginaAtual === totalPaginas" aria-label="{{textos.proximaRotulo}}">{{textos.proxima}}</button>' +
      '</nav>',
    link: function (scope) {
      // Lista [1, 2, ..., totalPaginas] para o ng-repeat
      scope.paginas = function () {
        var lista = [];
        for (var i = 1; i <= scope.totalPaginas; i++) lista.push(i);
        return lista;
      };

      scope.ir = function (pagina) {
        if (pagina < 1 || pagina > scope.totalPaginas || pagina === scope.paginaAtual) return;
        scope.aoMudar({ pagina: pagina }); // avisa o controlador pai
      };
    },
  };
});
