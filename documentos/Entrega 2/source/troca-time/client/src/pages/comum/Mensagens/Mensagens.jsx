import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, dataBr, dataHoraBr } from '@/utils/api'
import styles from './Mensagens.module.css'

// Tempo entre as consultas de mensagens novas (polling). Não é tempo real.
const INTERVALO_ATUALIZACAO = 5000

const STATUS = {
    pendente: { rotulo: 'Pendente', classe: 'stAzul' },
    selecionada: { rotulo: 'Selecionada', classe: 'stVerde' },
    aceita: { rotulo: 'Aceita', classe: 'stVinho' },
    recusada: { rotulo: 'Recusada', classe: 'stCinza' },
    cancelada: { rotulo: 'Cancelada', classe: 'stCinza' },
}

const dinheiro = (valor) =>
    Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

const iniciais = (nome = '') =>
    nome
        .split(/\s+/)
        .filter((p) => /[A-Za-zÀ-ú0-9]/.test(p[0] || ''))
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

function Status({ status }) {
    const info = STATUS[status] || { rotulo: status, classe: 'stCinza' }
    return <span className={`${styles.status} ${styles[info.classe]}`}>{info.rotulo}</span>
}

// perfil: 'organizador' | 'fornecedor'
function Mensagens({ perfil }) {
    const souOrganizador = perfil === 'organizador'
    const [searchParams, setSearchParams] = useSearchParams()
    const propostaSelecionada = Number(searchParams.get('proposta')) || null

    const [conversas, setConversas] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [mensagens, setMensagens] = useState([])
    const [rascunho, setRascunho] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [confirmarCancelar, setConfirmarCancelar] = useState(false)
    const [processando, setProcessando] = useState(false)
    const [erro, setErro] = useState('')
    const [aviso, setAviso] = useState('')
    const fimRef = useRef(null)
    const mensagensRef = useRef([])
    const propostaRef = useRef(null)

    useEffect(() => {
        mensagensRef.current = mensagens
    }, [mensagens])

    useEffect(() => {
        propostaRef.current = propostaSelecionada
    }, [propostaSelecionada])

    const atual = conversas.find((c) => c.proposta_id === propostaSelecionada) || null

    const carregarConversas = useCallback(async () => {
        try {
            const resposta = await api('/conversas')
            setConversas(resposta.conversas || [])
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }, [])

    // Abre a primeira conversa quando nenhuma foi escolhida
    useEffect(() => {
        if (!propostaSelecionada && conversas.length) {
            setSearchParams({ proposta: String(conversas[0].proposta_id) }, { replace: true })
        }
    }, [conversas, propostaSelecionada, setSearchParams])

    const buscarMensagensNovas = useCallback(async (propostaId) => {
        const ultimoId = mensagensRef.current.at(-1)?.id ?? 0
        const resposta = await api(`/conversas/${propostaId}/mensagens?depois_de=${ultimoId}`)
        // Ignora respostas de uma conversa que já foi trocada
        if (propostaRef.current !== propostaId) return
        const novas = resposta.mensagens || []
        if (novas.length) {
            setMensagens((lista) => {
                const ids = new Set(lista.map((m) => m.id))
                return [...lista, ...novas.filter((m) => !ids.has(m.id))]
            })
        }
    }, [])

    // Troca de conversa: carrega o histórico inteiro
    useEffect(() => {
        setMensagens([])
        mensagensRef.current = []
        setRascunho('')
        setConfirmarCancelar(false)
        setAviso('')
        if (!propostaSelecionada) return
        buscarMensagensNovas(propostaSelecionada).catch((error) => setErro(error.message))
    }, [propostaSelecionada, buscarMensagensNovas])

    // Polling: mensagens novas e status das propostas a cada 5 segundos
    useEffect(() => {
        carregarConversas()
        const timer = setInterval(() => {
            carregarConversas()
            if (propostaSelecionada) buscarMensagensNovas(propostaSelecionada).catch(() => {})
        }, INTERVALO_ATUALIZACAO)
        return () => clearInterval(timer)
    }, [propostaSelecionada, carregarConversas, buscarMensagensNovas])

    useEffect(() => {
        fimRef.current?.scrollIntoView({ block: 'end' })
    }, [mensagens.length])

    async function enviar(e) {
        e.preventDefault()
        const conteudo = rascunho.trim()
        if (!conteudo || !atual) return
        setEnviando(true)
        setErro('')
        try {
            const mensagem = await api(`/conversas/${atual.proposta_id}/mensagens`, {
                method: 'POST',
                body: JSON.stringify({ conteudo }),
            })
            setMensagens((lista) =>
                lista.some((m) => m.id === mensagem.id) ? lista : [...lista, mensagem],
            )
            setRascunho('')
            carregarConversas()
        } catch (error) {
            setErro(error.message)
            carregarConversas()
        } finally {
            setEnviando(false)
        }
    }

    async function executar(caminho, corpo, mensagemSucesso) {
        setProcessando(true)
        setErro('')
        setAviso('')
        try {
            await api(caminho, { method: 'PATCH', body: corpo ? JSON.stringify(corpo) : undefined })
            setAviso(mensagemSucesso)
        } catch (error) {
            setErro(error.message)
        } finally {
            setProcessando(false)
            setConfirmarCancelar(false)
            carregarConversas()
        }
    }

    const responder = (resposta) =>
        executar(
            `/fornecedores/propostas/${atual.proposta_id}/resposta`,
            { resposta },
            resposta === 'aceita' ? 'Proposta aceita!' : 'Proposta recusada.',
        )

    const cancelar = () =>
        executar(
            `/organizadores/propostas/${atual.proposta_id}/cancelar`,
            null,
            'Proposta cancelada.',
        )

    const ehDireta = atual?.origem === 'organizador'
    const pendente = atual?.status === 'pendente'
    const vagaPreenchida = atual?.status_vaga === 'preenchida'
    const podeResponder = !souOrganizador && ehDireta && pendente && !vagaPreenchida
    const podeCancelar = souOrganizador && ehDireta && pendente
    const aguardandoOutro = ehDireta && pendente && souOrganizador

    return (
        <main className={styles.pagina}>
            <div className={styles.topo}>
                <div>
                    <h1>MENSAGENS</h1>
                    <p>
                        {souOrganizador
                            ? 'Converse com os fornecedores sobre as propostas dos seus eventos.'
                            : 'Converse com os organizadores sobre as suas propostas.'}
                    </p>
                </div>
                {souOrganizador && (
                    <Link className={styles.botaoPrincipal} to='/organizador/fornecedores'>
                        Fazer proposta direta <span aria-hidden='true'>→</span>
                    </Link>
                )}
            </div>

            {carregando && <p className={styles.vazio}>Carregando conversas…</p>}

            {!carregando && !conversas.length && (
                <section className={styles.semConversas}>
                    <p>Nenhuma conversa ainda.</p>
                    <p>
                        {souOrganizador
                            ? 'Cada proposta recebida ou enviada por você vira uma conversa aqui.'
                            : 'Cada proposta que você enviar ou receber vira uma conversa aqui.'}
                    </p>
                </section>
            )}

            {!carregando && conversas.length > 0 && (
                <div className={styles.layout}>
                    <nav className={styles.lista} aria-label='Conversas'>
                        {conversas.map((c) => (
                            <button
                                key={c.proposta_id}
                                type='button'
                                className={`${styles.itemConversa} ${c.proposta_id === propostaSelecionada ? styles.itemAtivo : ''}`}
                                aria-current={c.proposta_id === propostaSelecionada}
                                onClick={() => setSearchParams({ proposta: String(c.proposta_id) })}
                            >
                                <span className={styles.avatar} aria-hidden='true'>
                                    {iniciais(c.participante.nome)}
                                </span>
                                <span className={styles.itemTexto}>
                                    <b>{c.participante.nome}</b>
                                    <span className={styles.contexto}>
                                        {c.nome_evento} · {c.item}
                                    </span>
                                    <span className={styles.itemLinha}>
                                        <Status status={c.status} />
                                        {c.origem === 'organizador' && (
                                            <span className={styles.direta}>Direta</span>
                                        )}
                                        <b>{dinheiro(c.valor)}</b>
                                    </span>
                                    {c.ultima_mensagem && (
                                        <span className={styles.previa}>{c.ultima_mensagem}</span>
                                    )}
                                </span>
                            </button>
                        ))}
                    </nav>

                    {atual ? (
                        <section className={styles.conversa} aria-label='Conversa'>
                            <header className={styles.conversaTopo}>
                                <span className={styles.avatar} aria-hidden='true'>
                                    {iniciais(atual.participante.nome)}
                                </span>
                                <div>
                                    <b>{atual.participante.nome}</b>
                                    <span>
                                        {atual.nome_evento} · {dataBr(atual.data_evento)}
                                    </span>
                                </div>
                                {souOrganizador && (
                                    <Link
                                        className={styles.linkTopo}
                                        to={`/organizador/eventos/${atual.evento_id}/propostas`}
                                    >
                                        Ver propostas do evento
                                    </Link>
                                )}
                            </header>

                            <div className={styles.proposta}>
                                <div className={styles.propostaLinha}>
                                    <span className={styles.propostaTitulo}>
                                        {ehDireta ? 'Proposta direta' : 'Proposta'} · {atual.item}
                                    </span>
                                    <Status status={atual.status} />
                                </div>
                                <span className={styles.valor}>{dinheiro(atual.valor)}</span>
                                <span>
                                    {atual.descricao} · válida até {dataBr(atual.validade)}
                                </span>
                                {ehDireta && (
                                    <span className={styles.vaga}>
                                        <b>Vaga de serviço:</b>{' '}
                                        {vagaPreenchida ? 'Preenchida' : 'Em aberto'}
                                    </span>
                                )}
                                {aguardandoOutro && (
                                    <span className={styles.ajuda}>
                                        Aguardando {atual.participante.nome} aceitar ou recusar.
                                    </span>
                                )}
                                {ehDireta && atual.status === 'cancelada' && vagaPreenchida && (
                                    <span className={styles.ajuda}>
                                        Cancelada porque a vaga foi preenchida por outro fornecedor.
                                    </span>
                                )}
                                {!ehDireta && pendente && !souOrganizador && (
                                    <span className={styles.ajuda}>
                                        Aguardando o organizador avaliar a proposta.
                                    </span>
                                )}

                                {podeResponder && (
                                    <div className={styles.acoes}>
                                        <button
                                            type='button'
                                            className={styles.aceitar}
                                            disabled={processando}
                                            onClick={() => responder('aceita')}
                                        >
                                            Aceitar
                                        </button>
                                        <button
                                            type='button'
                                            className={styles.recusar}
                                            disabled={processando}
                                            onClick={() => responder('recusada')}
                                        >
                                            Recusar
                                        </button>
                                    </div>
                                )}

                                {podeCancelar && (
                                    <div className={styles.acoes}>
                                        <button
                                            type='button'
                                            className={styles.recusar}
                                            disabled={processando}
                                            onClick={() => setConfirmarCancelar(true)}
                                        >
                                            Cancelar proposta
                                        </button>
                                    </div>
                                )}

                                {aviso && (
                                    <p className={styles.aviso} role='status'>
                                        {aviso}
                                    </p>
                                )}
                            </div>

                            <div className={styles.mensagens}>
                                {!mensagens.length && (
                                    <p className={styles.vazio}>
                                        Nenhuma mensagem ainda. Comece a conversa!
                                    </p>
                                )}
                                {mensagens.map((m) =>
                                    m.tipo === 'sistema' ? (
                                        <div key={m.id} className={styles.sistema}>
                                            {m.conteudo}
                                        </div>
                                    ) : (
                                        <div
                                            key={m.id}
                                            className={`${styles.bolha} ${m.minha ? styles.minha : styles.dele}`}
                                        >
                                            {m.conteudo}
                                            <small>{dataHoraBr(m.criado_em)}</small>
                                        </div>
                                    ),
                                )}
                                <div ref={fimRef} />
                            </div>

                            {erro && (
                                <p className={styles.erro} role='alert'>
                                    {erro}
                                </p>
                            )}

                            {atual.aberta ? (
                                <form className={styles.envio} onSubmit={enviar}>
                                    <label htmlFor='mensagem' className={styles.somenteLeitor}>
                                        Mensagem
                                    </label>
                                    <input
                                        id='mensagem'
                                        type='text'
                                        placeholder='Escreva uma mensagem'
                                        maxLength={1000}
                                        value={rascunho}
                                        onChange={(e) => setRascunho(e.target.value)}
                                    />
                                    <button type='submit' disabled={enviando || !rascunho.trim()}>
                                        Enviar <span aria-hidden='true'>→</span>
                                    </button>
                                </form>
                            ) : (
                                <p className={styles.encerrada}>
                                    Conversa encerrada: a proposta está{' '}
                                    {(STATUS[atual.status]?.rotulo || atual.status).toLowerCase()}.
                                </p>
                            )}
                        </section>
                    ) : (
                        <section className={styles.conversa}>
                            <p className={styles.vazio}>Escolha uma conversa.</p>
                        </section>
                    )}
                </div>
            )}

            {confirmarCancelar && atual && (
                <div
                    className={styles.overlay}
                    role='presentation'
                    onClick={() => setConfirmarCancelar(false)}
                >
                    <section
                        className={styles.modal}
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='tituloCancelar'
                        onClick={(event) => event.stopPropagation()}
                    >
                        <h2 id='tituloCancelar'>Cancelar proposta?</h2>
                        <p>
                            A proposta direta para {atual.participante.nome} será cancelada e a
                            conversa ficará só para leitura. Isso não pode ser desfeito.
                        </p>
                        <div>
                            <button type='button' onClick={() => setConfirmarCancelar(false)}>
                                Voltar
                            </button>
                            <button
                                type='button'
                                className={styles.confirmar}
                                disabled={processando}
                                onClick={cancelar}
                            >
                                Cancelar proposta
                            </button>
                        </div>
                    </section>
                </div>
            )}
        </main>
    )
}

export default Mensagens
