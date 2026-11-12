/**
 * Controlador da página: só cuida do que é da página inteira
 * (idioma inicial, link "pular para o conteúdo" e rodapé).
 * Cada seção tem seu próprio controlador dentro da sua diretiva.
 */
angular.module('rotaLivre').controller('AppController', ['$scope', 'TraducaoService', function ($scope, TraducaoService) {
  TraducaoService.setIdioma('pt');
  TraducaoService.vincular($scope); // coloca os textos em $scope.t e atualiza ao trocar o idioma
}]);
