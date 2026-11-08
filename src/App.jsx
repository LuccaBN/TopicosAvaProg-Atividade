import { useCallback, useEffect, useState } from 'react';
import './App.css';

import Accordion from './components/Accordion/Accordion.jsx';
import Pagination from './components/Pagination/Pagination.jsx';
import ProgressBar from './components/ProgressBar/ProgressBar.jsx';
import Tabs from './components/Tabs/Tabs.jsx';
import Dropdown from './components/Dropdown/Dropdown.jsx';
import { ToastContainer } from './components/Toast/Toast.jsx';
import DestinoItem from './components/DestinoItem/DestinoItem.jsx';

import { destinos } from './data/destinos.js';
import { traducoes } from './data/traducoes.js';
import { formatarData, formatarPreco } from './utils/formatar.js';

const PACOTES_POR_PAGINA = 4;
const VALORES_REGIAO = ['todos', 'nacional', 'internacional'];
const VALORES_ORDEM = ['nome', 'menor-preco', 'maior-preco', 'duracao'];
const TITULOS_PAGINA = { pt: 'Rota Livre Viagens | React', en: 'Rota Livre Travel | React', es: 'Rota Livre Viajes | React' };

function App() {
  // ---------- Estado ----------
  const [toasts, setToasts] = useState([]);
  const [idioma, setIdioma] = useState('pt');
  const [regiao, setRegiao] = useState('todos');
  const [ordem, setOrdem] = useState('nome');
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [idEscolhido, setIdEscolhido] = useState(destinos[0].id);
  const [etapaAtual, setEtapaAtual] = useState(1);
  const [progressoEnvio, setProgressoEnvio] = useState(0);
  const [enviando, setEnviando] = useState(false);

  // Textos do idioma atual
  const t = traducoes[idioma];
  const ui = t.ui;

  // Atualiza o idioma da página (leitores de tela usam o atributo lang)
  useEffect(() => {
    document.documentElement.lang = t.local;
    document.title = TITULOS_PAGINA[idioma];
  }, [idioma, t.local]);

  // Junta os dados fixos de cada destino com os textos do idioma atual
  const destinosTraduzidos = destinos.map((destino) => ({ ...destino, ...t.destinos[destino.id] }));
  const d = destinosTraduzidos.find((destino) => destino.id === idEscolhido);

  // ---------- Toasts ----------
  const mostrarToast = useCallback((tipo, mensagem) => {
    const id = crypto.randomUUID();
    setToasts((lista) => [...lista, { id, tipo, mensagem }]);
  }, []);

  // useCallback mantém a mesma função entre renderizações,
  // assim o temporizador de cada toast não reinicia
  const fecharToast = useCallback((id) => {
    setToasts((lista) => lista.filter((toast) => toast.id !== id));
  }, []);

  // ---------- Idioma: cada opção tem seu próprio callback ----------
  // A mensagem já sai no idioma escolhido
  const opcoesIdioma = [
    { valor: 'pt', texto: '🇧🇷 PT', aoSelecionar: () => mostrarToast('info', traducoes.pt.mensagens.idiomaAlterado) },
    { valor: 'en', texto: '🇺🇸 EN', aoSelecionar: () => mostrarToast('info', traducoes.en.mensagens.idiomaAlterado) },
    { valor: 'es', texto: '🇪🇸 ES', aoSelecionar: () => mostrarToast('info', traducoes.es.mensagens.idiomaAlterado) },
  ];

  // Opções dos filtros montadas com os textos do idioma atual
  const opcoesRegiao = VALORES_REGIAO.map((valor) => ({ valor, texto: ui.pacotes.regiao[valor] }));
  const opcoesOrdem = VALORES_ORDEM.map((valor) => ({ valor, texto: ui.pacotes.ordem[valor] }));

  // ---------- Filtro, ordenação e paginação ----------
  const pacotesFiltrados = destinosTraduzidos
    .filter((destino) => regiao === 'todos' || destino.regiao === regiao)
    .sort((a, b) => {
      if (ordem === 'menor-preco') return a.preco - b.preco;
      if (ordem === 'maior-preco') return b.preco - a.preco;
      if (ordem === 'duracao') return b.dias - a.dias;
      return a.nome.localeCompare(b.nome, t.local);
    });

  const totalPaginas = Math.ceil(pacotesFiltrados.length / PACOTES_POR_PAGINA);
  const inicio = (paginaAtual - 1) * PACOTES_POR_PAGINA;
  const pacotesDaPagina = pacotesFiltrados.slice(inicio, inicio + PACOTES_POR_PAGINA);

  function trocarRegiao(opcao) {
    setRegiao(opcao.valor);
    setPaginaAtual(1); // volta para a primeira página ao filtrar
  }

  function trocarOrdem(opcao) {
    setOrdem(opcao.valor);
    setPaginaAtual(1);
  }

  function escolherDestino(destino) {
    setIdEscolhido(destino.id);
    setEtapaAtual(1); // nova escolha recomeça a reserva
    mostrarToast('info', t.mensagens.adicionado(destino.nome));
  }

  // ---------- Reserva em etapas ----------
  const totalEtapas = ui.reserva.etapas.length;
  const progressoReserva = (etapaAtual / totalEtapas) * 100;
  const ultimaEtapa = etapaAtual === totalEtapas;

  function avancarEtapa() {
    if (!ultimaEtapa) {
      setEtapaAtual((etapa) => etapa + 1);
      return;
    }
    // Última etapa: confirma a reserva
    if (d.vagas === 0) {
      mostrarToast('erro', t.mensagens.semVagas(d.nome));
    } else {
      mostrarToast('sucesso', t.mensagens.confirmada(d.nome));
      setEtapaAtual(1);
    }
  }

  function voltarEtapa() {
    setEtapaAtual((etapa) => Math.max(1, etapa - 1));
  }

  // ---------- Envio de documento simulado (useEffect + setInterval) ----------
  useEffect(() => {
    if (!enviando) return;

    const intervalo = setInterval(() => {
      setProgressoEnvio((atual) => Math.min(100, atual + 5 + Math.random() * 10));
    }, 250);

    return () => clearInterval(intervalo); // limpa o intervalo ao terminar
  }, [enviando]);

  useEffect(() => {
    if (enviando && progressoEnvio >= 100) {
      setEnviando(false);
      mostrarToast('sucesso', t.mensagens.documentoEnviado);
    }
  }, [enviando, progressoEnvio, mostrarToast, t]);

  function iniciarEnvio() {
    setProgressoEnvio(0);
    setEnviando(true);
  }

  // ---------- Conteúdo das abas ----------
  const abasPacote = [
    {
      id: 'visao-geral',
      titulo: ui.detalhes.abas.visao,
      conteudo: (
        <>
          <p>{d.resumo}</p>
          <dl className="ficha">
            <div><dt>{ui.detalhes.ficha.saida}</dt><dd>{formatarData(d.saida, t.local)}</dd></div>
            <div><dt>{ui.detalhes.ficha.duracao}</dt><dd>{ui.item.dias(d.dias)}</dd></div>
            <div><dt>{ui.detalhes.ficha.aPartirDe}</dt><dd>{formatarPreco(d.preco, t.local)}</dd></div>
            <div><dt>{ui.detalhes.ficha.vagas}</dt><dd>{d.vagas === 0 ? ui.item.esgotado : d.vagas}</dd></div>
          </dl>
        </>
      ),
    },
    {
      id: 'roteiro',
      titulo: ui.detalhes.abas.roteiro,
      conteudo: (
        <ol className="roteiro">
          {d.roteiro.map((dia, i) => (
            <li key={i}>
              <span className="roteiro__dia">{ui.detalhes.dia(i + 1)}</span>
              {dia}
            </li>
          ))}
        </ol>
      ),
    },
    {
      id: 'incluso',
      titulo: ui.detalhes.abas.incluso,
      conteudo: (
        <ul className="lista-check">
          {d.incluso.map((item) => <li key={item}>{item}</li>)}
        </ul>
      ),
    },
    {
      id: 'dicas',
      titulo: ui.detalhes.abas.dicas,
      conteudo: <p className="dica">💡 {d.dicas}</p>,
    },
  ];

  // ---------- Tela ----------
  return (
    <>
      <a href="#conteudo" className="pular-link">{ui.pularConteudo}</a>

      <header className="cabecalho">
        <div className="container cabecalho__interno">
          <a href="#inicio" className="logo">
            <img src="img/logo.svg" alt="" width="34" height="34" />
            <span>Rota<strong>Livre</strong></span>
          </a>
          <nav aria-label={ui.menuPrincipal}>
            <ul className="menu">
              <li><a href="#pacotes">{ui.menu.pacotes}</a></li>
              <li><a href="#detalhes">{ui.menu.detalhes}</a></li>
              <li><a href="#faq">{ui.menu.duvidas}</a></li>
            </ul>
          </nav>
          <Dropdown
            rotulo={ui.idioma}
            opcoes={opcoesIdioma}
            valorSelecionado={idioma}
            onSelecionar={(opcao) => setIdioma(opcao.valor)}
            alinhamento="direita"
          />
        </div>
      </header>

      <main id="conteudo">
        {/* Apresentação */}
        <section id="inicio" className="apresentacao" aria-labelledby="titulo-apresentacao">
          <div className="container apresentacao__grade">
            <div>
              <p className="sobretitulo">{ui.apresentacao.sobretitulo}</p>
              <h1 id="titulo-apresentacao">{ui.apresentacao.titulo}</h1>
              <p className="apresentacao__texto">{ui.apresentacao.texto}</p>
              <a href="#pacotes" className="botao botao--primario botao--grande">{ui.apresentacao.botao}</a>
            </div>
            <ol className="passos" aria-label={ui.apresentacao.passosRotulo}>
              {ui.apresentacao.passos.map((passo, i) => (
                <li key={passo}><span>{i + 1}</span>{passo}</li>
              ))}
            </ol>
          </div>
        </section>

        {/* Pacotes (Dropdown + Paginação) e painel da reserva (Barra de Progresso) */}
        <section id="pacotes" className="secao" aria-labelledby="titulo-pacotes">
          <div className="container layout-reserva">
            <div>
              <div className="secao__topo">
                <div>
                  <h2 id="titulo-pacotes">{ui.pacotes.titulo}</h2>
                  <p className="texto-suave">{ui.pacotes.contagem(pacotesFiltrados.length, paginaAtual, totalPaginas)}</p>
                </div>
                <div className="filtros">
                  <Dropdown rotulo={ui.pacotes.mostrar} opcoes={opcoesRegiao} valorSelecionado={regiao} onSelecionar={trocarRegiao} />
                  <Dropdown rotulo={ui.pacotes.ordenar} opcoes={opcoesOrdem} valorSelecionado={ordem} onSelecionar={trocarOrdem} alinhamento="direita" />
                </div>
              </div>

              <div className="lista-pacotes">
                {pacotesDaPagina.map((destino) => (
                  <DestinoItem
                    key={destino.id}
                    destino={destino}
                    textos={ui.item}
                    selo={ui.selo[destino.regiao]}
                    local={t.local}
                    selecionado={destino.id === d.id}
                    onEscolher={escolherDestino}
                  />
                ))}
              </div>

              <Pagination
                totalPaginas={totalPaginas}
                paginaAtual={paginaAtual}
                onMudarPagina={setPaginaAtual}
                textos={ui.paginacao}
              />
            </div>

            {/* Painel lateral: fica fixo ao rolar no desktop */}
            <aside className="painel-reserva" aria-labelledby="titulo-reserva">
              <div className="cartao">
                <h2 id="titulo-reserva" className="cartao__titulo">{ui.reserva.titulo}</h2>
                <div className="resumo-reserva">
                  <img src={d.imagem} alt="" />
                  <div>
                    <strong>{d.nome}</strong>
                    <span>{ui.item.dias(d.dias)} · {formatarPreco(d.preco, t.local)}</span>
                  </div>
                </div>

                <ProgressBar valor={progressoReserva} rotulo={ui.reserva.etapaDe(etapaAtual, totalEtapas)} />

                <ol className="etapas">
                  {ui.reserva.etapas.map((nome, i) => {
                    const numero = i + 1;
                    const estado = numero < etapaAtual ? 'feita' : numero === etapaAtual ? 'atual' : 'pendente';
                    return (
                      <li key={nome} className={`etapas__item etapas__item--${estado}`} aria-current={estado === 'atual' ? 'step' : undefined}>
                        <span className="etapas__marcador">{estado === 'feita' ? '✓' : numero}</span>
                        {nome}
                      </li>
                    );
                  })}
                </ol>

                <div className="cartao__acoes">
                  <button type="button" className="botao botao--suave" onClick={voltarEtapa} disabled={etapaAtual === 1}>
                    {ui.reserva.voltar}
                  </button>
                  <button type="button" className="botao botao--destaque" onClick={avancarEtapa}>
                    {ultimaEtapa ? ui.reserva.confirmar : ui.reserva.avancar}
                  </button>
                </div>
              </div>

              <div className="cartao">
                <h2 className="cartao__titulo">{ui.documento.titulo}</h2>
                <p className="texto-suave texto-pequeno">{ui.documento.texto}</p>
                <ProgressBar valor={progressoEnvio} rotulo={enviando ? ui.documento.enviandoArquivo : ui.documento.arquivo} />
                <button type="button" className="botao botao--primario" onClick={iniciarEnvio} disabled={enviando}>
                  {enviando ? ui.documento.enviando : progressoEnvio >= 100 ? ui.documento.enviarNovamente : ui.documento.enviar}
                </button>
              </div>
            </aside>
          </div>
        </section>

        {/* Detalhes do pacote escolhido: Abas */}
        <section id="detalhes" className="secao secao--areia" aria-labelledby="titulo-detalhes">
          <div className="container detalhes">
            <div className="detalhes__cabecalho">
              <img src={d.imagem} alt={d.alt} className="detalhes__imagem" />
              <div>
                <p className="sobretitulo">{ui.detalhes.sobretitulo}</p>
                <h2 id="titulo-detalhes">{d.nome}</h2>
                <span className={`selo selo--${d.regiao}`}>{ui.selo[d.regiao]}</span>
              </div>
            </div>
            {/* key faz as abas voltarem para a primeira ao trocar de pacote */}
            <Tabs key={d.id} abas={abasPacote} rotulo={ui.detalhes.rotuloAbas(d.nome)} />
          </div>
        </section>

        {/* Dúvidas: Acordeão */}
        <section id="faq" className="secao" aria-labelledby="titulo-faq">
          <div className="container faq">
            <div>
              <p className="sobretitulo">{ui.faq.sobretitulo}</p>
              <h2 id="titulo-faq">{ui.faq.titulo}</h2>
              <p className="texto-suave">{ui.faq.texto}</p>
            </div>
            <Accordion itens={t.faq} abertoInicial="cancelamento" />
          </div>
        </section>
      </main>

      <footer className="rodape">
        <div className="container rodape__interno">
          <span className="logo logo--rodape">
            <img src="img/logo.svg" alt="" width="26" height="26" />
            <span>Rota<strong>Livre</strong></span>
          </span>
          <p>{ui.rodape}</p>
        </div>
      </footer>

      <ToastContainer
        toasts={toasts}
        onFechar={fecharToast}
        titulos={ui.toast.titulos}
        rotuloFechar={ui.toast.fechar}
      />
    </>
  );
}

export default App;
