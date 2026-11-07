import { Link, useOutletContext } from 'react-router-dom'
import show from '@/assets/show.jpg.webp'
import styles from './VisaoGeralEvento.module.css'

const dinheiro = (valor) =>
    `R$ ${Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
function VisaoGeralEvento() {
    const { evento } = useOutletContext()
    const custo = Number(evento.custo_total || 0)
    return (
        <div className={styles.conteudo}>
            <section className={styles.hero}>
                <img src={show} alt={`Imagem de ${evento.nome}`} />
            </section>
            <section className={styles.descricao}>
                <h2>DESCRIÇÃO:</h2>
                <p>{evento.descricao || 'Sem descrição cadastrada.'}</p>
                <p>
                    <b>Data:</b> {String(evento.data).split('-').reverse().join('/')}
                </p>
                <p>
                    <b>Hora:</b> {String(evento.horario_inicio).slice(0, 5)} às{' '}
                    {String(evento.horario_fim).slice(0, 5)}
                </p>
                <p>
                    <b>Local:</b> {evento.endereco || 'A definir'}
                </p>
                <p>
                    <b>Público mínimo:</b> {evento.publico_min} pessoas
                </p>
                <p>
                    <b>Público máximo:</b> {evento.publico_max} pessoas
                </p>
            </section>
            <h2 className={styles.rotulo}>PLANEJAMENTO FINANCEIRO:</h2>
            <section className={styles.financeiro}>
                <article>
                    <small>CUSTO TOTAL</small>
                    <b>{dinheiro(custo)}</b>
                </article>
                <article>
                    <small>MARGEM DE LUCRO</small>
                    <b>{Number(evento.margem_lucro).toFixed(0)}%</b>
                </article>
                <article>
                    <small>TICKET (PÚBLICO MÍN.)</small>
                    <b>{evento.ticket_min == null ? '—' : dinheiro(evento.ticket_min)}</b>
                </article>
                <article>
                    <small>TICKET (PÚBLICO MÁX.)</small>
                    <b>{evento.ticket_max == null ? '—' : dinheiro(evento.ticket_max)}</b>
                </article>
            </section>
            <h2 className={styles.rotulo}>FORNECEDORES SELECIONADOS:</h2>
            <section className={styles.fornecedores}>
                {evento.vagas_servico?.map((fornecedor, index) => (
                    <article key={`${fornecedor.fornecedor_id}-${index}`}>
                        <span className={styles.avatar}>
                            {fornecedor.fornecedor_nome
                                .split(/\s+/)
                                .map((parte) => parte[0])
                                .slice(0, 2)
                                .join('')
                                .toUpperCase()}
                        </span>
                        <div>
                            <b>{fornecedor.fornecedor_nome}</b>
                            <p>
                                Item: {fornecedor.vaga_categoria} ·{' '}
                                {dinheiro(fornecedor.proposta_valor)}
                            </p>
                        </div>
                        <Link to={`/organizador/fornecedores/${fornecedor.fornecedor_id}`}>
                            Ver mais
                        </Link>
                    </article>
                ))}
                {!evento.vagas_servico?.length && <p>Nenhuma proposta selecionada.</p>}
            </section>
        </div>
    )
}
export default VisaoGeralEvento
