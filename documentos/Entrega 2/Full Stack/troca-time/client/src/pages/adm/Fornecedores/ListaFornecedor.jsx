import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import cadastros from '@/dados/cadastros.json'
import styles from './ListaFornecedor.module.css'

const FILTROS = [
    { id: 'pendente', label: 'Pendentes' },
    { id: 'aprovado', label: 'Aprovados' },
    { id: 'rejeitado', label: 'Reprovados' },
    { id: 'todos', label: 'Todos' },
]

function ListaFornecedor() {
    const [tipo, setTipo] = useState('fornecedores')
    const [filtro, setFiltro] = useState('pendente')
    const [busca, setBusca] = useState('')
    const lista = cadastros[tipo]
    const organizadores = tipo === 'organizadores'

    const filtrados = useMemo(() => lista.filter((item) => {
        const texto = `${item.nome} ${item.documento} ${item.cidade} ${item.estado} ${item.descricao}`.toLocaleLowerCase('pt-BR')
        return texto.includes(busca.toLocaleLowerCase('pt-BR')) &&
            (filtro === 'todos' || item.status === filtro)
    }), [lista, busca, filtro])

    function atualizarStatus(id, status) {
        const cadastro = lista.find((item) => item.id === id)
        if (cadastro) cadastro.status = status
        setFiltro(status)
    }

    function trocarTipo(novoTipo) {
        setTipo(novoTipo)
        setFiltro('pendente')
        setBusca('')
    }

    return (
        <main className={styles.pagina}>
            <header className={styles.cabecalhoPagina}>
                <div>
                    <h1>{organizadores ? 'ORGANIZADORES' : 'FORNECEDORES'}</h1>
                    <p>Analise os cadastros e aprove ou reprove o acesso à plataforma.</p>
                </div>
                <div className={styles.tipos} role='group' aria-label='Tipo de cadastro'>
                    <button type='button' className={!organizadores ? styles.tipoAtivo : ''} aria-pressed={!organizadores} onClick={() => trocarTipo('fornecedores')}>Fornecedores</button>
                    <button type='button' className={organizadores ? styles.tipoAtivo : ''} aria-pressed={organizadores} onClick={() => trocarTipo('organizadores')}>Organizadores</button>
                </div>
            </header>

            <label className={styles.busca}>
                <span className={styles.srOnly}>Buscar por nome ou CPF/CNPJ</span>
                <input value={busca} onChange={(evento) => setBusca(evento.target.value)} placeholder='Buscar por nome ou CPF/CNPJ' />
            </label>

            <div className={styles.filtros} role='group' aria-label='Filtrar cadastros'>
                {FILTROS.map((opcao) => (
                    <button key={opcao.id} type='button' aria-pressed={filtro === opcao.id} className={`${styles.filtro} ${styles[opcao.id]} ${filtro === opcao.id ? styles.filtroAtivo : ''}`} onClick={() => setFiltro(opcao.id)}>
                        {opcao.label}
                    </button>
                ))}
            </div>

            <section className={styles.lista} aria-label={organizadores ? 'Lista de organizadores' : 'Lista de fornecedores'}>
                {filtrados.map((cadastro) => (
                    <article className={styles.cartao} key={cadastro.id}>
                        <div className={styles.avatar} aria-hidden='true'>{cadastro.nome.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase()}</div>
                        <div className={styles.dados}>
                            <div className={styles.nomeLinha}>
                                <h2>{cadastro.nome}</h2>
                                <span className={`${styles.status} ${styles[`status${cadastro.status}`]}`}>{cadastro.status === 'pendente' ? 'Pendente' : cadastro.status === 'aprovado' ? 'Aprovado' : 'Reprovado'}</span>
                            </div>
                            <p><b>CPF/CNPJ:</b> {cadastro.documento}</p>
                            <p><b>CIDADE:</b> {cadastro.cidade}/{cadastro.estado}</p>
                            {cadastro.servico && <p><b>CATEGORIA:</b> {cadastro.servico}</p>}
                        </div>
                        <div className={styles.descricao}>
                            <h3>Descrição</h3>
                            <p>{cadastro.descricao}</p>
                        </div>
                        <div className={styles.acoes}>
                            {cadastro.status !== 'aprovado' && <button type='button' className={styles.aprovar} onClick={() => atualizarStatus(cadastro.id, 'aprovado')}>Aprovar</button>}
                            {cadastro.status !== 'rejeitado' && <button type='button' className={styles.reprovar} onClick={() => atualizarStatus(cadastro.id, 'rejeitado')}>Reprovar</button>}
                            <Link className={styles.verMais} to={organizadores ? `/organizadores/${cadastro.id}` : `/adm/fornecedores/${cadastro.id}`}>Ver mais</Link>
                        </div>
                    </article>
                ))}
                {filtrados.length === 0 && <p className={styles.vazio}>Nenhum cadastro encontrado.</p>}
            </section>

        </main>
    )
}

export default ListaFornecedor
