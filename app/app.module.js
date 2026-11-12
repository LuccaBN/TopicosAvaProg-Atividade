/**
 * Módulos da aplicação.
 *
 *  rotaLivre                → módulo principal (ng-app), junta todos os outros
 *  ├── rotaLivre.compartilhado → dados, serviços e filtros usados por todo o app
 *  ├── rotaLivre.componentes   → os 6 componentes reutilizáveis (diretivas)
 *  └── rotaLivre.secoes        → as seções da página, montadas com os componentes
 *
 * Os módulos são criados aqui, antes de qualquer outro arquivo,
 * para que cada arquivo só precise "se registrar" no seu módulo.
 */
(function () {
  'use strict';

  angular.module('rotaLivre.compartilhado', []);
  angular.module('rotaLivre.componentes', []);
  angular.module('rotaLivre.secoes', ['rotaLivre.compartilhado', 'rotaLivre.componentes']);

  angular.module('rotaLivre', [
    'rotaLivre.compartilhado',
    'rotaLivre.componentes',
    'rotaLivre.secoes',
  ]);
})();
