import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    buscarAcoesRecentes,
    buscarCadastrosPendentes,
    buscarIndicadores,
    decidirCadastro,
} from '@/dados/painelAdm'
import styles from './HomeAdm.module.css'

const PERIODOS = [
    { valor: '7d', rotulo: '7 dias' },
    { valor: '30d', rotulo: '30 dias' },
    { valor: 'tudo', rotulo: 'Tudo' },
]

const CORES_ETAPA = [styles.corCinza, styles.corLaranja, styles.corLilas, styles.corRosa]

const CLASSES_TIPO = {
    fornecedor: styles.tipoFornecedor,
    organizador: styles.tipoOrganizador,
}

const CLASSES_PONTO = {
    aprovado: styles.pontoAprovado,
    rejeitado: styles.pontoRejeitado,
    movido: styles.pontoMovido,
}
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
        <p className={styles.estado} role='status'>
            <span className={styles.spinner} aria-hidden='true' />
            {texto}
        </p>
    )
}

function Erro({ mensagem, aoTentarDeNovo }) {
    return (
        <div className={`${styles.estado} ${styles.estadoErro}`} role='alert'>
            <p>{mensagem}</p>
            <button
                type='button'
                className={`${styles.botao} ${styles.botaoContorno}`}
                onClick={aoTentarDeNovo}
            >
                Tentar de novo
            </button>
        </div>
    )
}

function Indicador({ titulo, valor, detalhe }) {
    return (
        <article className={styles.indicador}>
            <h2>{titulo}</h2>
            <strong>{valor}</strong>
            <p>{detalhe}</p>
        </article>
    )
}

function EtapasPlanejamento({ etapas }) {
    const maior = Math.max(...etapas.map((e) => e.total), 1)
    return (
        <ul className={styles.etapas}>
            {etapas.map((etapa, i) => (
                <li key={etapa.nome}>
                    <span className={styles.etapaNome}>{etapa.nome}</span>
                    <span className={styles.etapaTrilha}>
                        <span
                            className={`${styles.etapaBarra} ${CORES_ETAPA[i]}`}
                            style={{ width: `${(etapa.total / maior) * 100}%` }}
                        />
                    </span>
                    <span className={styles.etapaTotal}>{etapa.total}</span>
                </li>
            ))}
        </ul>
    )
}

