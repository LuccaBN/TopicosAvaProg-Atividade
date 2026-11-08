// Formatação de preço e data de acordo com o idioma (ex.: 'pt-BR', 'en-US', 'es-ES')

export function formatarPreco(valor, local) {
  return valor.toLocaleString(local, { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export function formatarData(dataIso, local) {
  // T12:00 evita que o fuso horário mude o dia
  return new Date(`${dataIso}T12:00:00`).toLocaleDateString(local, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
