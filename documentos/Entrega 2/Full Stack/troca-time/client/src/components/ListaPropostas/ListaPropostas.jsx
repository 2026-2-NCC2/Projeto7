import { useMemo, useState } from 'react'
import { eventos } from '@/dados/eventos'
import propostas from '@/dados/propostas.json'
import show from '@/assets/show.jpg.webp'
import styles from './ListaPropostas.module.css'

const FILTROS = [
    { id: 'pendente', rotulo: 'Pendentes' },
    { id: 'aprovado', rotulo: 'Aprovados' },
    { id: 'reprovado', rotulo: 'Reprovados' },
    { id: 'todos', rotulo: 'Todos' },
]

function ListaPropostas({ perfil }) {
    const [filtro, setFiltro] = useState('todos')
    const [busca, setBusca] = useState('')
    const [selecionada, setSelecionada] = useState(null)
    const lista = useMemo(() => propostas.map((proposta) => ({
        ...proposta,
        evento: eventos.find((evento) => evento.id === proposta.eventoId),
    })).filter(({ evento, servico, status }) => {
        const texto = `${evento?.nome ?? ''} ${evento?.local ?? ''} ${servico}`.toLowerCase()
        return texto.includes(busca.toLowerCase()) && (filtro === 'todos' || status === filtro)
    }), [busca, filtro])

    return <main className={styles.pagina}>
        <label className={styles.busca}><span className={styles.srOnly}>Buscar propostas</span><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder='Buscar' /></label>
        <div className={styles.filtros} role='group' aria-label='Filtrar propostas'>
            {FILTROS.map((item) => <button key={item.id} type='button' aria-pressed={filtro === item.id} className={`${styles.filtro} ${styles[item.id]} ${filtro === item.id ? styles.selecionado : ''}`} onClick={() => setFiltro(item.id)}>{item.rotulo}</button>)}
        </div>
        <section className={styles.lista} aria-label='Propostas de eventos'>
            {lista.map((proposta) => <article className={styles.cartao} key={proposta.id}>
                <img className={styles.imagem} src={show} alt={`Foto do evento ${proposta.evento.nome}`} />
                <div className={styles.evento}><h2>{proposta.evento.nome}</h2><p><b>DATA E HORA:</b> {proposta.evento.data}</p><p><b>LOCAL:</b> {proposta.evento.local}</p></div>
                <div className={styles.proposta}><p><b>SERVIÇO:</b> {proposta.servico}</p><p><b>VALOR:</b> {proposta.valor}</p></div>
                <button type='button' className={styles.verMais} onClick={() => setSelecionada(proposta)}>Ver mais</button>
            </article>)}
            {lista.length === 0 && <p className={styles.vazio}>Nenhuma proposta encontrada.</p>}
        </section>
        {selecionada && <div className={styles.overlay} onClick={() => setSelecionada(null)}><section className={styles.modal} role='dialog' aria-modal='true' aria-labelledby='titulo-proposta' onClick={(e) => e.stopPropagation()}>
            <button type='button' className={styles.fechar} onClick={() => setSelecionada(null)} aria-label='Fechar'>×</button>
            <h2 id='titulo-proposta'>{eventos.find((evento) => evento.id === selecionada.eventoId)?.nome}</h2>
            <p><b>Data e hora:</b> {eventos.find((evento) => evento.id === selecionada.eventoId)?.data}</p><p><b>Local:</b> {eventos.find((evento) => evento.id === selecionada.eventoId)?.local}</p><p><b>Serviço:</b> {selecionada.servico}</p><p><b>Valor:</b> {selecionada.valor}</p><p><b>Status:</b> {selecionada.status}</p>
            <p><b>{perfil === 'fornecedor' ? 'Organizador:' : 'Fornecedor:'}</b> {eventos.find((evento) => evento.id === selecionada.eventoId)?.[perfil === 'fornecedor' ? 'organizador' : 'fornecedor']}</p>
        </section></div>}
    </main>
}

export default ListaPropostas
