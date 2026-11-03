import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { eventos } from '@/dados/eventos'
import cadastros from '@/dados/cadastros.json'
import styles from './DetalheEvento.module.css'

const STATUS_EVENTO = {
    em_cotacao: { rotulo: 'Em cotação', classe: styles.statusEmCotacao },
    orcamento_fechado: { rotulo: 'Orçamento fechado', classe: styles.statusOrcamentoFechado },
    reprovado: { rotulo: 'Reprovado', classe: styles.statusReprovado },
}

function formatarMoeda(valor) {
    if (valor == null || valor === '') return 'Não calculado'
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(data) {
    if (!data) return 'Não informado'
    const [dia, mes, ano] = data.split('/')
    return `${dia}/${mes}/${ano}`
}

function DetalheEvento() {
    const { id } = useParams()
    const evento = eventos.find((item) => item.id === Number(id))
    const [status, setStatus] = useState(evento?.statusAdm || evento?.status)
    const [mensagem, setMensagem] = useState('')

    useEffect(() => {
        setStatus(evento?.statusAdm || evento?.status)
        setMensagem('')
    }, [evento?.id])

    if (!evento) {
        return (
            <main className={styles.pagina}>
                <Link className={styles.voltar} to='/eventos'>← Voltar para eventos</Link>
                <p className={styles.naoEncontrado}>Evento não encontrado.</p>
            </main>
        )
    }

    const fornecedores = cadastros.fornecedores.filter((fornecedor) => fornecedor.eventos.includes(evento.id))
    const organizador = cadastros.organizadores.find((item) => item.nome === evento.organizador)
    const [data, hora] = evento.data.split(' - ')
    const statusInfo = STATUS_EVENTO[status] || { rotulo: status, classe: '' }

    function reprovarEvento() {
        evento.statusAdm = 'reprovado'
        evento.status = 'reprovado'
        setStatus('reprovado')
        setMensagem('Evento reprovado.')
    }

    return (
        <main className={styles.pagina}>
            <Link className={styles.voltar} to='/eventos'>← Voltar para eventos</Link>

            <header className={styles.tituloLinha}>
                <h1>{evento.nome}</h1>
                <span className={`${styles.status} ${statusInfo.classe}`}>{statusInfo.rotulo}</span>
            </header>

            <section className={styles.capaLinha} aria-label='Imagem e situação do evento'>
                <div className={styles.imagem} role='img' aria-label={`Imagem do evento ${evento.nome}`}>
                    <span>[ Imagem do evento ]</span>
                </div>
                <aside className={styles.acoesEvento}>
                    {status !== 'reprovado' && <button type='button' className={styles.reprovar} onClick={reprovarEvento}>Reprovar evento</button>}
                    <p><b>Criado em:</b> {formatarData(evento.criadoEm)}</p>
                    <p><b>Última alteração:</b> {formatarData(evento.atualizadoEm)}</p>
                    <p className={styles.mensagem} role='status' aria-live='polite'>{mensagem}</p>
                </aside>
            </section>

            <section className={styles.descricao} aria-labelledby='titulo-descricao'>
                <h2 id='titulo-descricao'>Descrição:</h2>
                <p>{evento.descricao || 'Descrição não informada.'}</p>
                <dl className={styles.dadosEvento}>
                    <div><dt>Data:</dt><dd>{formatarData(data)}</dd></div>
                    <div><dt>Hora:</dt><dd>{hora || 'Não informado'}</dd></div>
                    <div><dt>Local:</dt><dd>{evento.local || 'Não informado'}</dd></div>
                    <div><dt>Público mínimo:</dt><dd>{evento.publicoMinimo ?? 'Não informado'}{evento.publicoMinimo != null ? ' pessoas' : ''}</dd></div>
                    <div><dt>Público máximo:</dt><dd>{evento.publicoMaximo ?? 'Não informado'}{evento.publicoMaximo != null ? ' pessoas' : ''}</dd></div>
                </dl>
            </section>

            <section className={styles.financeiro} aria-labelledby='titulo-financeiro'>
                <h2 id='titulo-financeiro'>Planejamento financeiro:</h2>
                <div className={styles.indicadores}>
                    <article><h3>Custo total</h3><strong>{formatarMoeda(evento.custoTotal)}</strong></article>
                    <article><h3>Margem de lucro</h3><strong>{evento.margemLucro == null ? 'Não calculada' : `${evento.margemLucro}%`}</strong></article>
                    <article><h3>Ticket (público mín.)</h3><strong>{formatarMoeda(evento.ticketMinimo)}</strong></article>
                    <article><h3>Ticket (público máx.)</h3><strong>{formatarMoeda(evento.ticketMaximo)}</strong></article>
                </div>
            </section>

            <section className={styles.organizador} aria-labelledby='titulo-organizador'>
                <h2 id='titulo-organizador'>Organizador responsável:</h2>
                <div className={styles.organizadorCard}>
                    <span className={styles.avatar} aria-hidden='true'>{evento.organizador.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase()}</span>
                    <strong>{evento.organizador}</strong>
                    {organizador && <Link className={styles.botaoVer} to={`/organizadores/${organizador.id}`}>Ver mais</Link>}
                </div>
            </section>

            <section className={styles.fornecedores} aria-labelledby='titulo-fornecedores'>
                <h2 id='titulo-fornecedores'>Fornecedores selecionados:</h2>
                <div className={styles.listaFornecedores}>
                    {fornecedores.map((fornecedor) => (
                        <article className={styles.fornecedorCard} key={fornecedor.id}>
                            <span className={styles.avatar} aria-hidden='true'>{fornecedor.nome.split(/\s+/).slice(0, 2).map((parte) => parte[0]).join('').toUpperCase()}</span>
                            <div className={styles.fornecedorDados}>
                                <strong>{fornecedor.nome}</strong>
                                <p>Item: {fornecedor.servico || 'Serviço não informado'} · {formatarMoeda(fornecedor.valor)}</p>
                            </div>
                            <Link className={styles.botaoVer} to={`/adm/fornecedores/${fornecedor.id}`}>Ver mais</Link>
                        </article>
                    ))}
                    {fornecedores.length === 0 && <p className={styles.semFornecedores}>Nenhum fornecedor selecionado.</p>}
                </div>
            </section>
        </main>
    )
}

export default DetalheEvento
