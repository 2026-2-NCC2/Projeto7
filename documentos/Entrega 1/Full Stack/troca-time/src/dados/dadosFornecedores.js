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

export { COLUMN_LABELS, INITIAL_EVENTS, INITIAL_PROPOSALS, VISIBLE_EVENTS }
