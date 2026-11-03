import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import BuscaCadastro from '@/components/BuscaCadastro/BuscaCadastro'
import { api, usuarioId } from '@/utils/api'
import styles from './ListaFornecedor.module.css'

const CATEGORIAS = [['todas', 'Todas'], ['iluminacao', 'Iluminação'], ['alimentacao', 'Alimentação'], ['bebidas', 'Bebidas'], ['seguranca', 'Segurança'], ['estrutura', 'Estrutura']]
const categoriaLabel = (id) => CATEGORIAS.find(([value]) => value === String(id).toLowerCase())?.[1] || id
function ListaFornecedor() {
    const organizadorId = usuarioId('organizador')
    const [fornecedores, setFornecedores] = useState([])
    const [busca, setBusca] = useState('')
    const [categoria, setCategoria] = useState('todas')
    const [erro, setErro] = useState('')
    useEffect(() => { api(`/organizadores/${organizadorId}/fornecedores`).then((data) => setFornecedores(data.fornecedores || [])).catch((error) => setErro(error.message)) }, [organizadorId])
    const lista = useMemo(() => fornecedores.filter((fornecedor) => {
        const texto = `${fornecedor.nome} ${fornecedor.cnpj || ''} ${fornecedor.descricao || ''} ${fornecedor.categoria}`.toLowerCase()
        return texto.includes(busca.toLowerCase()) && (categoria === 'todas' || fornecedor.categoria?.toLowerCase() === categoria)
    }), [fornecedores, busca, categoria])
    return <main className={styles.pagina}>
        <h1>FORNECEDORES</h1><p className={styles.subtitulo}>Fornecedores aprovados na plataforma.</p>
        <BuscaCadastro nome='fornecedores' valor={busca} onChange={setBusca} />
        <div className={styles.filtros} role='group' aria-label='Filtrar por categoria'>{CATEGORIAS.map(([id,label]) => <button key={id} type='button' aria-pressed={categoria===id} className={categoria===id?styles.ativo:''} onClick={()=>setCategoria(id)}>{label}</button>)}</div>
        {erro && <p className={styles.erro} role='alert'>{erro}</p>}
        <section className={styles.lista}>
            {lista.map((fornecedor) => <article className={styles.cartao} key={fornecedor.id}>
                <span className={styles.avatar}>{fornecedor.nome.split(/\s+/).map((p)=>p[0]).slice(0,2).join('').toUpperCase()}</span>
                <div className={styles.dados}><h2>{fornecedor.nome}</h2><p><b>CNPJ:</b> {fornecedor.cnpj || '—'}</p><p><b>CATEGORIA:</b> {categoriaLabel(fornecedor.categoria)}</p></div>
                <div className={styles.descricao}><b>Descrição</b><p>{fornecedor.descricao || 'Sem descrição cadastrada.'}</p><span>{fornecedor.quantidade_propostas} propostas na plataforma</span></div>
                <Link to={`/organizador/fornecedores/${fornecedor.id}`}>Ver mais</Link>
            </article>)}
            {!erro && !lista.length && <p className={styles.vazio}>Nenhum fornecedor encontrado.</p>}
        </section>
    </main>
}
export default ListaFornecedor
