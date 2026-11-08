import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/utils/api'
import styles from './DetalhesFornecedor.module.css'

const ROTULOS_STATUS = {
    pendente: 'Pendente',
    aprovado: 'Aprovado',
    reprovado: 'Reprovado',
}

const STATUS_PROPOSTA = {
    pendente: { rotulo: 'Pendente', classe: 'pendente' },
    selecionada: { rotulo: 'Selecionada', classe: 'pendente' },
    aceita: { rotulo: 'Aceita', classe: 'aprovado' },
    recusada: { rotulo: 'Recusada', classe: 'reprovado' },
}

const dinheiro = (valor) =>
    Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function DetalhesFornecedor() {
    const { id } = useParams()
    const [fornecedor, setFornecedor] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const [status, setStatus] = useState('')
    const [mensagem, setMensagem] = useState('')

    useEffect(() => {
        setCarregando(true)
        setMensagem('')
        api(`/fornecedores/${id}`)
            .then((resposta) => {
                setFornecedor(resposta)
                setStatus(resposta.status_cadastro)
            })
            .catch(() => setFornecedor(null))
            .finally(() => setCarregando(false))
    }, [id])

    if (carregando) return <main className={styles.pagina}>Carregando fornecedor…</main>

    if (!fornecedor) {
        return (
            <main className={styles.pagina}>
                <Link className={styles.voltar} to='/adm/usuarios'>
                    ← Usuários
                </Link>
                <p className={styles.naoEncontrado}>Fornecedor não encontrado.</p>
            </main>
        )
    }

    const iniciais = fornecedor.nome
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte[0])
        .join('')
        .toUpperCase()
    const propostasFornecedor = fornecedor.propostas || []

    async function atualizarStatus(novoStatus) {
        try {
            await api(`/admin/${fornecedor.id}?status_cadastro=${novoStatus}`, { method: 'PATCH' })
            setStatus(novoStatus)
            setMensagem(`Cadastro ${novoStatus === 'aprovado' ? 'aprovado' : 'reprovado'}.`)
        } catch (erro) {
            setMensagem(erro.message)
        }
    }

    return (
        <main className={styles.pagina}>
            <Link className={styles.voltar} to='/adm/usuarios'>
                ← Usuários
            </Link>

            <section className={styles.destaque} aria-label='Resumo do fornecedor'>
                <div className={styles.avatar} aria-hidden='true'>
                    {iniciais}
                </div>
                <div className={styles.identificacao}>
                    <div className={styles.nomeLinha}>
                        <h1>{fornecedor.nome}</h1>
                        <span className={`${styles.status} ${styles[`status${status}`]}`}>
                            {ROTULOS_STATUS[status]}
                        </span>
                    </div>
                    <p>Fornecedor</p>
                    <div className={styles.acoes}>
                        {status !== 'aprovado' && (
                            <button
                                type='button'
                                className={styles.aprovar}
                                onClick={() => atualizarStatus('aprovado')}
                            >
                                Aprovar cadastro
                            </button>
                        )}
                        {status !== 'reprovado' && (
                            <button
                                type='button'
                                className={styles.reprovar}
                                onClick={() => atualizarStatus('reprovado')}
                            >
                                Reprovar
                            </button>
                        )}
                    </div>
                    <p className={styles.mensagem} role='status' aria-live='polite'>
                        {mensagem}
                    </p>
                </div>
            </section>

            <div className={styles.informacoes}>
                <section className={styles.bloco} aria-labelledby='titulo-dados'>
                    <h2 id='titulo-dados'>Dados</h2>
                    <dl>
                        <div>
                            <dt>CNPJ:</dt>
                            <dd>{fornecedor.cnpj || 'Não informado'}</dd>
                        </div>
                        <div>
                            <dt>E-mail:</dt>
                            <dd>{fornecedor.email || 'Não informado'}</dd>
                        </div>
                        <div>
                            <dt>Telefone:</dt>
                            <dd>{fornecedor.telefone || 'Não informado'}</dd>
                        </div>
                        <div>
                            <dt>Cadastrado em:</dt>
                            <dd>
                                {fornecedor.criado_em
                                    ? String(fornecedor.criado_em)
                                          .slice(0, 10)
                                          .split('-')
                                          .reverse()
                                          .join('/')
                                    : 'Não informado'}
                            </dd>
                        </div>
                    </dl>
                </section>

                <section className={styles.bloco} aria-labelledby='titulo-descricao'>
                    <h2 id='titulo-descricao'>Descrição</h2>
                    <p className={styles.textoDescricao}>
                        {fornecedor.descricao || 'Sem descrição cadastrada.'}
                    </p>
                </section>
            </div>

            <section className={styles.secaoPropostas} aria-labelledby='titulo-propostas'>
                <h2 id='titulo-propostas'>Propostas na plataforma:</h2>
                <div className={styles.listaPropostas}>
                    {propostasFornecedor.length ? (
                        propostasFornecedor.map((proposta) => (
                            <article className={styles.proposta} key={proposta.id}>
                                <p className={styles.nomeEvento}>
                                    <strong>{proposta.nome_evento || 'Evento'}</strong> ·{' '}
                                    {proposta.nome_vaga}
                                </p>
                                <div className={styles.detalheProposta}>
                                    <strong>{dinheiro(proposta.valor)}</strong>
                                    <span
                                        className={`${styles.statusProposta} ${styles[`proposta${STATUS_PROPOSTA[proposta.status]?.classe}`]}`}
                                    >
                                        {STATUS_PROPOSTA[proposta.status]?.rotulo ||
                                            proposta.status}
                                    </span>
                                </div>
                            </article>
                        ))
                    ) : (
                        <p className={styles.semPropostas}>
                            Este fornecedor ainda não possui propostas na plataforma.
                        </p>
                    )}
                </div>
            </section>
        </main>
    )
}

export default DetalhesFornecedor
