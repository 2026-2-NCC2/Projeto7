import * as service from "../../services/organizadores/organizadorService.js"
import { AppException } from "../../exceptions/appExceptions.js"
import { criarEventoRequest, validateCriarEventoRequest } from "../../domain/dtos/organizadores/organizadorDtos.js"

export async function criarEventoController(req, res) {
    const eventoRequest = criarEventoRequest(req.body)

    validateCriarEventoRequest(eventoRequest)

    const eventoIdResponse = await service.criarEventoService(eventoRequest)
    
    res.status(200).json(eventoIdResponse)
}