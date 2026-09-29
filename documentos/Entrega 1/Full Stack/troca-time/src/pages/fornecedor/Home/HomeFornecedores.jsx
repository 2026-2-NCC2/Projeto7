import { useState } from "react";
import { INITIAL_EVENTS, INITIAL_PROPOSALS, VISIBLE_EVENTS, COLUMN_LABELS } from "../../../dados/dadosFornecedores.js";
import "./styles.css";

function HomeFornecedores() {

  const [eventIndex, setEventIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [proposalsOpen, setProposalsOpen] = useState(true);
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [evaluating, setEvaluating] = useState(null);


  const maxEventIndex = Math.max(0, INITIAL_EVENTS.length - VISIBLE_EVENTS);
  const isAtEnd = eventIndex >= maxEventIndex;
  const hasMoreThanOnePage = maxEventIndex > 0;

  function handleNextEvents() {
    setEventIndex((prev) => Math.min(prev + 1, maxEventIndex));
  }

  function handleBackToStart() {
    setEventIndex(0);
  }

  function openEvaluation(proposal, fromColumn) {
    setEvaluating({ proposal, fromColumn });
  }

  function resolveEvaluation(decision) {
    if (!evaluating) return;
    const { proposal, fromColumn } = evaluating;

    if (fromColumn === decision) {
      setEvaluating(null);
      return;
    }

    setProposals((prev) => ({
      ...prev,
      [fromColumn]: prev[fromColumn].filter((p) => p.id !== proposal.id),
      [decision]: [...prev[decision], proposal],
    }));

    setEvaluating(null);
  }

  return (
    <div className="tt-app">
      <main className="tt-page">
        {/* ===================== BOAS-VINDAS ===================== */}
        <section className="tt-greeting">
          <h1>Olá,</h1>
          <p>Bem-vindo de volta!</p>
        </section>

        {/* ===================== PRÓXIMOS EVENTOS ===================== */}
        <section className="tt-events-panel">
          <span className="tt-events-panel__title">Próximos eventos</span>

          <div className="tt-events-panel__body">
            <div className="tt-event-cards-viewport">
              <div
                className="tt-event-cards-track"
                style={{
                  transform: `translateX(-${eventIndex * (100 / VISIBLE_EVENTS)}%)`,
                }}
              >
                {INITIAL_EVENTS.map((event) => (
                  <div className="tt-event-slot" key={event.id}>
                    <article className="tt-event-card">
                      <h3>{event.name}</h3>
                      <p>Informações do evento: {event.info}</p>
                      <p>Dia e hora: {event.date}</p>
                      <p>Organizador: {event.organizer}</p>
                      <p>Local: {event.location}</p>
                      <button
                        className="tt-btn-pill tt-btn-pill--lime"
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
                  className="tt-events-panel__next tt-events-panel__next--reset"
                  aria-label="Voltar ao início"
                  onClick={handleBackToStart}
                >
                  ↺
                </button>
              ) : (
                <button
                  className="tt-events-panel__next"
                  aria-label="Próximo evento"
                  onClick={handleNextEvents}
                >
                  →
                </button>
              ))}
          </div>
        </section>

        {/* ===================== TOGGLE PROPOSTAS ===================== */}
        <div className="tt-section-toggle">
          <button
            className="tt-btn-toggle"
            onClick={() => setProposalsOpen((v) => !v)}
          >
            Propostas{" "}
            <span className={`tt-btn-toggle__arrow ${proposalsOpen ? "" : "tt-btn-toggle__arrow--down"}`}>
              ↑
            </span>
          </button>
        </div>

        {/* ===================== COLUNAS DE PROPOSTAS ===================== */}
        {proposalsOpen && (
          <section className="tt-proposals">
            {Object.entries(proposals).map(([columnKey, items]) => (
              <div className={`tt-proposal-column tt-proposal-column--${columnKey}`} key={columnKey}>
                <div className="tt-proposal-column__label">
                  <span>{COLUMN_LABELS[columnKey]}</span>
                </div>

                <div className="tt-proposal-column__cards">
                  {items.map((proposal) => (
                    <article className="tt-proposal-card" key={proposal.id}>
                      <h3>{proposal.name}</h3>
                      <p>Serviço: {proposal.service}</p>
                      <p>Preço: {proposal.price}</p>
                      <button
                        className="tt-btn-avaliar"
                        onClick={() => openEvaluation(proposal, columnKey)}
                      >
                        Avaliar
                      </button>
                    </article>
                  ))}

                  {items.length === 0 && (
                    <p className="tt-empty">Nenhuma proposta aqui.</p>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}
      </main>

      {/* ===================== MODAL: DETALHES DO EVENTO ===================== */}
      {selectedEvent && (
        <div className="tt-modal-overlay" onClick={() => setSelectedEvent(null)}>
          <div className="tt-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedEvent.name}</h2>
            <p><strong>Informações:</strong> {selectedEvent.info}</p>
            <p><strong>Dia e hora:</strong> {selectedEvent.date}</p>
            <p><strong>Organizador:</strong> {selectedEvent.organizer}</p>
            <p><strong>Local:</strong> {selectedEvent.location}</p>
            <button className="tt-btn-pill tt-btn-pill--lime" onClick={() => setSelectedEvent(null)}>
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* ===================== MODAL: AVALIAR PROPOSTA ===================== */}
      {evaluating && (
        <div className="tt-modal-overlay" onClick={() => setEvaluating(null)}>
          <div className="tt-modal" onClick={(e) => e.stopPropagation()}>
            <h2>{evaluating.proposal.name}</h2>
            <p><strong>Serviço:</strong> {evaluating.proposal.service}</p>
            <p><strong>Preço:</strong> {evaluating.proposal.price}</p>

            <div className="tt-modal-actions">
              <button className="tt-btn-avaliar tt-btn-avaliar--reject" onClick={() => resolveEvaluation("reprovados")}>
                Reprovar
              </button>
              <button className="tt-btn-avaliar" onClick={() => resolveEvaluation("aprovadas")}>
                Aprovar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default HomeFornecedores;
