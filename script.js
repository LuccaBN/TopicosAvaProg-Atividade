// JavaScript nativo — apenas para preencher o modal e validar o formulário

document.addEventListener('DOMContentLoaded', () => {
  const modalDetalhes = document.getElementById('modalDetalhes');
  const modalConfirmacao = new bootstrap.Modal(document.getElementById('modalConfirmacao'));
  const formReserva = document.getElementById('formReserva');
  const campoData = document.getElementById('dataIda');
  const campoDestino = document.getElementById('destino');

  let destinoSelecionado = '';

  // Impede escolher data no passado
  campoData.min = new Date().toISOString().split('T')[0];

  // Ao abrir o modal, lê os data-* do botão que foi clicado
  modalDetalhes.addEventListener('show.bs.modal', (evento) => {
    const botao = evento.relatedTarget;
    destinoSelecionado = botao.dataset.destino;

    document.getElementById('modalDetalhesTitulo').textContent = botao.dataset.destino;
    document.getElementById('modalDetalhesDescricao').textContent = botao.dataset.descricao;
    document.getElementById('modalDetalhesDuracao').textContent = botao.dataset.duracao;
    document.getElementById('modalDetalhesPreco').textContent = botao.dataset.preco;
  });

  // "Quero esse!": fecha o modal, já seleciona o destino e leva até o formulário
  document.getElementById('btnQueroEsse').addEventListener('click', () => {
    campoDestino.value = destinoSelecionado;
    bootstrap.Modal.getInstance(modalDetalhes).hide();
    document.getElementById('reserva').scrollIntoView({ behavior: 'smooth' });
    document.getElementById('nome').focus({ preventScroll: true });
  });

  // Validação HTML5 com o visual do Bootstrap
  formReserva.addEventListener('submit', (evento) => {
    evento.preventDefault(); // não há servidor; mostramos a confirmação na tela

    if (!formReserva.checkValidity()) {
      formReserva.classList.add('was-validated');
      formReserva.querySelector(':invalid').focus(); // leva o foco ao primeiro erro
      return;
    }

    const nome = document.getElementById('nome').value.trim().split(' ')[0];
    document.getElementById('modalConfirmacaoTexto').textContent =
      `Obrigado, ${nome}! Recebemos seu pedido para ${campoDestino.value}. ` +
      'Um consultor vai entrar em contato em até 24 horas.';

    modalConfirmacao.show();
    formReserva.reset();
    formReserva.classList.remove('was-validated');
  });

  // Ao limpar, remove também as mensagens de erro
  formReserva.addEventListener('reset', () => {
    formReserva.classList.remove('was-validated');
  });
});
