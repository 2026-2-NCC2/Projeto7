import * as service from "../../services/organizadores/organizadorService.js"
import { AppException } from "../../exceptions/appExceptions.js"
import { criarEventoRequest, validateCriarEventoRequest } from "../../domain/dtos/organizadores/organizadorDtos.js"

export async function criarEventoController(req, res) {
    const criarEventoRequest = criarEventoRequest(req.body)

    validateCriarEventoRequest(criarEventoRequest)

    const eventoIdResponse = await service.criarEventoService(criarEventoRequest)
    
    res.status(200).json(eventoIdResponse)
}