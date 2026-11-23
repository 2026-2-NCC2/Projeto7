import { Link } from 'react-router-dom'
import Titulo from '@/components/Titulo/Titulo'
import styles from './PaginaVazia.module.css'

function PaginaVazia({ titulo }) {
    return (
        <main className={styles.pagina}>
            <Titulo>{titulo}</Titulo>
            <Link to='/eventos'>Voltar para eventos</Link>
        </main>
    )
}

export default PaginaVazia
