import { useState } from 'react'
import {
    INITIAL_EVENTS,
    INITIAL_PROPOSALS,
    VISIBLE_EVENTS,
    COLUMN_LABELS,
} from '@/dados/dadosFornecedores'
import styles from './HomeFornecedores.module.css'

const CLASSES_COLUNA = {
    aprovadas: styles.proposalColumnAprovadas,
    pendentes: styles.proposalColumnPendentes,
    reprovados: styles.proposalColumnReprovados,
}

function HomeFornecedores() {
    const [eventIndex, setEventIndex] = useState(0)
    const [selectedEvent, setSelectedEvent] = useState(null)

    const [proposalsOpen, setProposalsOpen] = useState(true)
    const [proposals, setProposals] = useState(INITIAL_PROPOSALS)
    const [evaluating, setEvaluating] = useState(null)

    const maxEventIndex = Math.max(0, INITIAL_EVENTS.length - VISIBLE_EVENTS)
    const isAtEnd = eventIndex >= maxEventIndex
    const hasMoreThanOnePage = maxEventIndex > 0

    function handleNextEvents() {
        setEventIndex((prev) => Math.min(prev + 1, maxEventIndex))
    }

    function handleBackToStart() {
        setEventIndex(0)
    }

    function openEvaluation(proposal, fromColumn) {
        setEvaluating({ proposal, fromColumn })
    }

    function resolveEvaluation(decision) {
        if (!evaluating) return
        const { proposal, fromColumn } = evaluating

        if (fromColumn === decision) {
            setEvaluating(null)
            return
        }

        setProposals((prev) => ({
            ...prev,
            [fromColumn]: prev[fromColumn].filter((p) => p.id !== proposal.id),
            [decision]: [...prev[decision], proposal],
        }))

        setEvaluating(null)
    }

    return (
        <div className={styles.app}>
            <main className={styles.page}>
                {/* ===================== BOAS-VINDAS ===================== */}
                <section className={styles.greeting}>
                    <h1>Olá,</h1>
                    <p>Bem-vindo de volta!</p>
                </section>

                {/* ===================== PRÓXIMOS EVENTOS ===================== */}
                <section className={styles.eventsPanel}>
                    <span className={styles.eventsPanelTitle}>Próximos eventos</span>

                    <div className={styles.eventsPanelBody}>
                        <div className={styles.eventCardsViewport}>
                            <div
                                className={styles.eventCardsTrack}
                                style={{
                                    transform: `translateX(-${eventIndex * (100 / VISIBLE_EVENTS)}%)`,
                                }}
                            >
                                {INITIAL_EVENTS.map((event) => (
                                    <div className={styles.eventSlot} key={event.id}>
                                        <article className={styles.eventCard}>
                                            <h3>{event.name}</h3>
                                            <p>Informações do evento: {event.info}</p>
                                            <p>Dia e hora: {event.date}</p>
                                            <p>Organizador: {event.organizer}</p>
                                            <p>Local: {event.location}</p>
                                            <button
                                                className={`${styles.btnPill} ${styles.btnPillLime}`}
                                                onClick={() => setSelectedEvent(event)}
                                            >
                                                Saiba mais
                                            </button>
                                        </article>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {hasMoreThanOnePage &&
                            (isAtEnd ? (
                                <button
                                    className={`${styles.eventsPanelNext} ${styles.eventsPanelNextReset}`}
                                    aria-label='Voltar ao início'
                                    onClick={handleBackToStart}
                                >
                                    ↺
                                </button>
                            ) : (
                                <button
                                    className={styles.eventsPanelNext}
                                    aria-label='Próximo evento'
                                    onClick={handleNextEvents}
                                >
                                    →
                                </button>
                            ))}
                    </div>
                </section>

                {/* ===================== TOGGLE PROPOSTAS ===================== */}
                <div className={styles.sectionToggle}>
                    <button
                        className={styles.btnToggle}
                        onClick={() => setProposalsOpen((v) => !v)}
                    >
                        Propostas{' '}
                        <span
                            className={`${styles.btnToggleArrow} ${proposalsOpen ? '' : styles.btnToggleArrowDown}`}
                        >
                            ↑
                        </span>
                    </button>
                </div>

                {/* ===================== COLUNAS DE PROPOSTAS ===================== */}
                {proposalsOpen && (
                    <section className={styles.proposals}>
                        {Object.entries(proposals).map(([columnKey, items]) => (
                            <div
                                className={`${styles.proposalColumn} ${CLASSES_COLUNA[columnKey]}`}
                                key={columnKey}
                            >
                                <div className={styles.proposalColumnLabel}>
                                    <span>{COLUMN_LABELS[columnKey]}</span>
                                </div>

                                <div className={styles.proposalColumnCards}>
                                    {items.map((proposal) => (
                                        <article className={styles.proposalCard} key={proposal.id}>
                                            <h3>{proposal.name}</h3>
                                            <p>Serviço: {proposal.service}</p>
                                            <p>Preço: {proposal.price}</p>
                                            <button
                                                className={styles.btnAvaliar}
                                                onClick={() => openEvaluation(proposal, columnKey)}
                                            >
                                                Avaliar
                                            </button>
                                        </article>
                                    ))}

                                    {items.length === 0 && (
                                        <p className={styles.empty}>Nenhuma proposta aqui.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </section>
                )}
            </main>

            {/* ===================== MODAL: DETALHES DO EVENTO ===================== */}
            {selectedEvent && (
                <div className={styles.modalOverlay} onClick={() => setSelectedEvent(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>{selectedEvent.name}</h2>
                        <p>
                            <strong>Informações:</strong> {selectedEvent.info}
                        </p>
                        <p>
                            <strong>Dia e hora:</strong> {selectedEvent.date}
                        </p>
                        <p>
                            <strong>Organizador:</strong> {selectedEvent.organizer}
                        </p>
                        <p>
                            <strong>Local:</strong> {selectedEvent.location}
                        </p>
                        <button
                            className={`${styles.btnPill} ${styles.btnPillLime}`}
                            onClick={() => setSelectedEvent(null)}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}

            {/* ===================== MODAL: AVALIAR PROPOSTA ===================== */}
            {evaluating && (
                <div className={styles.modalOverlay} onClick={() => setEvaluating(null)}>
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h2>{evaluating.proposal.name}</h2>
                        <p>
                            <strong>Serviço:</strong> {evaluating.proposal.service}
                        </p>
                        <p>
                            <strong>Preço:</strong> {evaluating.proposal.price}
                        </p>

                        <div className={styles.modalActions}>
                            <button
                                className={`${styles.btnAvaliar} ${styles.btnAvaliarReject}`}
                                onClick={() => resolveEvaluation('reprovados')}
                            >
                                Reprovar
                            </button>
                            <button
                                className={styles.btnAvaliar}
                                onClick={() => resolveEvaluation('aprovadas')}
                            >
                                Aprovar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default HomeFornecedores
