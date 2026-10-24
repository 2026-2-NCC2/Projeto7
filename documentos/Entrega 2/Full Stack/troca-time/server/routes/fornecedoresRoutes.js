import express from "express";

const router = express.Router();

// Contratos HTTP das telas de fornecedores. A integração com o banco e as regras
// de negócio descritas no documento serão implementadas nos handlers do servidor.
function backendPendente(_req, res) {
    return res.status(501).json({ erro: "Endpoint aguardando integração com o banco de dados." });
}

// Home de oportunidades e detalhes do evento.
router.get("/oportunidades", backendPendente);
router.get("/eventos/:eventoId", backendPendente);
router.get("/eventos/:eventoId/vagas", backendPendente);

// Propostas são associadas a uma vaga_servico_id no corpo da requisição.
router.post("/propostas", backendPendente);
router.get("/propostas", backendPendente);
router.get("/propostas/:propostaId", backendPendente);
router.put("/propostas/:propostaId", backendPendente);
router.patch("/propostas/:propostaId/cancelar", backendPendente);

export default router;
