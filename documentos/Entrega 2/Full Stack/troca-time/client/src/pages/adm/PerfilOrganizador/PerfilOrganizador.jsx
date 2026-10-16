import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    atualizarStatusOrganizador,
    buscarOrganizador,
    excluirOrganizador,
} from '@/dados/organizadores'
import styles from './PerfilOrganizador.module.css'

const STATUS = {
    pendente: { rotulo: 'Pendente', classe: styles.statusPendente },
    aprovado: { rotulo: 'Aprovado', classe: styles.statusAprovado },
    rejeitado: { rotulo: 'Rejeitado', classe: styles.statusRejeitado },
}

const AVALIACOES_VISIVEIS = 2

function Estrelas({ nota }) {
    return (
        <span className={styles.estrelas} aria-label={`Nota ${nota} de 5`}>
            {[1, 2, 3, 4, 5].map((n) => (
                <span key={n} aria-hidden='true' className={n <= nota ? styles.cheia : ''}>
                    ★
                </span>
            ))}
        </span>
    )
}

function Seta({ direcao = 'direita' }) {
    const rotacao = { direita: 0, baixo: 90, cima: -90 }[direcao]
    return (
        <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            aria-hidden='true'
            style={{ transform: `rotate(${rotacao}deg)` }}
        >
            <path
                d='M5 12h14M13 6l6 6-6 6'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            />
        </svg>
    )
}

