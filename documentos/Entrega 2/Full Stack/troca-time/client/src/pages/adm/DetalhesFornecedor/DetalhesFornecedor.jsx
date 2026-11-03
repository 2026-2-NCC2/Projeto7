import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import cadastros from '@/dados/cadastros.json'
import propostas from '@/dados/propostas.json'
import { eventos } from '@/dados/eventos'
import styles from './DetalhesFornecedor.module.css'

const ROTULOS_STATUS = {
    pendente: 'Pendente',
    aprovado: 'Aprovado',
    rejeitado: 'Reprovado',
}

const STATUS_PROPOSTA = {
    pendente: 'Aguardando resposta',
    aprovado: 'Selecionada',
    reprovado: 'Recusada',
}

function DetalhesFornecedor() {
    const { id } = useParams()
    const fornecedor = cadastros.fornecedores.find((item) => item.id === Number(id))
    const [status, setStatus] = useState(fornecedor?.status)
    const [mensagem, setMensagem] = useState('')

    useEffect(() => {
        setStatus(fornecedor?.status)
        setMensagem('')
    }, [fornecedor?.id])

    if (!fornecedor) {
        return (
            <main className={styles.pagina}>
                <Link className={styles.voltar} to='/adm/fornecedores'>← Fornecedores</Link>
                <p className={styles.naoEncontrado}>Fornecedor não encontrado.</p>
            </main>
        )
    }

    const iniciais = fornecedor.nome.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase()
    const propostasFornecedor = propostas
        .filter((proposta) => fornecedor.eventos.includes(proposta.eventoId))
        .map((proposta) => ({
            ...proposta,
            evento: eventos.find((evento) => evento.id === proposta.eventoId),
        }))

    function atualizarStatus(novoStatus) {
        fornecedor.status = novoStatus
        setStatus(novoStatus)
        setMensagem(`Cadastro ${novoStatus === 'aprovado' ? 'aprovado' : 'reprovado'}.`)
    }

    return (
        <main className={styles.pagina}>
            <Link className={styles.voltar} to='/adm/fornecedores'>← Fornecedores</Link>

            <section className={styles.destaque} aria-label='Resumo do fornecedor'>
                <div className={styles.avatar} aria-hidden='true'>{iniciais}</div>
                <div className={styles.identificacao}>
                    <div className={styles.nomeLinha}>
                        <h1>{fornecedor.nome}</h1>
                        <span className={`${styles.status} ${styles[`status${status}`]}`}>{ROTULOS_STATUS[status]}</span>
                    </div>
                    <p>Fornecedor · {fornecedor.servico || 'Categoria não informada'} · {fornecedor.cidade}/{fornecedor.estado}</p>
                    <div className={styles.acoes}>
                        {status !== 'aprovado' && <button type='button' className={styles.aprovar} onClick={() => atualizarStatus('aprovado')}>Aprovar cadastro</button>}
                        {status !== 'rejeitado' && <button type='button' className={styles.reprovar} onClick={() => atualizarStatus('rejeitado')}>Reprovar</button>}
                    </div>
                    <p className={styles.mensagem} role='status' aria-live='polite'>{mensagem}</p>
                </div>
            </section>

            <div className={styles.informacoes}>
                <section className={styles.bloco} aria-labelledby='titulo-dados'>
                    <h2 id='titulo-dados'>Dados</h2>
                    <dl>
                        <div><dt>CNPJ:</dt><dd>{fornecedor.documento}</dd></div>
                        <div><dt>E-mail:</dt><dd>{fornecedor.email || 'Não informado'}</dd></div>
                        <div><dt>Telefone:</dt><dd>{fornecedor.telefone || 'Não informado'}</dd></div>
                        <div><dt>Cidade:</dt><dd>{fornecedor.cidade}/{fornecedor.estado}</dd></div>
                        <div><dt>Categoria:</dt><dd>{fornecedor.servico || 'Não informada'}</dd></div>
                        <div><dt>Cadastrado em:</dt><dd>{fornecedor.cadastradoEm || 'Não informado'}</dd></div>
                    </dl>
                </section>

                <section className={styles.bloco} aria-labelledby='titulo-descricao'>
                    <h2 id='titulo-descricao'>Descrição</h2>
                    <p className={styles.textoDescricao}>{fornecedor.descricao}</p>
                </section>
            </div>

            <section className={styles.secaoPropostas} aria-labelledby='titulo-propostas'>
                <h2 id='titulo-propostas'>Propostas na plataforma:</h2>
                <div className={styles.listaPropostas}>
                    {propostasFornecedor.length ? propostasFornecedor.map((proposta) => (
                        <article className={styles.proposta} key={proposta.id}>
                            <p className={styles.nomeEvento}><strong>{proposta.evento?.nome || 'Evento'}</strong> · {proposta.servico}</p>
                            <div className={styles.detalheProposta}>
                                <strong>{proposta.valor}</strong>
                                <span className={`${styles.statusProposta} ${styles[`proposta${proposta.status}`]}`}>{STATUS_PROPOSTA[proposta.status] || proposta.status}</span>
                            </div>
                        </article>
                    )) : <p className={styles.semPropostas}>Este fornecedor ainda não possui propostas na plataforma.</p>}
                </div>
            </section>
        </main>
    )
}

export default DetalhesFornecedor
