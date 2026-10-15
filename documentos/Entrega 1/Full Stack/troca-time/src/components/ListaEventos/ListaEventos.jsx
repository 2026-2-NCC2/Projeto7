import CartaoEvento from '@/components/CartaoEvento/CartaoEvento'
import styles from './ListaEventos.module.css'

function ListaEventos({ eventos, filtro }) {
    if (!eventos || eventos.length === 0) {
        return <p>Nenhum evento encontrado.</p>
    }

    return (
        <section className={styles.lista} aria-label={`Eventos ${filtro}`}>
            {eventos.map((evento) => (
                <CartaoEvento evento={evento} key={evento.id} />
            ))}
        </section>
    )
}

export default ListaEventos
