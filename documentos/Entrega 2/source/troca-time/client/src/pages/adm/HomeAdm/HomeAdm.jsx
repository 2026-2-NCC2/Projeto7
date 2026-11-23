import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, dataHoraBr, usuarioNome } from '@/utils/api'
import styles from './HomeAdm.module.css'

function HomeAdm() {
    const trilhaRef = useRef(null)
    const [indicadores, setIndicadores] = useState(null)
    const [eventos, setEventos] = useState([])

    useEffect(() => {
        Promise.all([api('/admin/resumo'), api('/eventos/')])
            .then(([resumo, resposta]) => {
                setIndicadores(resumo)
                setEventos(resposta.eventos || [])
            })
            .catch((erro) => alert(erro.message))
    }, [])

    function moverCarrossel(direcao) {
        const trilha = trilhaRef.current
        if (!trilha) return
        const cartao = trilha.querySelector('article')
        const distancia = cartao ? cartao.getBoundingClientRect().width + 12 : trilha.clientWidth
        trilha.scrollBy({ left: distancia * direcao, behavior: 'smooth' })
    }

    const hoje = new Date().toLocaleDateString('sv-SE')
    const proximosEventos = eventos.filter((evento) => evento.data >= hoje)

    return (
        <main className={styles.painel}>
            <header className={styles.boasVindas}>
                <h1>Olá, {usuarioNome()}</h1>
                <p>Bem-vindo de volta!</p>
            </header>

            <section className={styles.eventos} aria-labelledby='titulo-eventos'>
                <div className={styles.cabecalhoEventos}>
                    <h2 id='titulo-eventos'>Próximos eventos</h2>
                    <div className={styles.controlesCarrossel}>
                        <button
                            type='button'
                            onClick={() => moverCarrossel(-1)}
                            aria-label='Ver eventos anteriores'
                        >
                            ‹
                        </button>
                        <button
                            type='button'
                            onClick={() => moverCarrossel(1)}
                            aria-label='Ver próximos eventos'
                        >
                            ›
                        </button>
                    </div>
                </div>

                {proximosEventos.length ? (
                    <div className={styles.trilha} ref={trilhaRef}>
                        {proximosEventos.map((evento) => (
                            <article className={styles.cartaoEvento} key={evento.id}>
                                <h3>{evento.nome}</h3>
                                <p>
                                    Dia e hora:{' '}
                                    {dataHoraBr(`${evento.data} ${evento.horario_inicio}`)}
                                </p>
                                <p>Organizador: {evento.nome_organizador}</p>
                                <p>Local: {evento.nome_local}</p>
                                <Link to={`/eventos/${evento.id}`} className={styles.botaoVer}>
                                    Ver
                                </Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className={styles.vazio}>Não há próximos eventos cadastrados.</p>
                )}

                <Link to='/eventos' className={styles.botaoTodos}>
                    Ver todos os eventos
                </Link>
            </section>

            <section className={styles.resumo} aria-labelledby='titulo-resumo'>
                <h2 id='titulo-resumo'>Resumo da plataforma:</h2>
                <div className={styles.indicadores}>
                    <article className={styles.indicador}>
                        <h3>Cadastros pendentes</h3>
                        <strong>{indicadores?.total_cadastros_pendentes ?? '–'}</strong>
                    </article>
                    <article className={styles.indicador}>
                        <h3>Eventos em cotação</h3>
                        <strong>{indicadores?.total_eventos_cotacao ?? '–'}</strong>
                    </article>
                    <article className={styles.indicador}>
                        <h3>Propostas recebidas</h3>
                        <strong>{indicadores?.total_propostas_recebidas ?? '–'}</strong>
                    </article>
                    <article className={styles.indicador}>
                        <h3>Tickets Publicados</h3>
                        <strong>–</strong>
                    </article>
                </div>
            </section>
        </main>
    )
}

export default HomeAdm
