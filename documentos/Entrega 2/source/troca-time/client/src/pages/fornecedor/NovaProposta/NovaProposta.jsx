import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import Botao from '@/components/Botao/Botao'
import Campo from '@/components/Campo/Campo'
import { api, dataBr } from '@/utils/api'
import styles from './NovaProposta.module.css'

function NovaProposta() {
    const { propostaId } = useParams()
    const [searchParams] = useSearchParams()
    const vagaId = searchParams.get('vaga')
    const navigate = useNavigate()
    const [vaga, setVaga] = useState(null)
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [form, setForm] = useState({ valor: '', validade: '', descricao: '', observacoes: '' })
    function atualizar(campo) {
        return (e) => setForm((atual) => ({ ...atual, [campo]: e.target.value }))
    }

    async function carregar() {
        try {
            const resposta = await api('/fornecedores/oportunidades')
            setVaga(
                (resposta.oportunidades || []).find((item) => item.id === Number(vagaId)) || null,
            )
            setErro('')
        } catch (error) {
            setErro(error.message)
        }
    }
    useEffect(() => {
        carregar()
    }, [vagaId])

    async function enviar(e) {
        e.preventDefault()
        setErro('')
        setEnviando(true)
        try {
            await api('/fornecedores/', {
                method: 'POST',
                body: JSON.stringify({
                    ...form,
                    vaga_servico_id: Number(vagaId),
                    valor: Number(form.valor),
                }),
            })
            navigate('/fornecedor/propostas')
        } catch (error) {
            setErro(error.message)
        } finally {
            setEnviando(false)
        }
    }

    return (
        <main className={styles.pagina}>
            <h1>{propostaId ? 'Editar proposta' : 'Nova proposta'}</h1>
            <section className={styles.resumo}>
                <span className={styles.dia}>{String(vaga?.data || '').split('-')[2] || '—'}</span>
                <div>
                    <small>PARA O EVENTO</small>
                    <b>{vaga?.nome_evento ?? '—'}</b>
                    <span>
                        {vaga ? `${dataBr(vaga.data)} · ${vaga.nome_local}` : 'Data · Local'}
                    </span>
                </div>
            </section>
            <form className={styles.formulario} onSubmit={enviar}>
                <div className={styles.camposTopo}>
                    <Campo id='item' rotulo='*Item:' value={vaga?.item ?? '—'} readOnly />
                    <Campo
                        id='valor'
                        rotulo='*Valor (R$):'
                        type='number'
                        min='0.01'
                        step='0.01'
                        placeholder='0,00'
                        value={form.valor}
                        onChange={atualizar('valor')}
                        required
                    />
                    <Campo
                        id='validade'
                        rotulo='*Validade da proposta:'
                        type='date'
                        min={new Date().toISOString().slice(0, 10)}
                        value={form.validade}
                        onChange={atualizar('validade')}
                        required
                    />
                </div>
                <label className={styles.rotulo} htmlFor='descricao'>
                    *Descrição:
                </label>
                <textarea
                    id='descricao'
                    placeholder='O que está incluso no serviço'
                    value={form.descricao}
                    onChange={atualizar('descricao')}
                    required
                />
                <label className={styles.rotulo} htmlFor='observacoes'>
                    Observações:
                </label>
                <textarea
                    id='observacoes'
                    placeholder='Condições, prazos de montagem, itens à parte'
                    value={form.observacoes}
                    onChange={atualizar('observacoes')}
                />
                {erro && (
                    <p className={styles.erro} role='alert'>
                        {erro}
                    </p>
                )}
                <Botao type='submit' disabled={enviando}>
                    Enviar proposta →
                </Botao>
            </form>
        </main>
    )
}
export default NovaProposta
