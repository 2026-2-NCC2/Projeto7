import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    buscarAcoesRecentes,
    buscarCadastrosPendentes,
    buscarIndicadores,
    decidirCadastro,
} from '../../../dados/painelAdm.js'
import './styles.css'

const PERIODOS = [
    { valor: '7d', rotulo: '7 dias' },
    { valor: '30d', rotulo: '30 dias' },
    { valor: 'tudo', rotulo: 'Tudo' },
]

const CORES_ETAPA = ['cinza', 'laranja', 'lilas', 'rosa']
const ACOES_VISIVEIS = 5

function iniciais(nome) {
    return nome
        .split(' ')
        .filter((parte) => /^\p{L}/u.test(parte))
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase()
}

function formatarData(dataIso) {
    const [, mes, dia] = dataIso.split('-')
    return `${dia}/${mes}`
}

/* ---------- Componentes pequenos da tela ---------- */

function Carregando({ texto = 'Carregando…' }) {
    return (
        <p className="adm-estado" role="status">
            <span className="adm-spinner" aria-hidden="true" />
            {texto}
        </p>
    )
}

function Erro({ mensagem, aoTentarDeNovo }) {
    return (
        <div className="adm-estado adm-estado-erro" role="alert">
            <p>{mensagem}</p>
            <button type="button" className="adm-botao adm-botao-contorno" onClick={aoTentarDeNovo}>
                Tentar de novo
            </button>
        </div>
    )
}

function Indicador({ titulo, valor, detalhe }) {
    return (
        <article className="adm-indicador">
            <h2>{titulo}</h2>
            <strong>{valor}</strong>
            <p>{detalhe}</p>
        </article>
    )
}

function EtapasPlanejamento({ etapas }) {
    const maior = Math.max(...etapas.map((e) => e.total), 1)
    return (
        <ul className="adm-etapas">
            {etapas.map((etapa, i) => (
                <li key={etapa.nome}>
                    <span className="adm-etapa-nome">{etapa.nome}</span>
                    <span className="adm-etapa-trilha">
                        <span
                            className={`adm-etapa-barra adm-cor-${CORES_ETAPA[i]}`}
                            style={{ width: `${(etapa.total / maior) * 100}%` }}
                        />
                    </span>
                    <span className="adm-etapa-total">{etapa.total}</span>
                </li>
            ))}
        </ul>
    )
}

