import './ProgressBar.css';

/**
 * Barra de progresso.
 * Props:
 *  - valor: número de 0 a 100
 *  - rotulo: texto que descreve a tarefa (também usado pelo leitor de tela)
 *  - mostrarPercentual: exibe o número ao lado (padrão: true)
 */
function ProgressBar({ valor, rotulo, mostrarPercentual = true }) {
  // Garante que o valor fique entre 0 e 100
  const percentual = Math.round(Math.min(100, Math.max(0, valor)));
  const completo = percentual === 100;

  return (
    <div className="progress">
      <div className="progress__topo">
        <span className="progress__rotulo">{rotulo}</span>
        {mostrarPercentual && <span className="progress__valor">{percentual}%</span>}
      </div>
      <div
        className="progress__trilho"
        role="progressbar"
        aria-label={rotulo}
        aria-valuenow={percentual}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`progress__barra ${completo ? 'progress__barra--completa' : ''}`}
          style={{ width: `${percentual}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
