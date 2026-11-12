/**
 * Dados dos destinos que não mudam com o idioma (preço, data, vagas...).
 * Os textos de cada destino (nome, resumo, roteiro...) ficam nos arquivos de idioma.
 */
angular.module('rotaLivre.compartilhado').constant('DESTINOS', [
  { id: 'salvador', regiao: 'nacional', imagem: 'img/salvador.svg', preco: 1290, dias: 5, saida: '2026-12-12', vagas: 18 },
  { id: 'gramado', regiao: 'nacional', imagem: 'img/gramado.svg', preco: 1590, dias: 4, saida: '2026-12-18', vagas: 6 },
  { id: 'noronha', regiao: 'nacional', imagem: 'img/fernando-de-noronha.svg', preco: 3890, dias: 6, saida: '2027-01-08', vagas: 0 },
  { id: 'rio', regiao: 'nacional', imagem: 'img/rio-de-janeiro.svg', preco: 1890, dias: 5, saida: '2027-01-22', vagas: 12 },
  { id: 'lisboa', regiao: 'internacional', imagem: 'img/lisboa.svg', preco: 5490, dias: 7, saida: '2027-02-02', vagas: 9 },
  { id: 'buenos-aires', regiao: 'internacional', imagem: 'img/buenos-aires.svg', preco: 2790, dias: 5, saida: '2027-01-15', vagas: 22 },
  { id: 'cancun', regiao: 'internacional', imagem: 'img/cancun.svg', preco: 6190, dias: 7, saida: '2027-02-20', vagas: 14 },
  { id: 'paris', regiao: 'internacional', imagem: 'img/paris.svg', preco: 7890, dias: 8, saida: '2027-03-10', vagas: 4 },
  { id: 'toquio', regiao: 'internacional', imagem: 'img/toquio.svg', preco: 11490, dias: 10, saida: '2027-04-05', vagas: 8 },
]);
