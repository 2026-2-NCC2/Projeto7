import { Link } from 'react-router-dom'
import show from '@/assets/show.jpg.webp'
import styles from './CartaoEvento.module.css'

function CartaoEvento({ evento }) {
    return (
        <article className={styles.cartao}>
            <div
                className={styles.imagem}
                aria-label={`Imagem do evento ${evento.nome}`}
                role='img'
            >
                <span>
                    <img src={show} alt='Foto de show' />
                </span>
            </div>
            <div className={styles.conteudo}>
                <h2>{evento.nome}</h2>
                <div className={styles.detalhes}>
                    <p>
                        <b>DATA E HORA:</b> {evento.data}
                    </p>
                    <p>
                        <b>LOCAL:</b> {evento.local}
                    </p>
                    <p>
                        <b>ORGANIZADOR:</b> {evento.organizador}
                    </p>
                    <p>
                        <b>FORNECEDORES:</b> {evento.fornecedor}
                    </p>
                </div>
                <Link className={styles.verMais} to={`/eventos/${evento.id}`}>
                    Ver mais
                </Link>
            </div>
        </article>
    )
}

export default CartaoEvento
