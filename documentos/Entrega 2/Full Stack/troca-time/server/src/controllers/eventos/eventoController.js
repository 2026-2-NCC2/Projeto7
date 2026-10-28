import * as service from "../../services/eventos/eventoService.js"

export async function listarEventosController(req, res) {
    const eventos = await service.listarEventosService()
    return res.status(200).json(eventos)
}