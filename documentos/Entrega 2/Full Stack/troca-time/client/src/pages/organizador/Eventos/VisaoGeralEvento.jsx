import { Link, useOutletContext } from 'react-router-dom'
import show from '@/assets/show.jpg.webp'
import styles from './VisaoGeralEvento.module.css'

const dinheiro = (valor) => `R$ ${Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
function VisaoGeralEvento() {
    const { evento } = useOutletContext()
    const custo = Number(evento.custo_total_calculado || 0)
    return <div className={styles.conteudo}>
        <section className={styles.hero}>
            <img src={show} alt={`Imagem de ${evento.nome}`} />
            <div><Link className={styles.editar} to={`/organizador/eventos/${evento.id}/editar`}>Editar evento</Link><p>Margem de lucro: {Number(evento.margem_lucro).toFixed(0)}%</p></div>
        </section>
        <section className={styles.descricao}><h2>DESCRIÇÃO:</h2><p>{evento.descricao || 'Sem descrição cadastrada.'}</p>
            <p><b>Data:</b> {String(evento.inicio).slice(0, 10).split('-').reverse().join('/')}</p><p><b>Hora:</b> {String(evento.inicio).slice(11, 16)} às {String(evento.fim).slice(11, 16)}</p>
            <p><b>Local:</b> {[evento.nome_local, evento.rua, evento.numero, evento.bairro, evento.cidade, evento.estado].filter(Boolean).join(' — ') || 'A definir'}</p>
            <p><b>Público mínimo:</b> {evento.publico_min} pessoas</p><p><b>Público máximo:</b> {evento.publico_max} pessoas</p>
        </section>
        <h2 className={styles.rotulo}>PLANEJAMENTO FINANCEIRO:</h2>
        <section className={styles.financeiro}>
            <article><small>CUSTO TOTAL</small><b>{dinheiro(custo)}</b></article>
            <article><small>MARGEM DE LUCRO</small><b>{Number(evento.margem_lucro).toFixed(0)}%</b></article>
            <article><small>TICKET (PÚBLICO MÍN.)</small><b>{evento.ticket_publico_min == null ? '—' : dinheiro(evento.ticket_publico_min)}</b></article>
            <article><small>TICKET (PÚBLICO MÁX.)</small><b>{evento.ticket_publico_max == null ? '—' : dinheiro(evento.ticket_publico_max)}</b></article>
        </section>
        <h2 className={styles.rotulo}>FORNECEDORES SELECIONADOS:</h2>
        <section className={styles.fornecedores}>
            {evento.fornecedoresSelecionados?.map((fornecedor) => <article key={fornecedor.proposta_id}><span className={styles.avatar}>{fornecedor.fornecedor.split(/\s+/).map((parte) => parte[0]).slice(0, 2).join('').toUpperCase()}</span><div><b>{fornecedor.fornecedor}</b><p>{fornecedor.servico} · {dinheiro(fornecedor.valor)}</p></div><Link to={`/organizador/fornecedores/${fornecedor.fornecedor_id}`}>Ver mais</Link></article>)}
            {!evento.fornecedoresSelecionados?.length && <p>Nenhuma proposta selecionada.</p>}
        </section>
    </div>
}
export default VisaoGeralEvento
