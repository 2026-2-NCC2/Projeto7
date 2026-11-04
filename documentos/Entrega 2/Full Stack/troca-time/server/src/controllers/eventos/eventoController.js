import * as service from "../../services/eventos/eventoService.js"
import {AppException} from "../../exceptions/appExceptions.js"

export async function listarEventosController(req, res) {
    const eventos = await service.listarEventosService()
    return res.status(200).json(eventos)
}

export async function buscarDetalheEventoController(req, res){
    const evento_id = req.params.id;
    if (!evento_id){
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const detalheEvento = await service.buscarDetalheEventosService(evento_id)

    return res.status(200).json(detalheEvento)
}