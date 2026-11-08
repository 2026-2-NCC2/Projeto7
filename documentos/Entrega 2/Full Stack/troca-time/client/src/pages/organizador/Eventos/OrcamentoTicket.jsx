import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import Campo from '@/components/Campo/Campo'
import Botao from '@/components/Botao/Botao'
import { api } from '@/utils/api'
import styles from './OrcamentoTicket.module.css'

const moeda = (valor) =>
    `R$ ${Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
const arredondarParaCima = (valor) => Math.ceil(valor * 100) / 100
function OrcamentoTicket() {
    const { eventoId } = useParams()
    const { organizadorId, evento } = useOutletContext()
    const [custos, setCustos] = useState(null)
    const [margem, setMargem] = useState(String(evento.margem_lucro ?? 0))
    const [publicoEsperado, setPublicoEsperado] = useState('')
    const [resultado, setResultado] = useState(null)
    const [erro, setErro] = useState('')
    const [salvando, setSalvando] = useState(false)

    useEffect(() => {
        setMargem(String(evento.margem_lucro ?? 0))
        setResultado(null)
    }, [evento.id, evento.margem_lucro])

    useEffect(() => {
        api(`/organizadores/${eventoId}/custos_orcamento`)
            .then((response) => setCustos(response.custos_orcamento || []))
            .catch((error) => setErro(error.message))
    }, [eventoId])

    if (erro)
        return (
            <p className={styles.erro} role='alert'>
                {erro}
            </p>
        )
    if (!custos) return <p className={styles.estado}>Carregando orçamento…</p>

    const custoTotal = custos.reduce((total, custo) => total + Number(custo.valor), 0)
    const publicos = {
        minimo: Number(evento.publico_min),
        maximo: Number(evento.publico_max),
        esperado: Number(
            publicoEsperado ||
                Math.round((Number(evento.publico_min) + Number(evento.publico_max)) / 2),
        ),
    }
    function calcular(event) {
        event.preventDefault()
        const proporcao = Math.max(0.0001, 1 - Number(margem) / 100)
        const ticket = (publico) => arredondarParaCima(custoTotal / (publico * proporcao * 0.99))
        setResultado({
            minimo: ticket(publicos.minimo),
            maximo: ticket(publicos.maximo),
            esperado: ticket(publicos.esperado),
        })
    }
    async function publicar() {
        if (!resultado) return
        setSalvando(true)
        setErro('')
        try {
            await api(`/organizadores/${organizadorId}/eventos/${eventoId}/orcamento`, {
                method: 'PUT',
                body: JSON.stringify({
                    custo_total: custoTotal,
                    margem_lucro: Number(margem),
                    ticket_publico_min: resultado.minimo,
                    ticket_publico_max: resultado.maximo,
                    publico_esperado: publicos.esperado,
                    status: 'publicado',
                }),
            })
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
                            {custos.map((custo, index) => (
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
                        value={margem}
                        onChange={(e) => setMargem(e.target.value)}
                        required
                    />
                    <Campo
                        id='publicoEsperado'
                        rotulo='Público esperado:'
                        type='number'
                        min={evento.publico_min}
                        max={evento.publico_max}
                        value={publicoEsperado}
                        onChange={(e) => setPublicoEsperado(e.target.value)}
                    />
                </div>
                <p className={styles.formula}>
                    <b>Fórmula:</b> Ticket = custo total ÷ [público × (1 − margem)] ÷ 0,99. O
                    cálculo inclui a taxa de 1% que vai para a Troca Ticket em cada transação
                    monetária no site.
                </p>
                <div className={styles.calcular}>
                    <Botao type='submit'>Calcular</Botao>
                </div>
                {resultado && (
                    <div className={styles.resultados}>
                        {[
                            ['PÚBLICO MÍNIMO', evento.publico_min, resultado.minimo],
                            ['PÚBLICO ESPERADO', publicos.esperado, resultado.esperado],
                            ['PÚBLICO MÁXIMO', evento.publico_max, resultado.maximo],
                        ].map(([label, publico, ticket]) => (
                            <article key={label}>
                                <b>{label}</b>
                                <span>{publico} pessoas</span>
                                <small>TICKET-ALVO</small>
                                <strong>{moeda(ticket)}</strong>
                                <small>
                                    Equilíbrio (margem 0%):{' '}
                                    {moeda(
                                        arredondarParaCima(custoTotal / (Number(publico) * 0.99)),
                                    )}
                                </small>
                            </article>
                        ))}
                    </div>
                )}
            </form>
            {resultado && (
                <div className={styles.salvar}>
                    <Botao type='button' disabled={salvando} onClick={publicar}>
                        {salvando ? 'Publicando…' : 'Publicar'}
                    </Botao>
                </div>
            )}
        </div>
    )
}
export default OrcamentoTicket
