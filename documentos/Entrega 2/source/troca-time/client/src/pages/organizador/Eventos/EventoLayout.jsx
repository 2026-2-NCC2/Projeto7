import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { api, usuarioId } from '@/utils/api'
import styles from './EventoLayout.module.css'

const LABEL_STATUS = {
    rascunho: 'Rascunho',
    em_cotacao: 'Em cotação',
    publicado: 'Publicado',
    encerrado: 'Encerrado',
}
const CLASSE_STATUS = {
    rascunho: styles.statusRascunho,
    em_cotacao: styles.statusEmCotacao,
    publicado: styles.statusPublicado,
    encerrado: styles.statusEncerrado,
}

function EventoLayout() {
    const { eventoId } = useParams()
    const organizadorId = usuarioId('organizador')
    const [evento, setEvento] = useState(null)
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    async function carregar() {
        setCarregando(true)
        setErro('')
        try {
            setEvento(await api(`/eventos/${eventoId}`))
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregar()
    }, [organizadorId, eventoId])
    const base = `/organizador/eventos/${eventoId}`
    const orcamentoDisponivel = ['em_cotacao', 'publicado', 'encerrado'].includes(evento?.status)
    const rascunho = evento?.status === 'rascunho'
    const emCotacao = evento?.status === 'em_cotacao'
    const publicado = evento?.status === 'publicado'

    async function disponibilizarParaCotacao() {
        try {
            await api(`/organizadores/${eventoId}/status?novo_status=em_cotacao`, {
                method: 'PATCH',
            })
            await carregar()
        } catch (error) {
            alert(error.message)
        }
    }

    async function publicarEvento() {
        try {
            await api(`/organizadores/${eventoId}/status?novo_status=publicado`, {
                method: 'PATCH',
            })
            await carregar()
        } catch (error) {
            alert(error.message)
        }
    }

    async function encerrarEvento() {
        if (!confirm('Deseja encerrar este evento? Essa ação não pode ser desfeita.')) return
        try {
            await api(`/organizadores/${eventoId}/status?novo_status=encerrado`, {
                method: 'PATCH',
            })
            await carregar()
        } catch (error) {
            alert(error.message)
        }
    }

    if (carregando && !evento) return <main className={styles.estado}>Carregando evento…</main>
    if (erro || !evento)
        return (
            <main className={styles.estado} role='alert'>
                {erro || 'Evento não encontrado.'}
            </main>
        )

    return (
        <main className={styles.pagina}>
            <header className={styles.cabecalho}>
                <div>
                    <h1>
                        {evento.nome}
                        <span className={`${styles.status} ${CLASSE_STATUS[evento.status] || ''}`}>
                            {LABEL_STATUS[evento.status] || evento.status}
                        </span>
                    </h1>
                </div>
                <div className={styles.acoesCabecalho}>
                    {rascunho && (
                        <button
                            type='button'
                            className={styles.disponibilizar}
                            onClick={disponibilizarParaCotacao}
                        >
                            Disponibilizar evento para cotação
                        </button>
                    )}
                    {emCotacao && (
                        <button type='button' className={styles.publicar} onClick={publicarEvento}>
                            Publicar evento
                        </button>
                    )}
                    {publicado && (
                        <button type='button' className={styles.encerrar} onClick={encerrarEvento}>
                            Encerrar evento
                        </button>
                    )}
                    {rascunho && (
                        <Link
                            className={styles.editar}
                            to={`/organizador/eventos/${eventoId}/editar`}
                        >
                            Editar evento
                        </Link>
                    )}
                </div>
            </header>
            <nav className={styles.abas} aria-label='Abas do evento'>
                <NavLink
                    end
                    to={base}
                    className={({ isActive }) => (isActive ? styles.abaAtiva : styles.aba)}
                >
                    Visão geral
                </NavLink>
                {rascunho ? (
                    <>
                        <span
                            className={`${styles.aba} ${styles.abaDesativada}`}
                            title='Disponibilize o evento para cotação para liberar'
                        >
                            Itens e custos
                        </span>
                        <span
                            className={`${styles.aba} ${styles.abaDesativada}`}
                            title='Disponibilize o evento para cotação para liberar'
                        >
                            Propostas
                        </span>
                    </>
                ) : (
                    <>
                        <NavLink
                            to={`${base}/itens`}
                            className={({ isActive }) => (isActive ? styles.abaAtiva : styles.aba)}
                        >
                            Itens e custos
                        </NavLink>
                        <NavLink
                            to={`${base}/propostas`}
                            className={({ isActive }) => (isActive ? styles.abaAtiva : styles.aba)}
                        >
                            Propostas
                        </NavLink>
                    </>
                )}
                {orcamentoDisponivel ? (
                    <NavLink
                        to={`${base}/orcamento`}
                        className={({ isActive }) => (isActive ? styles.abaAtiva : styles.aba)}
                    >
                        Orçamento e ticket
                    </NavLink>
                ) : (
                    <span
                        className={`${styles.aba} ${styles.abaDesativada}`}
                        title='Disponibilize o evento para cotação para liberar'
                    >
                        Orçamento e ticket
                    </span>
                )}
            </nav>
            <Outlet context={{ evento, recarregarEvento: carregar, organizadorId }} />
        </main>
    )
}
export default EventoLayout
