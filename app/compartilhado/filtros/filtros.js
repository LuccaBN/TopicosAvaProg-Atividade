/**
 * Filtros para formatar dados direto no HTML, por exemplo:
 *   {{ destino.preco | moedaLocal:t.local }}
 *   {{ destino.saida | dataLocal:t.local }}
 *   ng-repeat="destino in lista | paginar:pagina:6"
 */
angular.module('rotaLivre.compartilhado')

  // Preço em reais no formato do idioma (R$ 1.290 / R$1,290)
  .filter('moedaLocal', function () {
    return function (valor, local) {
      if (valor == null || isNaN(valor)) return '';
      return Number(valor).toLocaleString(local || 'pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 0,
      });
    };
  })

  // Data ISO (2027-01-15) no formato do idioma: 15/01/2027, ou 01/15/2027 em inglês
  .filter('dataLocal', function () {
    return function (dataIso, local) {
      if (!dataIso) return '';
      // T12:00 evita que o fuso horário mude o dia
      return new Date(dataIso + 'T12:00:00').toLocaleDateString(local || 'pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };
  })

  // Corta a lista para mostrar só os itens da página atual
  .filter('paginar', function () {
    return function (lista, paginaAtual, itensPorPagina) {
      if (!angular.isArray(lista)) return lista;
      var inicio = (paginaAtual - 1) * itensPorPagina;
      return lista.slice(inicio, inicio + itensPorPagina);
    };
  });
