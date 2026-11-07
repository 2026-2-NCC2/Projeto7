import { Link } from 'react-router-dom'
import styles from './CartaoEventoAdm.module.css'

const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']
const STATUS = {
    em_cotacao: { rotulo: 'Em cotação', classe: styles.emCotacao },
    orcamento_fechado: { rotulo: 'Orçamento fechado', classe: styles.orcamentoFechado },
    reprovado: { rotulo: 'Reprovado', classe: styles.reprovado },
}

function CartaoEventoAdm({ evento }) {
    const [data, hora] = evento.data.split(' - ')
    const [dia, mes] = data.split('/')
    const status = STATUS[evento.statusAdm] || { rotulo: evento.statusAdm, classe: '' }

    return (
        <article className={styles.cartao}>
            <div className={styles.dataEvento} aria-label={`Data do evento: ${data}`}>
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
                        <b>DATA E HORA:</b> {data}, {hora.replace(':', 'h')}
                    </p>
                    <p>
                        <b>LOCAL:</b> {evento.local}
                    </p>
                    <p>
                        <b>ORGANIZADOR:</b> {evento.organizador}
                    </p>
                    <p>
                        <b>PROPOSTAS:</b> {evento.propostas ?? 0} recebidas
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
