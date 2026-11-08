import { useEffect } from 'react';
import './Toast.css';

const ICONES = { sucesso: '✓', erro: '✕', info: 'i' };
const TITULOS_PADRAO = { sucesso: 'Sucesso', erro: 'Erro', info: 'Aviso' };

/**
 * Uma notificação. Some sozinha depois de `duracao` ms ou ao clicar no X.
 * Props: id, tipo ('sucesso' | 'erro' | 'info'), mensagem, duracao, onFechar,
 *        titulos (títulos no idioma atual), rotuloFechar
 */
export function Toast({ id, tipo = 'info', mensagem, duracao = 4000, onFechar, titulos = TITULOS_PADRAO, rotuloFechar = 'Fechar notificação' }) {
  useEffect(() => {
    const temporizador = setTimeout(() => onFechar(id), duracao);
    // Se o toast for fechado antes, o temporizador é cancelado
    return () => clearTimeout(temporizador);
  }, [id, duracao, onFechar]);

  return (
    <div
      className={`toast toast--${tipo}`}
      role={tipo === 'erro' ? 'alert' : 'status'}
      style={{ '--duracao': `${duracao}ms` }}
    >
      <span className="toast__icone" aria-hidden="true">{ICONES[tipo]}</span>
      <div className="toast__texto">
        <strong>{titulos[tipo]}</strong>
        <p>{mensagem}</p>
      </div>
      <button type="button" className="toast__fechar" onClick={() => onFechar(id)} aria-label={rotuloFechar}>
        ×
      </button>
      <span className="toast__tempo" aria-hidden="true" />
    </div>
  );
}

/**
 * Área fixa no canto da tela que empilha os toasts.
 * Props: toasts (lista), onFechar, titulos, rotuloFechar
 */
export function ToastContainer({ toasts, onFechar, titulos, rotuloFechar }) {
  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onFechar={onFechar} titulos={titulos} rotuloFechar={rotuloFechar} />
      ))}
    </div>
  );
}