function GraficoTicket({ tickets }) {
    const maior = Math.max(...tickets.flatMap((t) => [t.minimo, t.maximo]), 1)
    const descricao = tickets
        .map(
            (t) =>
                `${t.evento}: R$ ${t.minimo} com público mínimo e R$ ${t.maximo} com público máximo`,
        )
        .join('; ')

    return (
        <div className={styles.grafico}>
            <div className={styles.legenda}>
                <span>
                    <i className={styles.corLaranja} /> Público mínimo
                </span>
                <span>
                    <i className={styles.corLilas} /> Público máximo
                </span>
            </div>
            <div className={styles.graficoArea} role='img' aria-label={descricao}>
                {tickets.map((t) => (
                    <div className={styles.graficoGrupo} key={t.evento}>
                        <div className={styles.graficoColunas}>
                            <span
                                className={`${styles.coluna} ${styles.corLaranja}`}
                                style={{ height: `${(t.minimo / maior) * 100}%` }}
                            >
                                <span className={styles.colunaValor}>{t.minimo}</span>
                            </span>
                            <span
                                className={`${styles.coluna} ${styles.corLilas}`}
                                style={{ height: `${(t.maximo / maior) * 100}%` }}
                            >
                                <span className={styles.colunaValor}>{t.maximo}</span>
                            </span>
                        </div>
                        <span className={styles.graficoRotulo}>{t.evento}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ---------- Página ---------- */

function HomeAdm() {
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

        return () => {
            ativo = false
        }
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

        return () => {
            ativo = false
        }
    }, [tentativaListas])

    async function decidir(cadastro, decisao) {
        if (
            decisao === 'rejeitado' &&
            !window.confirm(`Rejeitar o cadastro de ${cadastro.nome}?`)
        ) {
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
        <main className={styles.painel}>
            <header className={styles.topo}>
                <div>
                    <p className={styles.subtitulo}>Painel Administrativo - TrocaTicket</p>
                    <h1 className={styles.titulo}>Indicadores</h1>
                </div>

                <div className={styles.controles}>
                    <div
                        className={styles.periodos}
                        role='group'
                        aria-label='Período dos indicadores'
                    >
                        {PERIODOS.map((p) => (
                            <button
                                key={p.valor}
                                type='button'
                                className={
                                    periodo === p.valor
                                        ? `${styles.periodo} ${styles.ativo}`
                                        : styles.periodo
                                }
                                aria-pressed={periodo === p.valor}
                                onClick={() => setPeriodo(p.valor)}
                            >
                                {p.rotulo}
                            </button>
                        ))}
                    </div>
                    <button
                        type='button'
                        className={`${styles.botao} ${styles.botaoContorno}`}
                        onClick={exportarRelatorio}
                        disabled={!indicadores}
                    >
                        Exportar relatório
                    </button>
                </div>
            </header>

            {/* ---------- Indicadores ---------- */}
            {erroIndicadores ? (
                <Erro
                    mensagem={erroIndicadores}
                    aoTentarDeNovo={() => setTentativaIndicadores((n) => n + 1)}
                />
            ) : !indicadores ? (
                <Carregando texto='Carregando indicadores…' />
            ) : (
                <div
                    className={atualizando ? `${styles.bloco} ${styles.atualizando}` : styles.bloco}
                    aria-busy={Boolean(atualizando)}
                >
                    <section className={styles.indicadores} aria-label='Resumo'>
                        <Indicador
                            titulo='Cadastros pendentes'
                            valor={carregandoListas ? '–' : pendentes.length}
                            detalhe={`${totalOrganizadores} organizadores e ${totalFornecedores} fornecedores`}
                        />
                        <Indicador
                            titulo='Eventos em cotação'
                            valor={indicadores.eventosEmCotacao}
                            detalhe={`De ${indicadores.eventosCadastrados} eventos cadastrados`}
                        />
                        <Indicador
                            titulo='Propostas recebidas'
                            valor={indicadores.propostasRecebidas}
                            detalhe='Enviadas por fornecedores'
                        />
                        <Indicador
                            titulo='Ticket médio estimado'
                            valor={`R$ ${indicadores.ticketMedio}`}
                            detalhe='Média dos eventos calculados'
                        />
                    </section>

                    <div className={`${styles.linha} ${styles.linhaGraficos}`}>
                        <section className={styles.painelBloco}>
                            <h2 className={styles.blocoTitulo}>
                                Eventos por etapa do planejamento
                            </h2>
                            <EtapasPlanejamento etapas={indicadores.etapas} />
                        </section>
                        <section className={styles.painelBloco}>
                            <h2 className={styles.blocoTitulo}>Ticket estimado por evento (R$)</h2>
                            <GraficoTicket tickets={indicadores.tickets} />
                        </section>
                    </div>
                </div>
            )}

            {/* ---------- Cadastros e ações ---------- */}
            <div className={`${styles.linha} ${styles.linhaListas}`}>
                <section className={`${styles.painelBloco} ${styles.blocoEscuro}`}>
                    <h2 className={styles.blocoTitulo}>Cadastros aguardando aprovação</h2>
                    <p className={styles.aviso} role='status' aria-live='polite'>
                        {mensagem}
                    </p>

                    {erroListas ? (
                        <Erro
                            mensagem={erroListas}
                            aoTentarDeNovo={() => setTentativaListas((n) => n + 1)}
                        />
                    ) : carregandoListas ? (
                        <Carregando texto='Carregando cadastros…' />
                    ) : pendentes.length === 0 ? (
                        <p className={styles.vazio}>Nenhum cadastro aguardando aprovação.</p>
                    ) : (
                        <div className={styles.tabelaRolagem}>
                            <table className={styles.tabela}>
                                <thead>
                                    <tr>
                                        <th scope='col'>Nome</th>
                                        <th scope='col'>Tipo</th>
                                        <th scope='col'>Pedido</th>
                                        <th scope='col' className={styles.colAcoes}>
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {pendentes.map((cadastro) => (
                                        <tr key={cadastro.id}>
                                            <td>
                                                <div className={styles.pessoa}>
                                                    <span
                                                        className={styles.avatar}
                                                        aria-hidden='true'
                                                    >
                                                        {iniciais(cadastro.nome)}
                                                    </span>
                                                    <div>
                                                        {cadastro.organizadorId ? (
                                                            <Link
                                                                to={`/organizadores/${cadastro.organizadorId}`}
                                                                className={styles.pessoaNome}
                                                            >
                                                                {cadastro.nome}
                                                            </Link>
                                                        ) : (
                                                            <span className={styles.pessoaNome}>
                                                                {cadastro.nome}
                                                            </span>
                                                        )}
                                                        <span className={styles.pessoaAtuacao}>
                                                            {cadastro.atuacao}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span
                                                    className={`${styles.tipo} ${CLASSES_TIPO[cadastro.tipo]}`}
                                                >
                                                    {cadastro.tipo === 'fornecedor'
                                                        ? 'Fornecedor'
                                                        : 'Organizador'}
                                                </span>
                                            </td>
                                            <td>{formatarData(cadastro.pedido)}</td>
                                            <td className={styles.colAcoes}>
                                                <div className={styles.acoesLinha}>
                                                    <button
                                                        type='button'
                                                        className={`${styles.botao} ${styles.botaoEscuro}`}
                                                        disabled={processandoId === cadastro.id}
                                                        onClick={() =>
                                                            decidir(cadastro, 'aprovado')
                                                        }
                                                        aria-label={`Aprovar ${cadastro.nome}`}
                                                    >
                                                        Aprovar
                                                    </button>
                                                    <button
                                                        type='button'
                                                        className={`${styles.botao} ${styles.botaoContorno}`}
                                                        disabled={processandoId === cadastro.id}
                                                        onClick={() =>
                                                            decidir(cadastro, 'rejeitado')
                                                        }
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

                <section className={`${styles.painelBloco} ${styles.blocoEscuro}`}>
                    <h2 className={styles.blocoTitulo}>Ações recentes</h2>
                    {carregandoListas ? (
                        <Carregando />
                    ) : erroListas ? null : (
                        <div className={styles.acoesRecentes}>
                            <ul>
                                {acoesExibidas.map((acao) => (
                                    <li key={acao.id}>
                                        <span
                                            className={`${styles.ponto} ${CLASSES_PONTO[acao.tipo]}`}
                                            aria-hidden='true'
                                        />
                                        <div>
                                            <p>{acao.texto}</p>
                                            <time>{acao.quando}</time>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {acoes.length > ACOES_VISIVEIS && (
                                <button
                                    type='button'
                                    className={styles.link}
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

export default HomeAdm
