import { useEffect, useMemo, useState } from 'react'
import { api } from '@/utils/api'
import CartaoEventoAdm from './CartaoEventoAdm'
import styles from './Eventos.module.css'

const FILTROS = [
    { valor: 'em_cotacao', rotulo: 'Em cotação', classe: 'emCotacao' },
    { valor: 'publicado', rotulo: 'Publicado', classe: 'publicado' },
    { valor: 'encerrado', rotulo: 'Encerrado', classe: 'encerrado' },
    { valor: 'todos', rotulo: 'Todos', classe: 'todos' },
]

function Eventos() {
    const [filtro, setFiltro] = useState('todos')
    const [busca, setBusca] = useState('')
    const [eventos, setEventos] = useState([])

    useEffect(() => {
        api('/eventos/')
            .then((resposta) =>
                setEventos(
                    (resposta.eventos || []).filter((evento) => evento.status !== 'rascunho'),
                ),
            )
            .catch((erro) => alert(erro.message))
    }, [])

    const eventosFiltrados = useMemo(() => {
        const termo = busca.trim().toLocaleLowerCase('pt-BR')
        return eventos.filter((evento) => {
            const correspondeBusca =
                `${evento.nome} ${evento.nome_organizador} ${evento.nome_local}`
                    .toLocaleLowerCase('pt-BR')
                    .includes(termo)
            return correspondeBusca && (filtro === 'todos' || evento.status === filtro)
        })
    }, [eventos, busca, filtro])

    return (
        <main className={styles.pagina}>
            <h1 className={styles.titulo}>EVENTOS</h1>
            <label className={styles.busca}>
                <span className={styles.srOnly}>Buscar eventos</span>
                <input
                    value={busca}
                    onChange={(evento) => setBusca(evento.target.value)}
                    placeholder='Buscar'
                />
            </label>
            <div className={styles.filtros} role='group' aria-label='Filtrar eventos'>
                {FILTROS.map((item) => (
                    <button
                        key={item.valor}
                        type='button'
                        aria-pressed={filtro === item.valor}
                        className={`${styles.filtro} ${styles[item.classe]} ${filtro === item.valor ? styles.selecionado : ''}`}
                        onClick={() => setFiltro(item.valor)}
                    >
                        {item.rotulo}
                    </button>
                ))}
            </div>
            <section className={styles.lista} aria-label='Lista de eventos'>
                {eventosFiltrados.map((evento) => (
                    <CartaoEventoAdm evento={evento} key={evento.id} />
                ))}
                {eventosFiltrados.length === 0 && (
                    <p className={styles.vazio}>Nenhum evento encontrado.</p>
                )}
            </section>
        </main>
    )
}

export default Eventos
