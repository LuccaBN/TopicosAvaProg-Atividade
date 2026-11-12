/**
 * Dados da seção "Minha viagem".
 * Os textos de cada item ficam nos arquivos de idioma (t.ui.viagem.checklist / documentos).
 */
angular.module('rotaLivre.secoes').constant('MINHA_VIAGEM', {
  checklist: ['documentos', 'seguro', 'mala', 'cambio', 'checkin'],
  documentos: [
    { id: 'passaporte', arquivo: 'passaporte.pdf', tamanho: '2,4 MB' },
    { id: 'seguro', arquivo: 'seguro-viagem.pdf', tamanho: '860 KB' },
    { id: 'vacina', arquivo: 'cartao-vacina.jpg', tamanho: '1,1 MB' },
  ],
});
