import { useMemo, useState } from 'react'
import ListaEventos from '@/components/ListaEventos/ListaEventos'
import { eventos } from '@/dados/eventos'
import styles from './Eventos.module.css'

const FILTROS = [
    { valor: 'aprovados', rotulo: 'Aprovados', classe: styles.aprovados, status: 'aprovado' },
    { valor: 'reprovados', rotulo: 'Reprovados', classe: styles.reprovados, status: 'reprovado' },
    { valor: 'todos', rotulo: 'Todos', classe: styles.todos, status: null },
]

function Eventos() {
    const [filtro, setFiltro] = useState('todos')
    const [busca, setBusca] = useState('')

    const eventosFiltrados = useMemo(() => {
        const { status } = FILTROS.find((f) => f.valor === filtro)
        return eventos.filter((evento) => {
            const combinaBusca = evento.nome.toLowerCase().includes(busca.toLowerCase())
            const combinaFiltro = !status || evento.status === status
            return combinaBusca && combinaFiltro
        })
    }, [busca, filtro])

    return (
        <main className={styles.pagina}>
            <label className={styles.busca}>
                <span className={styles.somenteLeitorDeTela}>Buscar eventos</span>
                <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder='Buscar'
                />
            </label>

            <div className={styles.filtros} aria-label='Filtrar eventos'>
                {FILTROS.map((f) => (
                    <button
                        key={f.valor}
                        onClick={() => setFiltro(f.valor)}
                        className={`${styles.filtro} ${f.classe} ${filtro === f.valor ? styles.selecionado : ''}`}
                    >
                        {f.rotulo}
                    </button>
                ))}
            </div>

            <ListaEventos eventos={eventosFiltrados} filtro={filtro} />
        </main>
    )
}

export default Eventos
