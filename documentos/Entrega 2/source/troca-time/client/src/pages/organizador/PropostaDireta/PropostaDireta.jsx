import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Botao from '@/components/Botao/Botao'
import Campo from '@/components/Campo/Campo'
import { api, dataBr } from '@/utils/api'
import styles from '@/pages/fornecedor/NovaProposta/NovaProposta.module.css'

const iniciais = (nome = '') =>
    nome
        .split(/\s+/)
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

function PropostaDireta() {
    const { fornecedorId } = useParams()
    const navigate = useNavigate()
    const [fornecedor, setFornecedor] = useState(null)
    const [vagas, setVagas] = useState([])
    const [carregando, setCarregando] = useState(true)
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)
    const [form, setForm] = useState({
        evento_id: '',
        vaga_servico_id: '',
        valor: '',
        validade: '',
        descricao: '',
        observacoes: '',
    })

    function atualizar(campo) {
        return (e) => setForm((atual) => ({ ...atual, [campo]: e.target.value }))
    }

    useEffect(() => {
        let ativo = true
        Promise.all([
            api(`/fornecedores/${fornecedorId}`),
            api(`/organizadores/propostas/vagas_disponiveis?fornecedor_id=${fornecedorId}`),
        ])
            .then(([dadosFornecedor, resposta]) => {
                if (!ativo) return
                setFornecedor(dadosFornecedor)
                setVagas(resposta.vagas || [])
            })
            .catch((error) => ativo && setErro(error.message))
            .finally(() => ativo && setCarregando(false))
        return () => {
            ativo = false
        }
    }, [fornecedorId])

    const eventos = useMemo(
        () => [
            ...new Map(
                vagas.map((v) => [v.evento_id, { id: v.evento_id, nome: v.nome_evento, data: v.data }]),
            ).values(),
        ],
        [vagas],
    )
    const vagasDoEvento = vagas.filter((v) => String(v.evento_id) === form.evento_id)

    async function enviar(e) {
        e.preventDefault()
        setErro('')
        setEnviando(true)
        try {
            const resposta = await api('/organizadores/propostas', {
                method: 'POST',
                body: JSON.stringify({
                    fornecedor_id: Number(fornecedorId),
                    vaga_servico_id: Number(form.vaga_servico_id),
                    valor: Number(form.valor),
                    validade: form.validade,
                    descricao: form.descricao,
                    observacoes: form.observacoes,
                }),
            })
            navigate(`/organizador/mensagens?proposta=${resposta.proposta_id}`)
        } catch (error) {
            setErro(error.message)
        } finally {
            setEnviando(false)
        }
    }

    const aprovado = fornecedor?.status_cadastro === 'aprovado'

    return (
        <main className={styles.pagina}>
            <Link to={`/organizador/fornecedores/${fornecedorId}`}>
                ← {fornecedor?.nome || 'Fornecedor'}
            </Link>
            <h1>Proposta direta</h1>
            <section className={styles.resumo}>
                <span className={styles.dia} style={{ borderRadius: '50%', background: '#7d7d89' }}>
                    {iniciais(fornecedor?.nome)}
                </span>
                <div>
                    <small>PARA O FORNECEDOR</small>
                    <b>{fornecedor?.nome ?? '—'}</b>
                    <span>{fornecedor?.descricao || 'Fornecedor'}</span>
                </div>
            </section>

            {carregando && <p className={styles.nota}>Carregando…</p>}

            {!carregando && fornecedor && !aprovado && (
                <p className={styles.erro} role='alert'>
                    Só é possível enviar proposta direta para fornecedores aprovados.
                </p>
            )}

            {!carregando && aprovado && !vagas.length && (
                <p className={styles.nota} style={{ marginTop: 22 }}>
                    Nenhuma vaga disponível. A proposta direta só pode ser feita para vagas em
                    aberto de eventos em cotação, e para as quais este fornecedor ainda não tem
                    proposta.
                </p>
            )}

            {!carregando && aprovado && vagas.length > 0 && (
                <form className={styles.formulario} onSubmit={enviar}>
                    <div className={styles.camposTopo}>
                        <Campo id='evento' rotulo='*Evento:'>
                            <select
                                id='evento'
                                value={form.evento_id}
                                onChange={(e) =>
                                    setForm((atual) => ({
                                        ...atual,
                                        evento_id: e.target.value,
                                        vaga_servico_id: '',
                                    }))
                                }
                                required
                            >
                                <option value=''>Selecione</option>
                                {eventos.map((ev) => (
                                    <option key={ev.id} value={ev.id}>
                                        {ev.nome} · {dataBr(ev.data)}
                                    </option>
                                ))}
                            </select>
                        </Campo>
                        <Campo id='vaga' rotulo='*Vaga de serviço:'>
                            <select
                                id='vaga'
                                value={form.vaga_servico_id}
                                onChange={atualizar('vaga_servico_id')}
                                disabled={!form.evento_id}
                                required
                            >
                                <option value=''>Selecione</option>
                                {vagasDoEvento.map((v) => (
                                    <option key={v.id} value={v.id}>
                                        {v.item}
                                    </option>
                                ))}
                            </select>
                        </Campo>
                        <Campo
                            id='valor'
                            rotulo='*Valor oferecido (R$):'
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
                    <p className={styles.nota}>Só aparecem vagas em aberto (sem proposta aceita).</p>
                    <label className={styles.rotulo} htmlFor='descricao'>
                        *Descrição:
                    </label>
                    <textarea
                        id='descricao'
                        placeholder='O que você espera do serviço'
                        value={form.descricao}
                        onChange={atualizar('descricao')}
                        required
                    />
                    <label className={styles.rotulo} htmlFor='observacoes'>
                        Observações:
                    </label>
                    <textarea
                        id='observacoes'
                        placeholder='Horários, montagem, condições de pagamento'
                        value={form.observacoes}
                        onChange={atualizar('observacoes')}
                    />
                    {erro && (
                        <p className={styles.erro} role='alert'>
                            {erro}
                        </p>
                    )}
                    <Botao type='submit' disabled={enviando}>
                        Enviar proposta direta →
                    </Botao>
                    <p className={styles.nota}>
                        O fornecedor responde em Mensagens. Você pode cancelar enquanto ela estiver
                        pendente.
                    </p>
                </form>
            )}

            {erro && !aprovado && !carregando && !fornecedor && (
                <p className={styles.erro} role='alert'>
                    {erro}
                </p>
            )}
        </main>
    )
}

export default PropostaDireta
