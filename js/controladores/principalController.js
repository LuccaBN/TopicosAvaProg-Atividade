/**
 * Controlador principal da Central do Viajante.
 * Liga os serviços à tela usando o $scope: tudo que está no $scope
 * pode ser usado no HTML com {{ }}, ng-model, ng-click, ng-change etc.
 */
angular.module('rotaLivre').controller('PrincipalController', [
  '$scope', '$interval', 'DestinosService', 'TraducaoService', 'ToastService',
  function ($scope, $interval, DestinosService, TraducaoService, ToastService) {
    var DESTINOS_POR_PAGINA = 6;
    var VALORES_REGIAO = ['todos', 'nacional', 'internacional'];
    var VALORES_ORDEM = ['nome', 'menor-preco', 'maior-preco', 'duracao'];
    var TITULOS_PAGINA = { pt: 'Central do Viajante | Rota Livre', en: 'Traveler Hub | Rota Livre', es: 'Central del Viajero | Rota Livre' };

    // ---------- Estado da tela ($scope) ----------
    $scope.filtros = { busca: '', regiao: 'todos', ordem: 'nome' }; // busca ligada com ng-model
    $scope.paginaAtual = 1;
    $scope.itensPorPagina = DESTINOS_POR_PAGINA;
    $scope.idDestaque = 'lisboa';
    $scope.viajantes = 2; // ligado com ng-model

    // Checklist: cada item tem "feito", ligado a um checkbox com ng-model
    $scope.checklist = ['documentos', 'seguro', 'mala', 'cambio', 'checkin'].map(function (id) {
      return { id: id, feito: false };
    });

    // Documentos para envio simulado, cada um com sua própria barra de progresso
    $scope.documentos = [
      { id: 'passaporte', arquivo: 'passaporte.pdf', tamanho: '2,4 MB', progresso: 0, enviando: false },
      { id: 'seguro', arquivo: 'seguro-viagem.pdf', tamanho: '860 KB', progresso: 0, enviando: false },
      { id: 'vacina', arquivo: 'cartao-vacina.jpg', tamanho: '1,1 MB', progresso: 0, enviando: false },
    ];

    // ---------- Idioma ----------
    function aplicarIdioma(idioma) {
      TraducaoService.setIdioma(idioma);
      $scope.idioma = idioma;
      $scope.t = TraducaoService.textos(); // todos os textos do idioma atual
      document.title = TITULOS_PAGINA[idioma];

      $scope.opcoesRegiao = VALORES_REGIAO.map(function (valor) {
        return { valor: valor, texto: $scope.t.ui.explorar.regiao[valor] };
      });
      $scope.opcoesOrdem = VALORES_ORDEM.map(function (valor) {
        return { valor: valor, texto: $scope.t.ui.explorar.ordem[valor] };
      });
      atualizarLista();
    }

    // Cada opção de idioma tem seu próprio callback (a mensagem já sai no idioma escolhido)
    var BANDEIRAS = { pt: '🇧🇷 Português', en: '🇺🇸 English', es: '🇪🇸 Español' };
    $scope.opcoesIdioma = TraducaoService.idiomasDisponiveis.map(function (codigo) {
      return {
        valor: codigo,
        texto: BANDEIRAS[codigo],
        aoSelecionar: function () {
          ToastService.mostrar('info', TraducaoService.textos(codigo).mensagens.idiomaAlterado);
        },
      };
    });

    $scope.trocarIdioma = function (opcao) {
      aplicarIdioma(opcao.valor);
    };

    // ---------- Galeria: busca, filtro, ordenação e paginação ----------
    function atualizarLista() {
      $scope.destinos = DestinosService.pesquisar($scope.filtros);
      $scope.totalPaginas = Math.max(1, Math.ceil($scope.destinos.length / DESTINOS_POR_PAGINA));
      if ($scope.paginaAtual > $scope.totalPaginas) $scope.paginaAtual = 1;
      $scope.destaque = DestinosService.buscarPorId($scope.idDestaque);
    }

    // Chamado pelo ng-change do campo de busca
    $scope.aoBuscar = function () {
      $scope.paginaAtual = 1;
      atualizarLista();
    };

    $scope.trocarRegiao = function (opcao) {
      $scope.filtros.regiao = opcao.valor;
      $scope.paginaAtual = 1;
      atualizarLista();
    };

    $scope.trocarOrdem = function (opcao) {
      $scope.filtros.ordem = opcao.valor;
      $scope.paginaAtual = 1;
      atualizarLista();
    };

    // Callback passado para a diretiva <paginacao>
    $scope.irParaPagina = function (pagina) {
      $scope.paginaAtual = pagina;
    };

    // Coloca o destino clicado no topo, em destaque
    $scope.verDestino = function (destino) {
      $scope.idDestaque = destino.id;
      $scope.destaque = DestinosService.buscarPorId(destino.id);
      ToastService.mostrar('info', $scope.t.mensagens.destaque(destino.nome));
      var topo = document.getElementById('destaque');
      if (topo) topo.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // ---------- Reserva do destino em destaque ----------
    $scope.precoTotal = function () {
      return $scope.destaque.preco * ($scope.viajantes || 0);
    };

    $scope.reservar = function () {
      var n = Number($scope.viajantes);
      if (!n || n < 1 || n > 10) {
        ToastService.mostrar('erro', $scope.t.mensagens.viajantesInvalido);
      } else if ($scope.destaque.vagas === 0) {
        ToastService.mostrar('erro', $scope.t.mensagens.semVagas($scope.destaque.nome));
      } else {
        ToastService.mostrar('sucesso', $scope.t.mensagens.confirmada($scope.destaque.nome, n));
      }
    };

    // ---------- Checklist (barra de progresso ligada ao ng-model) ----------
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

    // ---------- Envio de documentos simulado ($interval) ----------
    var intervalos = {};

    $scope.enviar = function (documento) {
      if (documento.enviando || documento.progresso >= 100) return;
      documento.enviando = true;

      // $interval é a versão do AngularJS para setInterval (atualiza a tela sozinho)
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

    // Limpeza quando o controlador é destruído
    $scope.$on('$destroy', function () {
      Object.keys(intervalos).forEach(function (id) { $interval.cancel(intervalos[id]); });
    });

    // ---------- Inicialização ----------
    aplicarIdioma('pt');
  },
]);
