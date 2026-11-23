import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '@/utils/api'
import styles from './DetalheEvento.module.css'

const STATUS_EVENTO = {
    rascunho: { rotulo: 'Rascunho', classe: '' },
    em_cotacao: { rotulo: 'Em cotação', classe: styles.statusEmCotacao },
    publicado: { rotulo: 'Publicado', classe: styles.statusPublicado },
    encerrado: { rotulo: 'Encerrado', classe: styles.statusEncerrado },
}

function formatarMoeda(valor) {
    if (valor == null || valor === '') return 'Não calculado'
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(data) {
    if (!data) return 'Não informado'
    const [ano, mes, dia] = String(data).slice(0, 10).split('-')
    return `${dia}/${mes}/${ano}`
}

function DetalheEvento() {
    const { id } = useParams()
    const [evento, setEvento] = useState(null)
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        setCarregando(true)
        api(`/eventos/${id}`)
            .then(setEvento)
            .catch(() => setEvento(null))
            .finally(() => setCarregando(false))
    }, [id])

    if (carregando) return <main className={styles.pagina}>Carregando evento…</main>

    if (!evento) {
        return (
            <main className={styles.pagina}>
                <Link className={styles.voltar} to='/eventos'>
                    ← Voltar para eventos
                </Link>
                <p className={styles.naoEncontrado}>Evento não encontrado.</p>
            </main>
        )
    }

    const fornecedores = evento.vagas_servico || []
    const statusInfo = STATUS_EVENTO[evento.status] || { rotulo: evento.status, classe: '' }

    return (
        <main className={styles.pagina}>
            <Link className={styles.voltar} to='/eventos'>
                ← Voltar para eventos
            </Link>

            <header className={styles.tituloLinha}>
                <h1>{evento.nome}</h1>
                <span className={`${styles.status} ${statusInfo.classe}`}>{statusInfo.rotulo}</span>
            </header>

            <section className={styles.capaLinha} aria-label='Imagem do evento'>
                <div
                    className={styles.imagem}
                    role='img'
                    aria-label={`Imagem do evento ${evento.nome}`}
                >
                    <span>[ Imagem do evento ]</span>
                </div>
            </section>

            <section className={styles.descricao} aria-labelledby='titulo-descricao'>
                <h2 id='titulo-descricao'>Descrição:</h2>
                <p>{evento.descricao || 'Descrição não informada.'}</p>
                <dl className={styles.dadosEvento}>
                    <div>
                        <dt>Data:</dt>
                        <dd>{formatarData(evento.data)}</dd>
                    </div>
                    <div>
                        <dt>Hora:</dt>
                        <dd>
                            {String(evento.horario_inicio).slice(0, 5)} às{' '}
                            {String(evento.horario_fim).slice(0, 5)}
                        </dd>
                    </div>
                    <div>
                        <dt>Local:</dt>
                        <dd>{evento.endereco || 'Não informado'}</dd>
                    </div>
                    <div>
                        <dt>Público mínimo:</dt>
                        <dd>
                            {evento.publico_min ?? 'Não informado'}
                            {evento.publico_min != null ? ' pessoas' : ''}
                        </dd>
                    </div>
                    <div>
                        <dt>Público máximo:</dt>
                        <dd>
                            {evento.publico_max ?? 'Não informado'}
                            {evento.publico_max != null ? ' pessoas' : ''}
                        </dd>
                    </div>
                    <div>
                        <dt>Criado em:</dt>
                        <dd>{formatarData(evento.criado_em)}</dd>
                    </div>
                    <div>
                        <dt>Última alteração:</dt>
                        <dd>{formatarData(evento.atualizado_em)}</dd>
                    </div>
                </dl>
            </section>

            <section className={styles.financeiro} aria-labelledby='titulo-financeiro'>
                <h2 id='titulo-financeiro'>Planejamento financeiro:</h2>
                <div className={styles.indicadores}>
                    <article>
                        <h3>Custo total</h3>
                        <strong>{formatarMoeda(evento.custo_total)}</strong>
                    </article>
                    <article>
                        <h3>Margem de lucro</h3>
                        <strong>
                            {evento.margem_lucro == null
                                ? 'Não calculada'
                                : `${evento.margem_lucro}%`}
                        </strong>
                    </article>
                    <article>
                        <h3>Ticket (público mín.)</h3>
                        <strong>{formatarMoeda(evento.ticket_min)}</strong>
                    </article>
                    <article>
                        <h3>Ticket (público máx.)</h3>
                        <strong>{formatarMoeda(evento.ticket_max)}</strong>
                    </article>
                </div>
            </section>

            <section className={styles.organizador} aria-labelledby='titulo-organizador'>
                <h2 id='titulo-organizador'>Organizador responsável:</h2>
                <div className={styles.organizadorCard}>
                    <span className={styles.avatar} aria-hidden='true'>
                        {evento.organizador_nome
                            .split(/\s+/)
                            .slice(0, 2)
                            .map((parte) => parte[0])
                            .join('')
                            .toUpperCase()}
                    </span>
                    <strong>{evento.organizador_nome}</strong>
                    <Link
                        className={styles.botaoVer}
                        to={`/organizadores/${evento.organizador_id}`}
                    >
                        Ver mais
                    </Link>
                </div>
            </section>

            <section className={styles.fornecedores} aria-labelledby='titulo-fornecedores'>
                <h2 id='titulo-fornecedores'>Fornecedores selecionados:</h2>
                <div className={styles.listaFornecedores}>
                    {fornecedores.map((fornecedor, index) => (
                        <article
                            className={styles.fornecedorCard}
                            key={`${fornecedor.fornecedor_id}-${index}`}
                        >
                            <span className={styles.avatar} aria-hidden='true'>
                                {fornecedor.fornecedor_nome
                                    .split(/\s+/)
                                    .slice(0, 2)
                                    .map((parte) => parte[0])
                                    .join('')
                                    .toUpperCase()}
                            </span>
                            <div className={styles.fornecedorDados}>
                                <strong>{fornecedor.fornecedor_nome}</strong>
                                <p>
                                    Item: {fornecedor.vaga_categoria || 'Serviço não informado'} ·{' '}
                                    {formatarMoeda(fornecedor.proposta_valor)}
                                </p>
                            </div>
                            <Link
                                className={styles.botaoVer}
                                to={`/adm/fornecedores/${fornecedor.fornecedor_id}`}
                            >
                                Ver mais
                            </Link>
                        </article>
                    ))}
                    {fornecedores.length === 0 && (
                        <p className={styles.semFornecedores}>Nenhum fornecedor selecionado.</p>
                    )}
                </div>
            </section>
        </main>
    )
}

export default DetalheEvento
