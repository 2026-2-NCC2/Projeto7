import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { buscarIndicadores, buscarCadastrosPendentes } from '@/dados/painelAdm'
import { eventos } from '@/dados/eventos'
import styles from './HomeAdm.module.css'

function formatarDataEvento(data) {
    const [dataEvento, hora] = data.split(' - ')
    return `${dataEvento}, ${hora.replace(':', 'h')}`
}

function formatarMoeda(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function HomeAdm() {
    const trilhaRef = useRef(null)
    const [indicadores, setIndicadores] = useState(null)
    const [pendentes, setPendentes] = useState(0)

    useEffect(() => {
        let ativo = true
        Promise.all([buscarIndicadores('30d'), buscarCadastrosPendentes()]).then(
            ([resumo, cadastros]) => {
                if (!ativo) return
                setIndicadores(resumo)
                setPendentes(cadastros.length)
            },
        )
        return () => { ativo = false }
    }, [])

    function moverCarrossel(direcao) {
        const trilha = trilhaRef.current
        if (!trilha) return
        const cartao = trilha.querySelector('article')
        const distancia = cartao ? cartao.getBoundingClientRect().width + 12 : trilha.clientWidth
        trilha.scrollBy({ left: distancia * direcao, behavior: 'smooth' })
    }

    const proximosEventos = eventos.filter((evento) => {
        const [dia, mes, ano] = evento.data.split(' - ')[0].split('/')
        const dataEvento = new Date(Number(ano), Number(mes) - 1, Number(dia))
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)
        return dataEvento >= hoje
    })

    return (
        <main className={styles.painel}>
            <header className={styles.boasVindas}>
                <h1>Olá, Administrador</h1>
                <p>Bem-vindo de volta!</p>
            </header>

            <section className={styles.eventos} aria-labelledby='titulo-eventos'>
                <div className={styles.cabecalhoEventos}>
                    <h2 id='titulo-eventos'>Próximos eventos</h2>
                    <div className={styles.controlesCarrossel}>
                        <button type='button' onClick={() => moverCarrossel(-1)} aria-label='Ver eventos anteriores'>‹</button>
                        <button type='button' onClick={() => moverCarrossel(1)} aria-label='Ver próximos eventos'>›</button>
                    </div>
                </div>

                {proximosEventos.length ? (
                    <div className={styles.trilha} ref={trilhaRef}>
                        {proximosEventos.map((evento) => (
                            <article className={styles.cartaoEvento} key={evento.id}>
                                <h3>{evento.nome}</h3>
                                <p>Dia e hora: {formatarDataEvento(evento.data)}</p>
                                <p>Organizador: {evento.organizador}</p>
                                <p>Local: {evento.local}</p>
                                <Link to={`/eventos/${evento.id}`} className={styles.botaoVer}>Ver</Link>
                            </article>
                        ))}
                    </div>
                ) : (
                    <p className={styles.vazio}>Não há próximos eventos cadastrados.</p>
                )}

                <Link to='/eventos' className={styles.botaoTodos}>Ver todos os eventos</Link>
            </section>

            <section className={styles.resumo} aria-labelledby='titulo-resumo'>
                <h2 id='titulo-resumo'>Resumo da plataforma:</h2>
                <div className={styles.indicadores}>
                    <article className={styles.indicador}>
                        <h3>Cadastros pendentes</h3>
                        <strong>{indicadores ? pendentes : '–'}</strong>
                    </article>
                    <article className={styles.indicador}>
                        <h3>Eventos em cotação</h3>
                        <strong>{indicadores?.eventosEmCotacao ?? '–'}</strong>
                    </article>
                    <article className={styles.indicador}>
                        <h3>Propostas recebidas</h3>
                        <strong>{indicadores?.propostasRecebidas ?? '–'}</strong>
                        <p>nos últimos 30 dias</p>
                    </article>
                    <article className={styles.indicador}>
                        <h3>Ticket médio estimado</h3>
                        <strong>{indicadores ? formatarMoeda(indicadores.ticketMedio) : '–'}</strong>
                        <p>média dos eventos</p>
                    </article>
                </div>
            </section>
        </main>
    )
}

export default HomeAdm
