import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import Campo from '@/components/Campo/Campo'
import Botao from '@/components/Botao/Botao'
import { api, mascaraData, usuarioId } from '@/utils/api'
import styles from './ItensCustos.module.css'

const CATEGORIAS = [
    ['iluminacao', 'Iluminação'], ['alimentacao', 'Alimentação'], ['bebidas', 'Bebidas'],
    ['seguranca', 'Segurança'], ['estrutura', 'Estrutura'],
]
const TIPOS = [['fiscal', 'Fiscal'], ['operacional', 'Operacional'], ['variavel', 'Variável']]
const valorBR = (valor) => `R$ ${Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`

function ItensCustos() {
    const { eventoId } = useParams()
    const { organizadorId } = useOutletContext()
    const [vagas, setVagas] = useState([])
    const [custos, setCustos] = useState([])
    const [vaga, setVaga] = useState({ nome: '', categoria: 'iluminacao', descricao: '', prazo_cotacao: '' })
    const [custo, setCusto] = useState({ descricao: '', tipo: 'fiscal', valor: '' })
    const [erro, setErro] = useState('')
    const [enviando, setEnviando] = useState(false)
    const id = organizadorId || usuarioId('organizador')

    async function carregar() {
        try {
            const [vagasData, custosData] = await Promise.all([
                api(`/organizadores/${id}/eventos/${eventoId}/vagas`),
                api(`/organizadores/${id}/eventos/${eventoId}/custos`),
            ])
            setVagas(vagasData.vagas || [])
            setCustos(custosData.custos || [])
            setErro('')
        } catch (error) { setErro(error.message) }
    }
    useEffect(() => { carregar() }, [id, eventoId])

    async function adicionarVaga(event) {
        event.preventDefault(); setErro(''); setEnviando(true)
        try {
            const [dia, mes, ano] = vaga.prazo_cotacao.split('/')
            await api(`/organizadores/${id}/eventos/${eventoId}/vagas`, { method: 'POST', body: JSON.stringify({ ...vaga, prazo_cotacao: `${ano}-${mes}-${dia}` }) })
            setVaga({ nome: '', categoria: 'iluminacao', descricao: '', prazo_cotacao: '' })
            await carregar()
        } catch (error) { setErro(error.message) }
        finally { setEnviando(false) }
    }

    async function adicionarCusto(event) {
        event.preventDefault(); setErro(''); setEnviando(true)
        try {
            await api(`/organizadores/${id}/eventos/${eventoId}/custos`, { method: 'POST', body: JSON.stringify({ ...custo, valor: Number(custo.valor) }) })
            setCusto({ descricao: '', tipo: 'fiscal', valor: '' })
            await carregar()
        } catch (error) { setErro(error.message) }
        finally { setEnviando(false) }
    }

    async function excluirCusto(custoId) {
        try {
            await api(`/organizadores/${id}/eventos/${eventoId}/custos/${custoId}`, { method: 'DELETE' })
            await carregar()
        } catch (error) { setErro(error.message) }
    }

    return <div className={styles.conteudo}>
        {erro && <p className={styles.erro} role='alert'>{erro}</p>}
        <section className={styles.painel}>
            <h2>ITENS PARA COTAÇÃO COM FORNECEDORES</h2>
            <div className={styles.tabelaWrap}><table><thead><tr><th>SERVIÇO</th><th>CATEGORIA</th><th>DESCRIÇÃO</th><th>PROPOSTAS</th><th>SITUAÇÃO</th></tr></thead><tbody>
                {vagas.map((item) => <tr key={item.id}><td><b>{item.nome}</b></td><td>{CATEGORIAS.find(([id]) => id === item.categoria)?.[1] || item.categoria}</td><td>{item.descricao || '—'}</td><td>{item.quantidade_propostas}</td><td><span className={item.situacao === 'aceita' ? styles.selecionada : styles.aguardando}>{item.situacao === 'aceita' ? 'Selecionada' : 'Aguardando escolha'}</span></td></tr>)}
                {!vagas.length && <tr><td colSpan='5' className={styles.vazio}>Nenhum serviço cadastrado.</td></tr>}
            </tbody></table></div>
            <form className={styles.formVaga} onSubmit={adicionarVaga}>
                <Campo id='nomeServico' rotulo='*Novo serviço:' placeholder='ex.: Iluminação de palco' value={vaga.nome} onChange={(e) => setVaga({ ...vaga, nome: e.target.value })} required />
                <label><span>*Categoria:</span><select value={vaga.categoria} onChange={(e) => setVaga({ ...vaga, categoria: e.target.value })}>{CATEGORIAS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
                <Campo id='descricaoServico' rotulo='*Descrição:' placeholder='Quantidade, horário, especificações' value={vaga.descricao} onChange={(e) => setVaga({ ...vaga, descricao: e.target.value })} required />
                <Campo id='prazoCotacao' rotulo='*Cotação até:' placeholder='dd/mm/aaaa' inputMode='numeric' maxLength='10' value={vaga.prazo_cotacao} onChange={(e) => setVaga({ ...vaga, prazo_cotacao: mascaraData(e.target.value) })} required />
                <Botao type='submit' disabled={enviando}>{enviando ? 'Adicionando…' : 'Adicionar →'}</Botao>
            </form>
        </section>
        <section className={styles.painel}>
            <h2>OUTROS CUSTOS DO EVENTO</h2>
            <div className={styles.tabelaWrap}><table><thead><tr><th>DESCRIÇÃO</th><th>TIPO</th><th>VALOR</th><th></th></tr></thead><tbody>
                {custos.map((item) => <tr key={item.id}><td>{item.descricao}</td><td>{TIPOS.find(([id]) => id === item.tipo)?.[1] || item.tipo}</td><td>{valorBR(item.valor)}</td><td><button className={styles.excluir} type='button' onClick={() => excluirCusto(item.id)}>Deletar</button></td></tr>)}
                {!custos.length && <tr><td colSpan='4' className={styles.vazio}>Nenhum outro custo cadastrado.</td></tr>}
                {custos.length > 0 && <tr className={styles.subtotal}><td colSpan='2'>Subtotal</td><td colSpan='2'>{valorBR(custos.reduce((total, item) => total + Number(item.valor), 0))}</td></tr>}
            </tbody></table></div>
            <form className={styles.formCusto} onSubmit={adicionarCusto}>
                <Campo id='descricaoCusto' rotulo='*Descrição:' placeholder='ex.: Seguro do evento' value={custo.descricao} onChange={(e) => setCusto({ ...custo, descricao: e.target.value })} required />
                <label><span>*Tipo:</span><select value={custo.tipo} onChange={(e) => setCusto({ ...custo, tipo: e.target.value })}>{TIPOS.map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
                <Campo id='valorCusto' rotulo='*Valor (R$):' type='number' min='0.01' step='0.01' placeholder='0,00' value={custo.valor} onChange={(e) => setCusto({ ...custo, valor: e.target.value })} required />
                <Botao type='submit' disabled={enviando}>Adicionar →</Botao>
            </form>
        </section>
    </div>
}
export default ItensCustos
