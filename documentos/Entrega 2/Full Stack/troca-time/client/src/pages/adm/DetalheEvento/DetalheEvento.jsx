import { Link, useParams } from 'react-router-dom'
import Titulo from '@/components/Titulo/Titulo'
import { eventos } from '@/dados/eventos'
import styles from './DetalheEvento.module.css'

function DetalheEvento() {
    const { id } = useParams()
    const evento = eventos.find((item) => item.id === Number(id))

    return (
        <main className={styles.pagina}>
            <Titulo>{evento?.nome || 'Evento não encontrado'}</Titulo>
            <p>Esta é a página de detalhes do evento.</p>
            <Link to='/eventos'>Voltar para eventos</Link>
        </main>
    )
}

export default DetalheEvento
