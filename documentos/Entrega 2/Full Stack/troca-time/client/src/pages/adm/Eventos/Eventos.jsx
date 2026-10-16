import { useMemo, useState } from 'react'
import { eventos } from '@/dados/eventos'
import BuscaEventos from '@/components/BuscaEventos/BuscaEventos'
import BotaoFiltroEvento from '@/components/BotaoFiltroEvento/BotaoFiltroEvento'
import CartaoEvento from '@/components/CartaoEvento/CartaoEvento'
import styles from './Eventos.module.css'

const FILTROS = [
    { valor: 'aprovados', rotulo: 'Aprovados', status: 'aprovado' },
    { valor: 'reprovados', rotulo: 'Reprovados', status: 'reprovado' },
    { valor: 'todos', rotulo: 'Todos', status: null },
]

function Eventos() {
    const [filtro, setFiltro] = useState('todos')
    const [busca, setBusca] = useState('')
    const eventosFiltrados = useMemo(() => {
        const { status } = FILTROS.find((item) => item.valor === filtro)
        return eventos.filter((evento) => evento.nome.toLowerCase().includes(busca.toLowerCase()) && (!status || evento.status === status))
    }, [busca, filtro])

    return <main className={styles.pagina}>
        <BuscaEventos valor={busca} onChange={setBusca} />
        <div className={styles.filtros} role='group' aria-label='Filtrar eventos'>
            {FILTROS.map((item) => <BotaoFiltroEvento key={item.valor} item={item} ativo={filtro === item.valor} onClick={() => setFiltro(item.valor)} />)}
        </div>
        <section className={styles.lista} aria-label='Lista de eventos'>
            {eventosFiltrados.map((evento) => <CartaoEvento evento={evento} key={evento.id} />)}
            {eventosFiltrados.length === 0 && <p className={styles.vazio}>Nenhum evento encontrado.</p>}
        </section>
    </main>
}

export default Eventos
