import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '@/utils/api'
import styles from './DetalheFornecedor.module.css'

const STATUS = { enviada:'Disponível', em_negociacao:'Selecionada', aceita:'Salva', recusada:'Recusada', cancelada:'Indisponível' }
const dinheiro = (valor) => `R$ ${Number(valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
function DetalheFornecedor() {
    const { fornecedorId } = useParams()
    const [fornecedor, setFornecedor] = useState(null)
    const [erro, setErro] = useState('')
    useEffect(() => { api(`/fornecedores/${fornecedorId}`).then(setFornecedor).catch((error) => setErro(error.message)) }, [fornecedorId])
    if (erro) return <main className={styles.pagina}><p role='alert'>{erro}</p></main>
    if (!fornecedor) return <main className={styles.pagina}>Carregando fornecedor…</main>
    return <main className={styles.pagina}>
        <section className={styles.cabecalho}><span className={styles.avatar}>{fornecedor.nome.split(/\s+/).map((p)=>p[0]).slice(0,2).join('').toUpperCase()}</span><div><h1>{fornecedor.nome}</h1><p>Fornecedor · {fornecedor.categoria}</p></div></section>
        <div className={styles.duasColunas}><section><h2>DADOS</h2><p><b>CNPJ:</b> {fornecedor.cnpj || '—'}</p><p><b>Categoria:</b> {fornecedor.categoria}</p></section><section><h2>DESCRIÇÃO</h2><p>{fornecedor.descricao || 'Sem descrição cadastrada.'}</p></section></div>
        <h2 className={styles.rotulo}>PROPOSTAS COM VOCÊ:</h2><section className={styles.propostas}>{fornecedor.propostas.map((p)=><article key={p.id}><div><b>{p.nome_evento}</b><span> · {p.nome_vaga}</span></div><strong>{dinheiro(p.valor)}</strong><span className={styles.status}>{STATUS[p.status] || p.status}</span></article>)}{!fornecedor.propostas.length&&<p>Nenhuma proposta deste fornecedor.</p>}</section>
    </main>
}
export default DetalheFornecedor
