import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, dataBr, dataHoraBr } from '@/utils/api'
import styles from './OportunidadesFornecedor.module.css'

const CATEGORIAS = [
    ['todas', 'Todas'],
    ['iluminacao', 'Iluminação'],
    ['alimentacao', 'Alimentação'],
    ['bebidas', 'Bebidas'],
    ['seguranca', 'Segurança'],
    ['estrutura', 'Estrutura'],
]
const MESES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ']

function OportunidadesFornecedor() {
    const [dados, setDados] = useState({ oportunidades: [] })
    const [busca, setBusca] = useState('')
    const [categoria, setCategoria] = useState('todas')
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(true)

    async function carregar() {
        setCarregando(true)
        setErro('')
        try {
            const resposta = await api('/fornecedores/')
            setDados({ oportunidades: resposta.oportunidades || [] })
        } catch (error) {
            setErro(error.message)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        carregar()
    }, [])

    const filtradas = useMemo(
        () =>
            dados.oportunidades.filter((item) => {
                const correspondeCategoria = categoria === 'todas' || item.categoria === categoria
                const texto = `${item.item} ${item.nome_evento} ${item.nome_local}`.toLowerCase()
                return correspondeCategoria && texto.includes(busca.toLowerCase())
            }),
        [dados.oportunidades, busca, categoria],
    )

    return (
        <main className={styles.pagina}>
            <section className={styles.intro}>
                <h1>Oportunidades</h1>
                <p>Eventos abertos para cotação nas categorias de serviço.</p>
            </section>
            <label className={styles.busca}>
                <span className={styles.srOnly}>Buscar oportunidades</span>
                <input
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    placeholder='Buscar'
                />
            </label>
            <div
                className={styles.filtros}
                role='group'
                aria-label='Filtrar por categoria de serviço'
            >
                {CATEGORIAS.map(([valor, rotulo]) => (
                    <button
                        key={valor}
                        type='button'
                        aria-pressed={categoria === valor}
                        className={`${styles.filtro} ${categoria === valor ? styles.filtroAtivo : ''}`}
                        onClick={() => setCategoria(valor)}
                    >
                        {rotulo}
                    </button>
                ))}
            </div>
            <section className={styles.lista} aria-label='Oportunidades de serviço'>
                {carregando && <p className={styles.vazio}>Carregando oportunidades…</p>}
                {erro && (
                    <p className={styles.vazio} role='alert'>
                        {erro}{' '}
                        <button type='button' onClick={carregar}>
                            Tentar novamente
                        </button>
                    </p>
                )}
                {!carregando &&
                    !erro &&
                    filtradas.map((item) => {
                        const inicio = String(item.data || '').split('-')
                        const dia = inicio[2] || '—'
                        const mes = inicio[1] ? MESES[Number(inicio[1]) - 1] : ''
                        return (
                            <article key={item.id} className={styles.cartao}>
                                <div className={styles.data}>
                                    <strong>{dia}</strong>
                                    <span>{mes}</span>
                                </div>
                                <div className={styles.info}>
                                    <h2>{item.item}</h2>
                                    <p className={styles.evento}>{item.nome_evento}</p>
                                    <p>
                                        <b>DATA E HORA:</b>{' '}
                                        {dataHoraBr(`${item.data} ${item.horario_inicio}`)}
                                    </p>
                                    <p>
                                        <b>LOCAL:</b>{' '}
                                        {[item.nome_local, item.cidade, item.estado]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                    <p>
                                        <b>COTAÇÃO ATÉ:</b> {dataBr(item.cotacao_ate)}
                                    </p>
                                </div>
                                <div className={styles.descricao}>
                                    <b>Descrição</b>
                                    <p>{item.descricao}</p>
                                    <div className={styles.acoes}>
                                        <Link
                                            className={styles.secundario}
                                            to={`/fornecedor/eventos/${item.evento_id}`}
                                        >
                                            Ver mais
                                        </Link>
                                        <Link
                                            className={styles.primario}
                                            to={`/fornecedor/eventos/${item.evento_id}/propostas/nova?vaga=${item.id}`}
                                        >
                                            Fazer proposta
                                        </Link>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                {!carregando && !erro && filtradas.length === 0 && (
                    <p className={styles.vazio}>Nenhuma oportunidade disponível.</p>
                )}
            </section>
        </main>
    )
}

export default OportunidadesFornecedor