function PerfilOrganizador() {
    const { id } = useParams()
    const navegar = useNavigate()

    const [organizador, setOrganizador] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')
    const [tentativa, setTentativa] = useState(0)

    const [salvando, setSalvando] = useState(false)
    const [mensagem, setMensagem] = useState('')
    const [eventoAberto, setEventoAberto] = useState(null)
    const [todasAvaliacoes, setTodasAvaliacoes] = useState(false)
    const [carrosselNoFim, setCarrosselNoFim] = useState(false)

    const carrosselRef = useRef(null)

    useEffect(() => {
        let ativo = true
        setCarregando(true)
        setErro('')

        buscarOrganizador(id)
            .then((dados) => ativo && setOrganizador(dados))
            .catch(() => ativo && setErro('Não foi possível carregar o organizador.'))
            .finally(() => ativo && setCarregando(false))

        return () => {
            ativo = false
        }
    }, [id, tentativa])

    // Fecha o modal com a tecla Esc
    useEffect(() => {
        if (!eventoAberto) return
        const fechar = (e) => e.key === 'Escape' && setEventoAberto(null)
        window.addEventListener('keydown', fechar)
        return () => window.removeEventListener('keydown', fechar)
    }, [eventoAberto])

    function atualizarSetaCarrossel() {
        const el = carrosselRef.current
        if (!el) return
        setCarrosselNoFim(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4)
    }

    function avancarCarrossel() {
        const el = carrosselRef.current
        if (!el) return
        if (carrosselNoFim) {
            el.scrollTo({ left: 0, behavior: 'smooth' })
        } else {
            el.scrollBy({ left: el.clientWidth, behavior: 'smooth' })
        }
    }

    async function aprovar() {
        setSalvando(true)
        setMensagem('')
        try {
            await atualizarStatusOrganizador(organizador.id, 'aprovado')
            setOrganizador({ ...organizador, status: 'aprovado' })
            setMensagem('Organizador aprovado.')
        } catch {
            setMensagem('Não foi possível aprovar. Tente de novo.')
        } finally {
            setSalvando(false)
        }
    }

    async function excluir() {
        if (!window.confirm(`Excluir ${organizador.nome}? Essa ação não pode ser desfeita.`)) return
        setSalvando(true)
        setMensagem('')
        try {
            await excluirOrganizador(organizador.id)
            navegar('/adm')
        } catch {
            setMensagem('Não foi possível excluir. Tente de novo.')
            setSalvando(false)
        }
    }

    /* ---------- Estados de carregamento, erro e não encontrado ---------- */
    if (carregando) {
        return (
            <main className={styles.pagina}>
                <p className={styles.estado} role='status'>
                    <span className={styles.spinner} aria-hidden='true' /> Carregando organizador…
                </p>
            </main>
        )
    }

    if (erro) {
        return (
            <main className={styles.pagina}>
                <div className={`${styles.estado} ${styles.estadoErro}`} role='alert'>
                    <p>{erro}</p>
                    <button
                        type='button'
                        className={`${styles.botao} ${styles.botaoContorno}`}
                        onClick={() => setTentativa((n) => n + 1)}
                    >
                        Tentar de novo
                    </button>
                </div>
            </main>
        )
    }

    if (!organizador) {
        return (
            <main className={styles.pagina}>
                <div className={styles.estado}>
                    <p>Organizador não encontrado.</p>
                    <Link to='/adm' className={`${styles.botao} ${styles.botaoContorno}`}>
                        Voltar ao painel
                    </Link>
                </div>
            </main>
        )
    }

    const avaliacoesExibidas = todasAvaliacoes
        ? organizador.avaliacoes
        : organizador.avaliacoes.slice(0, AVALIACOES_VISIVEIS)

    return (
        <main className={styles.pagina}>
            {/* ---------- Dados do organizador ---------- */}
            <section className={styles.dados} aria-labelledby='org-nome'>
                <h1 id='org-nome' className={styles.nome}>
                    {organizador.nome}
                </h1>
                <div className={styles.dadosCorpo}>
                    <div className={styles.foto} aria-hidden='true'>
                        <svg viewBox='0 0 100 100'>
                            <circle cx='50' cy='38' r='17' />
                            <path d='M18 88c4-18 17-28 32-28s28 10 32 28z' />
                        </svg>
                    </div>
                    <dl className={styles.info}>
                        <div>
                            <dt>CPF/CNPJ:</dt>
                            <dd>{organizador.documento}</dd>
                        </div>
                        <div>
                            <dt>Cidade:</dt>
                            <dd>{organizador.cidade}</dd>
                        </div>
                        <div>
                            <dt>Estado:</dt>
                            <dd>{organizador.estado}</dd>
                        </div>
                        <div className={styles.descricao}>
                            <dt>Descrição</dt>
                            <dd>{organizador.descricao}</dd>
                        </div>
                    </dl>
                </div>
            </section>

            {/* ---------- Próximos eventos ---------- */}
            <section className={styles.eventos} aria-labelledby='org-eventos-titulo'>
                <h2 id='org-eventos-titulo' className={styles.selo}>
                    Próximos eventos
                </h2>

                {organizador.eventos.length === 0 ? (
                    <p className={styles.vazio}>Este organizador ainda não cadastrou eventos.</p>
                ) : (
                    <div className={styles.carrossel}>
                        <ul
                            className={styles.carrosselTrilho}
                            ref={carrosselRef}
                            onScroll={atualizarSetaCarrossel}
                        >
                            {organizador.eventos.map((evento) => (
                                <li key={evento.id} className={styles.evento}>
                                    <h3>{evento.nome}</h3>
                                    <p>
                                        <b>Informações do evento:</b> {evento.info}
                                    </p>
                                    <p>
                                        <b>Dia e hora:</b> {evento.data}
                                    </p>
                                    <p>
                                        <b>Organizador:</b> {organizador.nome}
                                    </p>
                                    <p>
                                        <b>Local:</b> {evento.local}
                                    </p>
                                    <button
                                        type='button'
                                        className={`${styles.botao} ${styles.botaoLima}`}
                                        onClick={() => setEventoAberto(evento)}
                                    >
                                        Saiba mais
                                    </button>
                                </li>
                            ))}
                        </ul>
                        {organizador.eventos.length > 1 && (
                            <button
                                type='button'
                                className={styles.seta}
                                onClick={avancarCarrossel}
                                aria-label={
                                    carrosselNoFim
                                        ? 'Voltar ao primeiro evento'
                                        : 'Próximos eventos'
                                }
                            >
                                <Seta direcao={carrosselNoFim ? 'cima' : 'direita'} />
                            </button>
                        )}
                    </div>
                )}
            </section>

            {/* ---------- Avaliações e status ---------- */}
            <div className={styles.rodape}>
                <section className={styles.avaliacoes} aria-labelledby='org-avaliacoes-titulo'>
                    <h2 id='org-avaliacoes-titulo'>Avaliações</h2>
                    {organizador.avaliacoes.length === 0 ? (
                        <p className={styles.vazio}>Ainda não há avaliações.</p>
                    ) : (
                        <>
                            <ul>
                                {avaliacoesExibidas.map((av) => (
                                    <li key={av.id} className={styles.avaliacao}>
                                        <p className={styles.avaliacaoNome}>{av.usuario}</p>
                                        <p>
                                            <b>Avaliação:</b> <Estrelas nota={av.nota} />
                                        </p>
                                        <p>
                                            <b>Descrição:</b> {av.texto}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                            {organizador.avaliacoes.length > AVALIACOES_VISIVEIS && (
                                <button
                                    type='button'
                                    className={`${styles.seta} ${styles.setaPequena}`}
                                    onClick={() => setTodasAvaliacoes((v) => !v)}
                                    aria-expanded={todasAvaliacoes}
                                    aria-label={
                                        todasAvaliacoes
                                            ? 'Mostrar menos avaliações'
                                            : 'Mostrar todas as avaliações'
                                    }
                                >
                                    <Seta direcao={todasAvaliacoes ? 'cima' : 'baixo'} />
                                </button>
                            )}
                        </>
                    )}
                </section>

                <section className={styles.status} aria-labelledby='org-status-titulo'>
                    <p className={styles.statusAtual}>
                        <span id='org-status-titulo'>Status:</span>
                        <span
                            className={`${styles.statusSelo} ${STATUS[organizador.status].classe}`}
                        >
                            {STATUS[organizador.status].rotulo}
                        </span>
                    </p>
                    <h2>Editar status</h2>
                    <button
                        type='button'
                        className={`${styles.botao} ${styles.botaoVinho}`}
                        onClick={excluir}
                        disabled={salvando}
                    >
                        Excluir organizador
                    </button>
                    <button
                        type='button'
                        className={`${styles.botao} ${styles.botaoLima}`}
                        onClick={aprovar}
                        disabled={salvando || organizador.status === 'aprovado'}
                    >
                        Aprovar organizador
                    </button>
                    <p className={styles.mensagem} role='status' aria-live='polite'>
                        {mensagem}
                    </p>
                </section>
            </div>

            {/* ---------- Modal: detalhes do evento ---------- */}
            {eventoAberto && (
                <div className={styles.modalFundo} onClick={() => setEventoAberto(null)}>
                    <div
                        className={styles.modal}
                        role='dialog'
                        aria-modal='true'
                        aria-labelledby='org-modal-titulo'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 id='org-modal-titulo'>{eventoAberto.nome}</h2>
                        <p>
                            <b>Informações:</b> {eventoAberto.info}
                        </p>
                        <p>
                            <b>Dia e hora:</b> {eventoAberto.data}
                        </p>
                        <p>
                            <b>Organizador:</b> {organizador.nome}
                        </p>
                        <p>
                            <b>Local:</b> {eventoAberto.local}
                        </p>
                        <button
                            type='button'
                            className={`${styles.botao} ${styles.botaoLima}`}
                            onClick={() => setEventoAberto(null)}
                            autoFocus
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </main>
    )
}

export default PerfilOrganizador
