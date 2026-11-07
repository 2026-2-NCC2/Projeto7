import * as service from "../../services/organizadores/organizadorService.js"
import { AppException } from "../../exceptions/appExceptions.js"
import {
    criarEventoRequest,
    validateCriarEventoRequest,
    criarVagaServicoRequest,
    validateCriarVagaServicoRequest,
    criarCustoRequest,
    validateCriarCustoRequest
} from "../../domain/dtos/organizadores/organizadorDtos.js"

export async function criarEventoController(req, res) {
    const eventoRequest = criarEventoRequest(req.body, req.usuario.id)

    validateCriarEventoRequest(eventoRequest)

    const eventoIdResponse = await service.criarEventoService(eventoRequest)
    
    res.status(200).json(eventoIdResponse)
}

export async function listarCustosController(req, res) {
    const evento_id = req.params.id
    if (!evento_id) {
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const custos = await service.listarCustosService(evento_id)

    res.status(200).json(custos)
}

export async function criarVagaServicoController(req, res) {
    const evento_id = req.params.id
    if (!evento_id) {
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const vagaRequest = criarVagaServicoRequest(req.body)

    validateCriarVagaServicoRequest(vagaRequest)

    const vagaIdResponse = await service.criarVagaServicoService(evento_id, vagaRequest)

    res.status(200).json(vagaIdResponse)
}

export async function criarCustoController(req, res) {
    const evento_id = req.params.id
    if (!evento_id) {
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const custoRequest = criarCustoRequest(req.body)

    validateCriarCustoRequest(custoRequest)

    const custoIdResponse = await service.criarCustoService(evento_id, custoRequest)

    res.status(200).json(custoIdResponse)
}
