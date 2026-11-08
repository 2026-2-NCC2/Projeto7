import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import Campo from '@/components/Campo/Campo'
import Botao from '@/components/Botao/Botao'
import { api, mascaraData, usuarioId } from '@/utils/api'
import styles from './ItensCustos.module.css'

const CATEGORIAS = [
    ['iluminacao', 'Iluminação'],
    ['alimentacao', 'Alimentação'],
    ['bebidas', 'Bebidas'],
    ['seguranca', 'Segurança'],
    ['estrutura', 'Estrutura'],
]
const CATEGORIAS_CUSTO = [
    ['fiscal', 'Fiscal'],
    ['operacional', 'Operacional'],
    ['variavel', 'Variável'],
]
const SITUACAO_VAGA = {
    pendente: 'Aguardando escolha',
    preenchida: 'Preenchida',
    vencida: 'Vencida',
}
const valorBR = (valor) =>
    `R$ ${Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

function ItensCustos() {
    const { eventoId } = useParams()
    const { organizadorId } = useOutletContext()
    const [vagas, setVagas] = useState([])
    const [custos, setCustos] = useState([])
    const [vaga, setVaga] = useState({
        item: '',
        categoria: 'iluminacao',
        descricao: '',
        cotacao_ate: '',
    })
    const [custo, setCusto] = useState({
        item: '',
        categoria: 'fiscal',
        descricao: '',
        valor: '',
    })
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)
    const id = organizadorId || usuarioId('organizador')

    async function carregar() {
        try {
            const [vagasData, custosData] = await Promise.all([
                api('/organizadores/vagas_servico/'),
                api(`/organizadores/${eventoId}/custos_manuais`),
            ])
            setVagas(
                (vagasData.vagas_servico || []).filter(
                    (vagaServico) => vagaServico.evento_id === Number(eventoId),
                ),
            )
            setCustos(custosData.custos_manuais || [])
            setErro('')
        } catch (error) {
            setErro(error.message)
        }
    }
    useEffect(() => {
        carregar()
    }, [id, eventoId])

    async function adicionarVaga(event) {
        event.preventDefault()
        setErro('')
        setEnviando(true)
        try {
            const [dia, mes, ano] = vaga.cotacao_ate.split('/')
            await api(`/organizadores/${eventoId}/vagas_servico`, {
                method: 'POST',
                body: JSON.stringify({ ...vaga, cotacao_ate: `${ano}-${mes}-${dia}` }),
            })
            setVaga({ item: '', categoria: 'iluminacao', descricao: '', cotacao_ate: '' })
            await carregar()
        } catch (error) {
            setErro(error.message)
        } finally {
            setEnviando(false)
        }
    }

    async function adicionarCusto(event) {
        event.preventDefault()
        setErro('')
        setEnviando(true)
        try {
            await api(`/organizadores/${eventoId}/custos_manuais`, {
                method: 'POST',
                body: JSON.stringify({ ...custo, valor: Number(custo.valor) }),
            })
            setCusto({ item: '', categoria: 'fiscal', descricao: '', valor: '' })
            await carregar()
        } catch (error) {
            setErro(error.message)
        } finally {
            setEnviando(false)
        }
    }

    async function excluirVaga(vagaId) {
        try {
            await api(`/organizadores/vagas_servico/${vagaId}`, { method: 'DELETE' })
            await carregar()
        } catch (error) {
            setErro(error.message)
        }
    }

    async function excluirCusto(custoId) {
        try {
            await api(`/organizadores/custos_manuais/${custoId}`, {
                method: 'DELETE',
            })
            await carregar()
        } catch (error) {
            setErro(error.message)
        }
    }

    return (
        <div className={styles.conteudo}>
            {erro && (
                <p className={styles.erro} role='alert'>
                    {erro}
                </p>
            )}
            <section className={styles.painel}>
                <h2>ITENS PARA COTAÇÃO COM FORNECEDORES</h2>
                <div className={styles.tabelaWrap}>
                    <table>
                        <thead>
                            <tr>
                                <th>ITEM</th>
                                <th>CATEGORIA</th>
                                <th>DESCRIÇÃO</th>
                                <th>PROPOSTAS</th>
                                <th>SITUAÇÃO</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {vagas.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <b>{item.item}</b>
                                    </td>
                                    <td>
                                        {CATEGORIAS.find(([id]) => id === item.categoria)?.[1] ||
                                            item.categoria}
                                    </td>
                                    <td>{item.descricao || '—'}</td>
                                    <td>{item.quantidade_propostas}</td>
                                    <td>
                                        <span
                                            className={
                                                item.status === 'preenchida'
                                                    ? styles.selecionada
                                                    : styles.aguardando
                                            }
                                        >
                                            {SITUACAO_VAGA[item.status] || item.status}
                                        </span>
                                    </td>
                                    <td>
                                        {Number(item.quantidade_propostas) === 0 && (
                                            <button
                                                className={styles.excluir}
                                                type='button'
                                                onClick={() => excluirVaga(item.id)}
                                            >
                                                Deletar
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {!vagas.length && (
                                <tr>
                                    <td colSpan='6' className={styles.vazio}>
                                        Nenhum serviço cadastrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <form className={styles.formVaga} onSubmit={adicionarVaga}>
                    <Campo
                        id='itemServico'
                        rotulo='*Item:'
                        placeholder='ex.: Iluminação de palco'
                        value={vaga.item}
                        onChange={(e) => setVaga({ ...vaga, item: e.target.value })}
                        required
                    />
                    <label>
                        <span>*Categoria:</span>
                        <select
                            value={vaga.categoria}
                            onChange={(e) => setVaga({ ...vaga, categoria: e.target.value })}
                        >
                            {CATEGORIAS.map(([value, label]) => (
                                <option value={value} key={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Campo
                        id='descricaoServico'
                        rotulo='*Descrição:'
                        placeholder='Quantidade, horário, especificações'
                        value={vaga.descricao}
                        onChange={(e) => setVaga({ ...vaga, descricao: e.target.value })}
                        required
                    />
                    <Campo
                        id='prazoCotacao'
                        rotulo='*Cotação até:'
                        placeholder='dd/mm/aaaa'
                        inputMode='numeric'
                        maxLength='10'
                        value={vaga.cotacao_ate}
                        onChange={(e) =>
                            setVaga({ ...vaga, cotacao_ate: mascaraData(e.target.value) })
                        }
                        required
                    />
                    <Botao type='submit' disabled={enviando}>
                        {enviando ? 'Adicionando…' : 'Adicionar →'}
                    </Botao>
                </form>
            </section>
            <section className={styles.painel}>
                <h2>OUTROS CUSTOS DO EVENTO</h2>
                <div className={styles.tabelaWrap}>
                    <table>
                        <thead>
                            <tr>
                                <th>ITEM</th>
                                <th>CATEGORIA</th>
                                <th>DESCRIÇÃO</th>
                                <th>VALOR</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {custos.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <b>{item.item}</b>
                                    </td>
                                    <td>
                                        {CATEGORIAS_CUSTO.find(
                                            ([id]) => id === item.categoria,
                                        )?.[1] || item.categoria}
                                    </td>
                                    <td>{item.descricao}</td>
                                    <td>{valorBR(item.valor)}</td>
                                    <td>
                                        <button
                                            className={styles.excluir}
                                            type='button'
                                            onClick={() => excluirCusto(item.id)}
                                        >
                                            Deletar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {!custos.length && (
                                <tr>
                                    <td colSpan='5' className={styles.vazio}>
                                        Nenhum outro custo cadastrado.
                                    </td>
                                </tr>
                            )}
                            {custos.length > 0 && (
                                <tr className={styles.subtotal}>
                                    <td colSpan='3'>Subtotal</td>
                                    <td colSpan='2'>
                                        {valorBR(
                                            custos.reduce(
                                                (total, item) => total + Number(item.valor),
                                                0,
                                            ),
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <form className={styles.formCusto} onSubmit={adicionarCusto}>
                    <Campo
                        id='itemCusto'
                        rotulo='*Item:'
                        placeholder='ex.: Seguro'
                        value={custo.item}
                        onChange={(e) => setCusto({ ...custo, item: e.target.value })}
                        required
                    />
                    <label>
                        <span>*Categoria:</span>
                        <select
                            value={custo.categoria}
                            onChange={(e) => setCusto({ ...custo, categoria: e.target.value })}
                        >
                            {CATEGORIAS_CUSTO.map(([value, label]) => (
                                <option value={value} key={value}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </label>
                    <Campo
                        id='descricaoCusto'
                        rotulo='*Descrição:'
                        placeholder='ex.: Seguro do evento'
                        value={custo.descricao}
                        onChange={(e) => setCusto({ ...custo, descricao: e.target.value })}
                        required
                    />
                    <Campo
                        id='valorCusto'
                        rotulo='*Valor (R$):'
                        type='number'
                        min='0.01'
                        step='0.01'
                        placeholder='0,00'
                        value={custo.valor}
                        onChange={(e) => setCusto({ ...custo, valor: e.target.value })}
                        required
                    />
                    <Botao type='submit' disabled={enviando}>
                        Adicionar →
                    </Botao>
                </form>
            </section>
        </div>
    )
}
export default ItensCustos
