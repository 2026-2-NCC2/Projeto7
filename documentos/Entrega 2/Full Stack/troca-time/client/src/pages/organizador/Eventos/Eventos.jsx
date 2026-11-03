import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BuscaEventos from '@/components/BuscaEventos/BuscaEventos'
import { api, dataHoraBr, usuarioId } from '@/utils/api'
import styles from './Eventos.module.css'

const FILTROS = [
    { id: 'todos', label: 'Todos' },
    { id: 'rascunho', label: 'Rascunho' },
    { id: 'em_cotacao', label: 'Em cotação' },
    { id: 'publicado', label: 'Publicado' },
]
const LABEL_STATUS = { rascunho: 'Rascunho', em_cotacao: 'Em cotação', publicado: 'Publicado', reprovado: 'Reprovado', encerrado: 'Encerrado' }
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

function EventosOrganizador() {
    const organizadorId = usuarioId('organizador')
    const [dados, setDados] = useState({ organizador: null, eventos: [] })
    const [busca, setBusca] = useState('')
    const [filtro, setFiltro] = useState('todos')
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    async function carregar() {
        setCarregando(true)
        setErro('')
        try {
            setDados(await api(`/organizadores/${organizadorId}/eventos`))
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => { carregar() }, [organizadorId])

    const eventos = useMemo(() => (dados.eventos || []).filter((evento) => {
        const texto = `${evento.nome} ${evento.nome_local || ''} ${evento.descricao || ''}`.toLowerCase()
        return texto.includes(busca.toLowerCase()) && (filtro === 'todos' || evento.status === filtro)
    }), [dados.eventos, busca, filtro])

    return <main className={styles.pagina}>
        <header className={styles.intro}>
            <div><h1>Olá, {dados.organizador?.nome || '...'}</h1><p>Acompanhe as cotações e o ticket estimado dos seus eventos.</p></div>
            <Link className={styles.novoEvento} to='/organizador/eventos/novo'>+ Novo evento</Link>
        </header>
        <BuscaEventos valor={busca} onChange={setBusca} />
        <div className={styles.filtros} role='group' aria-label='Filtrar eventos por status'>
            {FILTROS.map((item) => <button key={item.id} type='button' aria-pressed={filtro === item.id} className={`${styles.filtro} ${styles[`filtro_${item.id}`]} ${filtro === item.id ? styles.ativo : ''}`} onClick={() => setFiltro(item.id)}>{item.label}</button>)}
        </div>
        <section className={styles.lista} aria-label='Meus eventos'>
            {carregando && <p className={styles.estado}>Carregando eventos…</p>}
            {erro && <p className={styles.erro} role='alert'>{erro} <button type='button' onClick={carregar}>Tentar novamente</button></p>}
            {!carregando && !erro && eventos.map((evento) => {
                const inicio = String(evento.inicio || '').slice(0, 10).split('-')
                const dia = inicio[2] || '—'
                const mes = inicio[1] ? MESES[Number(inicio[1]) - 1] : ''
                return <article className={styles.cartao} key={evento.id}>
                    <div className={styles.data}><strong>{dia}</strong><span>{mes}</span></div>
                    <div className={styles.dados}><h2>{evento.nome}<span className={`${styles.status} ${styles[`status_${evento.status}`]}`}>{LABEL_STATUS[evento.status] || evento.status}</span></h2>
                        <p><b>DATA E HORA:</b> {dataHoraBr(evento.inicio)}</p>
                        <p><b>LOCAL:</b> {evento.nome_local || 'A definir'}</p>
                        <p><b>PROPOSTAS:</b> {evento.quantidade_propostas || 0} recebidas</p>
                        <p><b>TICKET ESTIMADO:</b> {evento.ticket_publico_min == null ? '—' : `R$ ${Number(evento.ticket_publico_min).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} a R$ ${Number(evento.ticket_publico_max).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</p>
                    </div>
                    <div className={styles.descricao}><b>Descrição</b><p>{evento.descricao || 'Sem descrição cadastrada.'}</p><Link to={`/organizador/eventos/${evento.id}`}>Ver mais</Link></div>
                </article>
            })}
            {!carregando && !erro && !eventos.length && <p className={styles.estado}>Nenhum evento encontrado.</p>}
        </section>
    </main>
}
export default EventosOrganizador
