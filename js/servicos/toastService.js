/**
 * Serviço de notificações (toasts).
 * Qualquer controlador ou diretiva pode chamar ToastService.mostrar('sucesso', 'mensagem').
 * A diretiva <toast-container> só exibe a lista que este serviço guarda.
 */
angular.module('rotaLivre.servicos').factory('ToastService', ['$timeout', function ($timeout) {
  var DURACAO_PADRAO = 4000;
  var lista = [];
  var proximoId = 1;

  function fechar(id) {
    for (var i = 0; i < lista.length; i++) {
      if (lista[i].id === id) {
        $timeout.cancel(lista[i].temporizador); // cancela o fechamento automático
        lista.splice(i, 1);
        return;
      }
    }
  }

  function mostrar(tipo, mensagem, duracao) {
    var toast = {
      id: proximoId++,
      tipo: tipo || 'info', // 'sucesso' | 'erro' | 'info'
      mensagem: mensagem,
      duracao: duracao || DURACAO_PADRAO,
    };
    // $timeout (e não setTimeout) avisa o AngularJS para atualizar a tela
    toast.temporizador = $timeout(function () {
      fechar(toast.id);
    }, toast.duracao);

    lista.push(toast);
  }

  return {
    lista: lista,
    mostrar: mostrar,
    fechar: fechar,
  };
}]);
