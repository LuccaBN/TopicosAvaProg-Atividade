/**
 * Módulo principal da aplicação.
 * Ele junta os módulos menores: dados, serviços, filtros e componentes (diretivas).
 */
(function () {
  'use strict';

  // Módulos de cada parte (criados aqui para garantir a ordem de carregamento)
  angular.module('rotaLivre.dados', []);
  angular.module('rotaLivre.servicos', ['rotaLivre.dados']);
  angular.module('rotaLivre.filtros', []);
  angular.module('rotaLivre.componentes', []);

  // Módulo principal, usado em ng-app="rotaLivre" no index.html
  angular.module('rotaLivre', [
    'rotaLivre.dados',
    'rotaLivre.servicos',
    'rotaLivre.filtros',
    'rotaLivre.componentes',
  ]);
})();
