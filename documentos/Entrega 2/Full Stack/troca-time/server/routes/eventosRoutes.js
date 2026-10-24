import express from "express";

const router = express.Router();

// O controller de eventos não está presente nesta versão do servidor.
function backendPendente(_req, res) {
    return res.status(501).json({ erro: "Endpoint de eventos aguardando integração com o banco de dados." });
}

router.get("/", backendPendente);

export default router;
