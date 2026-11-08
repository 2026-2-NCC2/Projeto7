import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import Campo from '@/components/Campo/Campo'
import Botao from '@/components/Botao/Botao'
import { api } from '@/utils/api'
import styles from './OrcamentoTicket.module.css'

const moeda = (valor) =>
    `R$ ${Number(valor || 0).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
const orcamentoDoEvento = (evento) => ({
    margem_lucro: evento.margem_lucro ?? '',
    publico_min: evento.publico_min ?? '',
    publico_max: evento.publico_max ?? '',
    publico_esperado: evento.publico_esperado ?? '',
})
function OrcamentoTicket() {
    const { eventoId } = useParams()
    const { evento, recarregarEvento } = useOutletContext()
    const [custos, setCustos] = useState(null)
    const [orcamento, setOrcamento] = useState(orcamentoDoEvento(evento))
    const [resultado, setResultado] = useState(null)
    const [erro, setErro] = useState('')
    const [salvando, setSalvando] = useState(false)
    const [salvo, setSalvo] = useState(false)
    const encerrado = evento.status === 'encerrado'

    useEffect(() => {
        setOrcamento(orcamentoDoEvento(evento))
        setResultado(null)
    }, [evento.id])

    useEffect(() => {
        api(`/organizadores/${eventoId}/custos_orcamento`)
            .then((response) => setCustos(response.custos_orcamento || []))
            .catch((error) => setErro(error.message))
    }, [eventoId])

    if (!custos && !erro) return <p className={styles.estado}>Carregando orçamento…</p>

    const custoTotal = (custos || []).reduce((total, custo) => total + Number(custo.valor), 0)

    function atualizar(campo) {
        return (event) => {
            setOrcamento({ ...orcamento, [campo]: event.target.value })
            setResultado(null)
            setSalvo(false)
        }
    }

    async function calcular(event) {
        event.preventDefault()
        setErro('')
        try {
            const query = new URLSearchParams(orcamento).toString()
            setResultado(await api(`/organizadores/${eventoId}/calcular_ticket?${query}`))
        } catch (error) {
            setErro(error.message)
        }
    }

    async function salvarOrcamento() {
        setSalvando(true)
        setErro('')
        try {
            await api(`/organizadores/${eventoId}/orcamento`, {
                method: 'PATCH',
                body: JSON.stringify(orcamento),
            })
            setSalvo(true)
            await recarregarEvento()
        } catch (error) {
            setErro(error.message)
        } finally {
            setSalvando(false)
        }
    }

    return (
        <div className={styles.pagina}>
            <section className={styles.painel}>
                <h2>ORÇAMENTO CONSOLIDADO</h2>
                <div className={styles.tabela}>
                    <table>
                        <thead>
                            <tr>
                                <th>ITEM / CUSTO</th>
                                <th>ORIGEM</th>
                                <th>VALOR</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(custos || []).map((custo, index) => (
                                <tr key={`${custo.item}-${index}`}>
                                    <td>{custo.item}</td>
                                    <td>{custo.origem}</td>
                                    <td>{moeda(custo.valor)}</td>
                                </tr>
                            ))}
                            <tr className={styles.total}>
                                <td colSpan='2'>Custo total</td>
                                <td>{moeda(custoTotal)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
            <form className={styles.painel} onSubmit={calcular}>
                <h2>CÁLCULO DO TICKET</h2>
                <div className={styles.campos}>
                    <Campo
                        id='margem'
                        rotulo='*Margem de lucro (%):'
                        type='number'
                        min='0'
                        max='99.99'
                        step='0.01'
                        value={orcamento.margem_lucro}
                        disabled={encerrado}
                        onChange={atualizar('margem_lucro')}
                        required
                    />
                    <Campo
                        id='publicoEsperado'
                        rotulo='*Público esperado:'
                        type='number'
                        min='1'
                        value={orcamento.publico_esperado}
                        disabled={encerrado}
                        onChange={atualizar('publico_esperado')}
                        required
                    />
                    <Campo
                        id='publicoMin'
                        rotulo='*Público mínimo:'
                        type='number'
                        min='1'
                        value={orcamento.publico_min}
                        disabled={encerrado}
                        onChange={atualizar('publico_min')}
                        required
                    />
                    <Campo
                        id='publicoMax'
                        rotulo='*Público máximo:'
                        type='number'
                        min='1'
                        value={orcamento.publico_max}
                        disabled={encerrado}
                        onChange={atualizar('publico_max')}
                        required
                    />
                </div>
                <p className={styles.formula}>
                    <b>Fórmula:</b> Ticket = custo total ÷ [público × (1 − margem)] ÷ 0,99. O
                    cálculo inclui a taxa de 1% que vai para a Troca Ticket em cada transação
                    monetária no site.
                </p>
                {erro && (
                    <p className={styles.erro} role='alert'>
                        {erro}
                    </p>
                )}
                {!encerrado && (
                    <div className={styles.calcular}>
                        <Botao type='button' disabled={salvando || salvo} onClick={salvarOrcamento}>
                            {salvando
                                ? 'Salvando…'
                                : salvo
                                  ? 'Orçamento salvo'
                                  : 'Salvar orçamento'}
                        </Botao>
                        <Botao type='submit'>Calcular</Botao>
                    </div>
                )}
                {resultado && (
                    <div className={styles.resultados}>
                        {[
                            ['PÚBLICO MÍNIMO', resultado.ticket_publico_min],
                            ['PÚBLICO ESPERADO', resultado.ticket_publico_esperado],
                            ['PÚBLICO MÁXIMO', resultado.ticket_publico_max],
                        ].map(([label, ticket]) => (
                            <article key={label}>
                                <b>{label}</b>
                                <span>{ticket.quantidade} pessoas</span>
                                <small>TICKET-ALVO</small>
                                <strong>{moeda(ticket.ticket_bruto)}</strong>
                                <small>Taxa Troca Ticket: {moeda(ticket.taxa)}</small>
                                <small>Organizador recebe: {moeda(ticket.ticket_liquido)}</small>
                            </article>
                        ))}
                    </div>
                )}
            </form>
        </div>
    )
}
export default OrcamentoTicket
