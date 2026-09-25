import { useState } from "react";
import "./styles.css";

// Defina quantos cards aparecem por vez na tela
const VISIBLE_EVENTS = 3;

const INITIAL_EVENTS = [
  { id: "e1", name: "Festival de Música", info: "Show com bandas locais", date: "20/10/2026 às 20h", organizer: "Produtora XYZ", location: "Parque da Cidade" },
  { id: "e2", name: "Feira Gastronômica", info: "Comidas de rua e food trucks", date: "25/10/2026 às 12h", organizer: "Associação ABC", location: "Praça Central" },
  { id: "e3", name: "Show de Stand-up", info: "Noite de comédia", date: "01/11/2026 às 21h", organizer: "Comedy Club", location: "Teatro Municipal" },
  { id: "e4", name: "Exposição de Arte", info: "Artistas contemporâneos", date: "05/11/2026 às 10h", organizer: "Galeria Nova", location: "Centro Cultural" },
];

const INITIAL_PROPOSALS = {
  aprovadas: [
    { id: "a1", name: "Evento A", service: "Som e iluminação", price: "R$ 1.200,00" },
    { id: "a2", name: "Evento B", service: "Buffet completo", price: "R$ 3.400,00" },
    { id: "a3", name: "Evento C", service: "Segurança", price: "R$ 800,00" },
  ],
  pendentes: [
    { id: "p1", name: "Evento D", service: "Palco e telão", price: "R$ 5.000,00" },
    { id: "p2", name: "Evento E", service: "Decoração", price: "R$ 950,00" },
    { id: "p3", name: "Evento F", service: "Fotografia", price: "R$ 700,00" },
  ],
  reprovados: [
    { id: "r1", name: "Evento G", service: "Transporte", price: "R$ 1.100,00" },
    { id: "r2", name: "Evento H", service: "Catering", price: "R$ 2.200,00" },
    { id: "r3", name: "Evento I", service: "DJ", price: "R$ 600,00" },
  ],
};

const COLUMN_LABELS = {
  aprovadas: "Aprovadas",
  pendentes: "Pendentes",
  reprovados: "Reprovados",
};

function Home() {
  const [profileOpen, setProfileOpen] = useState(false);

  const [eventIndex, setEventIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const [proposalsOpen, setProposalsOpen] = useState(true);
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [evaluating, setEvaluating] = useState(null);

  const [chatOpen, setChatOpen] = useState(false);

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
      { /*===================== HEADER ===================== */}
      <header className="tt-header">
        <div className="tt-logo">
          <span className="tt-logo-icon"></span>
          <span className="tt-logo-text"></span>
        </div>

        <div className="tt-profile-wrap">
          <button className="tt-btn-profile" onClick={() => setProfileOpen((v) => !v)}>
          </button>

          {profileOpen && (
            <div className="tt-dropdown">
              <button onClick={() => alert("Ir para /minha-conta")}>Minha conta</button>
              <button onClick={() => alert("Ir para /configuracoes")}>Configurações</button>
              <button onClick={() => alert("Executar logout")}>Sair</button>
            </div>
          )}
        </div>
      </header>

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

      {/* ===================== BARRA FLUTUANTE ===================== */}
      <div className="tt-floating-bar">
        <button className="tt-btn-float" onClick={() => setChatOpen((v) => !v)}>
          💬 Chats de Conversa
        </button>
      </div>

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

      {/* ===================== PAINEL: CHAT ===================== */}
      {chatOpen && (
        <div className="tt-panel tt-panel--left">
          <div className="tt-panel__header">
            <strong>Chats de Conversa</strong>
            <button onClick={() => setChatOpen(false)}>✕</button>
          </div>
          <p className="tt-panel__body">Nenhuma conversa aberta ainda.</p>
        </div>
      )}
    </div>
  );
}

export default Home;