/**
 * Seção <minha-viagem>: checklist e envio de documentos.
 * Usa o componente <barra-progresso> no checklist, em cada documento e no total.
 */
angular.module('rotaLivre.secoes').directive('minhaViagem', function () {
  return {
    restrict: 'E',
    scope: {},
    template: `
      <section id="viagem" class="secao" aria-labelledby="titulo-viagem">
        <h2 id="titulo-viagem">{{t.ui.viagem.titulo}}</h2>

        <div class="minha-viagem">
          <!-- Checklist: cada checkbox usa ng-model e a barra acompanha -->
          <div class="minha-viagem__painel">
            <h3>{{t.ui.viagem.checklistTitulo}}</h3>
            <barra-progresso valor="progressoChecklist()"
                             rotulo="t.ui.viagem.checklistProgresso(tarefasFeitas(), checklist.length)"></barra-progresso>
            <ul class="minha-viagem__checklist">
              <li ng-repeat="item in checklist track by item.id">
                <label>
                  <input type="checkbox" ng-model="item.feito" ng-change="aoMarcarItem()">
                  <span>{{t.ui.viagem.checklist[item.id]}}</span>
                </label>
              </li>
            </ul>
          </div>

          <!-- Documentos: cada um com sua barra de progresso -->
          <div class="minha-viagem__painel">
            <div class="minha-viagem__cabecalho">
              <h3>{{t.ui.viagem.documentosTitulo}}</h3>
              <button type="button" class="botao botao--primario botao--pequeno"
                      ng-click="enviarTodos()" ng-disabled="todosEnviados()">{{t.ui.viagem.enviarTodos}}</button>
            </div>
            <p class="texto-suave texto-pequeno">{{t.ui.viagem.documentosTexto}}</p>

            <ul class="minha-viagem__documentos">
              <li class="documento" ng-repeat="documento in documentos track by documento.id">
                <span class="documento__icone" aria-hidden="true">{{documento.arquivo.split('.').pop() | uppercase}}</span>
                <div>
                  <div class="documento__nome">
                    <strong>{{t.ui.viagem.documentos[documento.id]}}</strong>
                    <small>{{documento.arquivo}} · {{documento.tamanho}}</small>
                  </div>
                  <barra-progresso valor="documento.progresso" rotulo="documento.arquivo"></barra-progresso>
                </div>
                <button type="button" class="botao botao--suave botao--pequeno" ng-click="enviar(documento)"
                        ng-disabled="documento.enviando || documento.progresso >= 100">
                  {{documento.progresso >= 100 ? t.ui.viagem.enviado : (documento.enviando ? t.ui.viagem.enviando : t.ui.viagem.enviar)}}
                </button>
              </li>
            </ul>

            <barra-progresso valor="progressoGeral()" rotulo="t.ui.viagem.totalEnviado"></barra-progresso>
          </div>
        </div>
      </section>
    `,
    controller: ['$scope', '$interval', 'TraducaoService', 'ToastService', 'MINHA_VIAGEM',
      function ($scope, $interval, TraducaoService, ToastService, MINHA_VIAGEM) {
        TraducaoService.vincular($scope);

        // Estado da seção, criado a partir dos dados
        $scope.checklist = MINHA_VIAGEM.checklist.map(function (id) {
          return { id: id, feito: false };
        });
        $scope.documentos = MINHA_VIAGEM.documentos.map(function (doc) {
          return angular.extend({ progresso: 0, enviando: false }, doc);
        });

        // ---------- Checklist ----------
        $scope.tarefasFeitas = function () {
          return $scope.checklist.filter(function (item) { return item.feito; }).length;
        };

        $scope.progressoChecklist = function () {
          return ($scope.tarefasFeitas() / $scope.checklist.length) * 100;
        };

        // Chamado pelo ng-change de cada checkbox
        $scope.aoMarcarItem = function () {
          if ($scope.tarefasFeitas() === $scope.checklist.length) {
            ToastService.mostrar('sucesso', $scope.t.mensagens.checklistCompleto);
          }
        };

        // ---------- Envio simulado ($interval) ----------
        var intervalos = {};

        $scope.enviar = function (documento) {
          if (documento.enviando || documento.progresso >= 100) return;
          documento.enviando = true;

          // $interval é o setInterval do AngularJS (atualiza a tela sozinho)
          intervalos[documento.id] = $interval(function () {
            documento.progresso = Math.min(100, documento.progresso + 4 + Math.random() * 12);
            if (documento.progresso >= 100) {
              $interval.cancel(intervalos[documento.id]);
              documento.enviando = false;
              ToastService.mostrar('sucesso', $scope.t.mensagens.documentoEnviado($scope.t.ui.viagem.documentos[documento.id]));
            }
          }, 200);
        };

        $scope.enviarTodos = function () {
          $scope.documentos.forEach($scope.enviar);
        };

        $scope.todosEnviados = function () {
          return $scope.documentos.every(function (d) { return d.progresso >= 100; });
        };

        // Média do progresso de todos os documentos
        $scope.progressoGeral = function () {
          var soma = $scope.documentos.reduce(function (total, d) { return total + d.progresso; }, 0);
          return soma / $scope.documentos.length;
        };

        // Limpeza quando a seção sai da tela
        $scope.$on('$destroy', function () {
          Object.keys(intervalos).forEach(function (id) { $interval.cancel(intervalos[id]); });
        });
      },
    ],
  };
});
