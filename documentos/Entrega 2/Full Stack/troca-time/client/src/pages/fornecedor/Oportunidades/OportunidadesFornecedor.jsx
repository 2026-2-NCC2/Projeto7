import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './OportunidadesFornecedor.module.css'

const CATEGORIAS = ['Todas', 'Iluminação', 'Alimentação', 'Bebidas', 'Segurança', 'Estrutura']

function OportunidadesFornecedor() {
    const oportunidades = []
    const [busca, setBusca] = useState('')
    const [categoria, setCategoria] = useState('Todas')

    const filtradas = useMemo(() => oportunidades.filter((item) => {
        const correspondeCategoria = categoria === 'Todas' || item.categoria?.toLowerCase() === categoria.toLowerCase()
        const texto = `${item.nomeServico} ${item.evento} ${item.local}`.toLowerCase()
        return correspondeCategoria && texto.includes(busca.toLowerCase())
    }), [oportunidades, busca, categoria])

    return <main className={styles.pagina}>
        <section className={styles.intro}>
            <h1>Oportunidades</h1>
            <p>Eventos abertos para cotação nas categorias de serviço.</p>
        </section>
        <label className={styles.busca}><span className={styles.srOnly}>Buscar oportunidades</span><input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder='Buscar' /></label>
        <div className={styles.filtros} role='group' aria-label='Filtrar por categoria de serviço'>
            {CATEGORIAS.map((item) => <button key={item} type='button' aria-pressed={categoria === item} className={`${styles.filtro} ${categoria === item ? styles.filtroAtivo : ''}`} onClick={() => setCategoria(item)}>{item}</button>)}
        </div>
        <section className={styles.lista} aria-label='Oportunidades de serviço'>
            {filtradas.map((item) => <article key={item.id} className={styles.cartao}>
                <div className={styles.data}><strong>{item.data.split('/')[0] || '—'}</strong><span>{item.data.split('/')[1]?.slice(0, 3) ?? ''}</span></div>
                <div className={styles.info}><h2>{item.nomeServico}</h2><p className={styles.evento}>{item.evento}</p><p><b>DATA E HORA:</b> {item.data}</p><p><b>LOCAL:</b> {item.local}</p><p><b>COTAÇÃO ATÉ:</b> {item.cotacaoAte}</p></div>
                <div className={styles.descricao}><b>Descrição</b><p>{item.descricao}</p><div className={styles.acoes}><Link className={styles.secundario} to={`/fornecedores/eventos/${item.eventoId}`}>Ver mais</Link><Link className={styles.primario} to={`/fornecedores/eventos/${item.eventoId}/propostas/nova`}>Fazer proposta</Link></div></div>
            </article>)}
            {filtradas.length === 0 && <p className={styles.vazio}>Nenhuma oportunidade disponível.</p>}
        </section>
    </main>
}

export default OportunidadesFornecedor
