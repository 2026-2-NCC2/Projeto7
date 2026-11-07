import { Link } from 'react-router-dom'
import { dataHoraBr } from '@/utils/api'
import styles from './CartaoEventoAdm.module.css'

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
const STATUS = {
    em_cotacao: { rotulo: 'Em cotação', classe: styles.emCotacao },
    publicado: { rotulo: 'Publicado', classe: styles.publicado },
    encerrado: { rotulo: 'Encerrado', classe: styles.encerrado },
}

function CartaoEventoAdm({ evento }) {
    const [, mes, dia] = String(evento.data).split('-')
    const status = STATUS[evento.status] || { rotulo: evento.status, classe: '' }

    return (
        <article className={styles.cartao}>
            <div className={styles.dataEvento} aria-label={`Data do evento: ${dia}/${mes}`}>
                <strong>{dia}</strong>
                <span>{MESES[Number(mes) - 1]}</span>
            </div>
            <div className={styles.conteudo}>
                <div className={styles.informacoes}>
                    <div className={styles.tituloLinha}>
                        <h2>{evento.nome}</h2>
                        <span className={`${styles.status} ${status.classe}`}>{status.rotulo}</span>
                    </div>
                    <p>
                        <b>DATA E HORA:</b> {dataHoraBr(`${evento.data} ${evento.horario_inicio}`)}
                    </p>
                    <p>
                        <b>LOCAL:</b> {evento.nome_local}
                    </p>
                    <p>
                        <b>ORGANIZADOR:</b> {evento.nome_organizador}
                    </p>
                    <p>
                        <b>PROPOSTAS:</b> {evento.quantidade_propostas ?? 0} recebidas
                    </p>
                </div>
                <div className={styles.descricao}>
                    <h3>Descrição</h3>
                    <p>{evento.descricao || 'Descrição não informada.'}</p>
                    <Link className={styles.verMais} to={`/eventos/${evento.id}`}>
                        Ver mais
                    </Link>
                </div>
            </div>
        </article>
    )
}

export default CartaoEventoAdm