function GraficoTicket({ tickets }) {
    const maior = Math.max(...tickets.flatMap((t) => [t.minimo, t.maximo]), 1)
    const descricao = tickets
        .map((t) => `${t.evento}: R$ ${t.minimo} com público mínimo e R$ ${t.maximo} com público máximo`)
        .join('; ')

    return (
        <div className="adm-grafico">
            <div className="adm-legenda">
                <span><i className="adm-cor-laranja" /> Público mínimo</span>
                <span><i className="adm-cor-lilas" /> Público máximo</span>
            </div>
            <div className="adm-grafico-area" role="img" aria-label={descricao}>
                {tickets.map((t) => (
                    <div className="adm-grafico-grupo" key={t.evento}>
                        <div className="adm-grafico-colunas">
                            <span className="adm-coluna adm-cor-laranja" style={{ height: `${(t.minimo / maior) * 100}%` }}>
                                <span className="adm-coluna-valor">{t.minimo}</span>
                            </span>
                            <span className="adm-coluna adm-cor-lilas" style={{ height: `${(t.maximo / maior) * 100}%` }}>
                                <span className="adm-coluna-valor">{t.maximo}</span>
                            </span>
                        </div>
                        <span className="adm-grafico-rotulo">{t.evento}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ---------- Página ---------- */

function Home() {
    const [periodo, setPeriodo] = useState('30d')

    const [indicadores, setIndicadores] = useState(null)
    const [carregandoIndicadores, setCarregandoIndicadores] = useState(true)
    const [erroIndicadores, setErroIndicadores] = useState('')
    const [tentativaIndicadores, setTentativaIndicadores] = useState(0)

    const [pendentes, setPendentes] = useState([])
    const [acoes, setAcoes] = useState([])
    const [carregandoListas, setCarregandoListas] = useState(true)
    const [erroListas, setErroListas] = useState('')
    const [tentativaListas, setTentativaListas] = useState(0)

    const [processandoId, setProcessandoId] = useState(null)
    const [mensagem, setMensagem] = useState('')
    const [historicoAberto, setHistoricoAberto] = useState(false)

    // Indicadores: recarrega quando o período muda
    useEffect(() => {
        let ativo = true
        setCarregandoIndicadores(true)
        setErroIndicadores('')

        buscarIndicadores(periodo)
            .then((dados) => ativo && setIndicadores(dados))
            .catch(() => ativo && setErroIndicadores('Não foi possível carregar os indicadores.'))
            .finally(() => ativo && setCarregandoIndicadores(false))

        return () => { ativo = false }
    }, [periodo, tentativaIndicadores])

    // Cadastros pendentes e ações recentes: carregam uma vez
    useEffect(() => {
        let ativo = true
        setCarregandoListas(true)
        setErroListas('')

        Promise.all([buscarCadastrosPendentes(), buscarAcoesRecentes()])
            .then(([listaPendentes, listaAcoes]) => {
                if (!ativo) return
                setPendentes(listaPendentes)
                setAcoes(listaAcoes)
            })
            .catch(() => ativo && setErroListas('Não foi possível carregar os cadastros.'))
            .finally(() => ativo && setCarregandoListas(false))

        return () => { ativo = false }
    }, [tentativaListas])

    async function decidir(cadastro, decisao) {
        if (decisao === 'rejeitado' && !window.confirm(`Rejeitar o cadastro de ${cadastro.nome}?`)) {
            return
        }
        setProcessandoId(cadastro.id)
        setMensagem('')
        try {
            const acao = await decidirCadastro(cadastro.id, decisao)
            setPendentes((lista) => lista.filter((item) => item.id !== cadastro.id))
            setAcoes((lista) => [acao, ...lista])
            setMensagem(`${cadastro.nome} ${decisao === 'aprovado' ? 'aprovado' : 'rejeitado'}.`)
        } catch {
            setMensagem(`Não foi possível atualizar ${cadastro.nome}. Tente de novo.`)
        } finally {
            setProcessandoId(null)
        }
    }

    function exportarRelatorio() {
        if (!indicadores) return
        const rotuloPeriodo = PERIODOS.find((p) => p.valor === periodo).rotulo
        const linhas = [
            ['Relatório TrocaTicket', rotuloPeriodo],
            [],
            ['Indicador', 'Valor'],
            ['Cadastros pendentes', pendentes.length],
            ['Eventos cadastrados', indicadores.eventosCadastrados],
            ['Eventos em cotação', indicadores.eventosEmCotacao],
            ['Propostas recebidas', indicadores.propostasRecebidas],
            ['Ticket médio estimado (R$)', indicadores.ticketMedio],
            [],
            ['Etapa do planejamento', 'Eventos'],
            ...indicadores.etapas.map((e) => [e.nome, e.total]),
            [],
            ['Evento', 'Ticket público mínimo (R$)', 'Ticket público máximo (R$)'],
            ...indicadores.tickets.map((t) => [t.evento, t.minimo, t.maximo]),
        ]
        // ";" como separador para abrir certo no Excel em português
        const csv = linhas.map((linha) => linha.join(';')).join('\n')
        const arquivo = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
        const url = URL.createObjectURL(arquivo)
        const link = document.createElement('a')
        link.href = url
        link.download = `relatorio-trocaticket-${periodo}.csv`
        link.click()
        URL.revokeObjectURL(url)
    }

    const totalOrganizadores = pendentes.filter((p) => p.tipo === 'organizador').length
    const totalFornecedores = pendentes.filter((p) => p.tipo === 'fornecedor').length
    const acoesExibidas = historicoAberto ? acoes : acoes.slice(0, ACOES_VISIVEIS)
    const atualizando = carregandoIndicadores && indicadores

    return (
        <main className="adm-painel">
            <header className="adm-topo">
                <div>
                    <p className="adm-subtitulo">Painel Administrativo - TrocaTicket</p>
                    <h1 className="adm-titulo">Indicadores</h1>
                </div>

                <div className="adm-controles">
                    <div className="adm-periodos" role="group" aria-label="Período dos indicadores">
                        {PERIODOS.map((p) => (
                            <button
                                key={p.valor}
                                type="button"
                                className={periodo === p.valor ? 'adm-periodo ativo' : 'adm-periodo'}
                                aria-pressed={periodo === p.valor}
                                onClick={() => setPeriodo(p.valor)}
                            >
                                {p.rotulo}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        className="adm-botao adm-botao-contorno"
                        onClick={exportarRelatorio}
                        disabled={!indicadores}
                    >
                        Exportar relatório
                    </button>
                </div>
            </header>

            {/* ---------- Indicadores ---------- */}
            {erroIndicadores ? (
                <Erro mensagem={erroIndicadores} aoTentarDeNovo={() => setTentativaIndicadores((n) => n + 1)} />
            ) : !indicadores ? (
                <Carregando texto="Carregando indicadores…" />
            ) : (
                <div className={atualizando ? 'adm-bloco atualizando' : 'adm-bloco'} aria-busy={Boolean(atualizando)}>
                    <section className="adm-indicadores" aria-label="Resumo">
                        <Indicador
                            titulo="Cadastros pendentes"
                            valor={carregandoListas ? '–' : pendentes.length}
                            detalhe={`${totalOrganizadores} organizadores e ${totalFornecedores} fornecedores`}
                        />
                        <Indicador
                            titulo="Eventos em cotação"
                            valor={indicadores.eventosEmCotacao}
                            detalhe={`De ${indicadores.eventosCadastrados} eventos cadastrados`}
                        />
                        <Indicador
                            titulo="Propostas recebidas"
                            valor={indicadores.propostasRecebidas}
                            detalhe="Enviadas por fornecedores"
                        />
                        <Indicador
                            titulo="Ticket médio estimado"
                            valor={`R$ ${indicadores.ticketMedio}`}
                            detalhe="Média dos eventos calculados"
                        />
                    </section>

                    <div className="adm-linha adm-linha-graficos">
                        <section className="adm-painel-bloco">
                            <h2 className="adm-bloco-titulo">Eventos por etapa do planejamento</h2>
                            <EtapasPlanejamento etapas={indicadores.etapas} />
                        </section>
                        <section className="adm-painel-bloco">
                            <h2 className="adm-bloco-titulo">Ticket estimado por evento (R$)</h2>
                            <GraficoTicket tickets={indicadores.tickets} />
                        </section>
                    </div>
                </div>
            )}

            {/* ---------- Cadastros e ações ---------- */}
            <div className="adm-linha adm-linha-listas">
                <section className="adm-painel-bloco adm-bloco-escuro">
                    <h2 className="adm-bloco-titulo">Cadastros aguardando aprovação</h2>
                    <p className="adm-aviso" role="status" aria-live="polite">{mensagem}</p>

                    {erroListas ? (
                        <Erro mensagem={erroListas} aoTentarDeNovo={() => setTentativaListas((n) => n + 1)} />
                    ) : carregandoListas ? (
                        <Carregando texto="Carregando cadastros…" />
                    ) : pendentes.length === 0 ? (
                        <p className="adm-vazio">Nenhum cadastro aguardando aprovação.</p>
                    ) : (
                        <div className="adm-tabela-rolagem">
                            <table className="adm-tabela">
                                <thead>
                                    <tr>
                                        <th scope="col">Nome</th>
                                        <th scope="col">Tipo</th>
                                        <th scope="col">Pedido</th>
                                        <th scope="col" className="adm-col-acoes">Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendentes.map((cadastro) => (
                                        <tr key={cadastro.id}>
                                            <td>
                                                <div className="adm-pessoa">
                                                    <span className="adm-avatar" aria-hidden="true">{iniciais(cadastro.nome)}</span>
                                                    <div>
                                                        {cadastro.organizadorId ? (
                                                            <Link to={`/organizadores/${cadastro.organizadorId}`} className="adm-pessoa-nome">
                                                                {cadastro.nome}
                                                            </Link>
                                                        ) : (
                                                            <span className="adm-pessoa-nome">{cadastro.nome}</span>
                                                        )}
                                                        <span className="adm-pessoa-atuacao">{cadastro.atuacao}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`adm-tipo adm-tipo-${cadastro.tipo}`}>
                                                    {cadastro.tipo === 'fornecedor' ? 'Fornecedor' : 'Organizador'}
                                                </span>
                                            </td>
                                            <td>{formatarData(cadastro.pedido)}</td>
                                            <td className="adm-col-acoes">
                                                <div className="adm-acoes-linha">
                                                    <button
                                                        type="button"
                                                        className="adm-botao adm-botao-escuro"
                                                        disabled={processandoId === cadastro.id}
                                                        onClick={() => decidir(cadastro, 'aprovado')}
                                                        aria-label={`Aprovar ${cadastro.nome}`}
                                                    >
                                                        Aprovar
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="adm-botao adm-botao-contorno"
                                                        disabled={processandoId === cadastro.id}
                                                        onClick={() => decidir(cadastro, 'rejeitado')}
                                                        aria-label={`Rejeitar ${cadastro.nome}`}
                                                    >
                                                        Rejeitar
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>

                <section className="adm-painel-bloco adm-bloco-escuro">
                    <h2 className="adm-bloco-titulo">Ações recentes</h2>
                    {carregandoListas ? (
                        <Carregando />
                    ) : erroListas ? null : (
                        <div className="adm-acoes-recentes">
                            <ul>
                                {acoesExibidas.map((acao) => (
                                    <li key={acao.id}>
                                        <span className={`adm-ponto adm-ponto-${acao.tipo}`} aria-hidden="true" />
                                        <div>
                                            <p>{acao.texto}</p>
                                            <time>{acao.quando}</time>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {acoes.length > ACOES_VISIVEIS && (
                                <button
                                    type="button"
                                    className="adm-link"
                                    aria-expanded={historicoAberto}
                                    onClick={() => setHistoricoAberto((aberto) => !aberto)}
                                >
                                    {historicoAberto ? 'Mostrar menos' : 'Ver histórico completo'}
                                </button>
                            )}
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

export default Home
