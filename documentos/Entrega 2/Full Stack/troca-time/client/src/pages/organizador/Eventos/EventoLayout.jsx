import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useParams } from 'react-router-dom'
import { api, usuarioId, dataHoraBr } from '@/utils/api'
import styles from './EventoLayout.module.css'

const LABEL_STATUS = { rascunho: 'Rascunho', em_cotacao: 'Em cotação', publicado: 'Publicado', reprovado: 'Reprovado', encerrado: 'Encerrado' }

function EventoLayout() {
    const { eventoId } = useParams()
    const organizadorId = usuarioId('organizador')
    const [evento, setEvento] = useState(null)
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    async function carregar() {
        setCarregando(true)
        setErro('')
        try { setEvento(await api(`/organizadores/${organizadorId}/eventos/${eventoId}`)) }
        catch (error) { setErro(error.message) }
        finally { setCarregando(false) }
    }

    useEffect(() => { carregar() }, [organizadorId, eventoId])
    const base = `/organizador/eventos/${eventoId}`
    const orcamentoDisponivel = Number(evento?.total_propostas_aceitas || 0) > 0

    if (carregando) return <main className={styles.estado}>Carregando evento…</main>
    if (erro || !evento) return <main className={styles.estado} role='alert'>{erro || 'Evento não encontrado.'}</main>

    return <main className={styles.pagina}>
        <header className={styles.cabecalho}>
            <div><h1>{evento.nome}<span className={`${styles.status} ${styles[`status_${evento.status}`]}`}>{LABEL_STATUS[evento.status] || evento.status}</span></h1>
                <p>{dataHoraBr(evento.inicio)} · {evento.nome_local || 'Local a definir'} · Público {evento.publico_min} a {evento.publico_max} · Margem {Number(evento.margem_lucro).toFixed(0)}%</p>
            </div>
            <Link className={styles.editar} to={`/organizador/eventos/${eventoId}/editar`}>Editar evento</Link>
        </header>
        <nav className={styles.abas} aria-label='Abas do evento'>
            <NavLink end to={base} className={({ isActive }) => isActive ? styles.abaAtiva : styles.aba}>Visão geral</NavLink>
            <NavLink to={`${base}/itens`} className={({ isActive }) => isActive ? styles.abaAtiva : styles.aba}>Itens e custos</NavLink>
            <NavLink to={`${base}/propostas`} className={({ isActive }) => isActive ? styles.abaAtiva : styles.aba}>Propostas</NavLink>
            {orcamentoDisponivel
                ? <NavLink to={`${base}/orcamento`} className={({ isActive }) => isActive ? styles.abaAtiva : styles.aba}>Orçamento e ticket</NavLink>
                : <span className={`${styles.aba} ${styles.abaDesativada}`} title='Selecione uma proposta para liberar o orçamento'>Orçamento e ticket</span>}
        </nav>
        <Outlet context={{ evento, recarregarEvento: carregar, organizadorId }} />
    </main>
}
export default EventoLayout
