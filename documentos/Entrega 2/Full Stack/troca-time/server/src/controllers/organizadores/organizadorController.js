import * as service from "../../services/organizadores/organizadorService.js"
import * as eventoService from "../../services/eventos/eventoService.js"
import { AppException } from "../../exceptions/appExceptions.js"
import {
    criarEventoRequest,
    validateCriarEventoRequest,
    criarVagaServicoRequest,
    validateCriarVagaServicoRequest,
    criarCustoManualRequest,
    validateCriarCustoManualRequest,
    calcularTicketRequest,
    validateCalcularTicketRequest
} from "../../domain/dtos/organizadores/organizadorDtos.js"

export async function criarEventoController(req, res) {
    const eventoRequest = criarEventoRequest(req.body, req.usuario.id)

    validateCriarEventoRequest(eventoRequest)

    const eventoIdResponse = await service.criarEventoService(eventoRequest)
    
    res.status(200).json(eventoIdResponse)
}

export async function editarEventoController(req, res) {
    const evento_id = req.params.id
    if (!evento_id) {
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const eventoRequest = criarEventoRequest(req.body, req.usuario.id)

    validateCriarEventoRequest(eventoRequest)

    await service.editarEventoService(evento_id, eventoRequest)

    res.sendStatus(204)
}

export async function atualizarStatusEventoController(req, res) {
    const evento_id = req.params.id
    const novo_status = req.query.novo_status

    const status = ["rascunho", "em_cotacao", "publicado", "encerrado"]
    if (!status.includes(novo_status)) {
        throw new AppException("Status inválido", 400)
    }

    if (novo_status === 'em_cotacao') {
        await service.disponibilizarParaCotacaoService(evento_id)
    }

    if (novo_status === 'publicado') {
        await service.publicarEventoService(evento_id)
    }

    if (novo_status === 'encerrado') {
        await service.encerrarEventoService(evento_id)
    }

    res.sendStatus(204)
}

export async function listarVagasServicoController(req, res) {
    const vagasServico = await service.listarVagasServicoService()

    res.status(200).json(vagasServico)
}

export async function listarCustosManuaisController(req, res) {
    const evento_id = req.params.id
    if (!evento_id) {
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const custos = await service.listarCustosManuaisService(evento_id)

    res.status(200).json(custos)
}

export async function criarVagaServicoController(req, res) {
    const evento_id = req.params.id
    if (!evento_id) {
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const vagaRequest = criarVagaServicoRequest(req.body)

    validateCriarVagaServicoRequest(vagaRequest)

    const vagaServicoIdResponse = await service.criarVagaServicoService(evento_id, vagaRequest)

    res.status(200).json(vagaServicoIdResponse)
}

export async function criarCustoManualController(req, res) {
    const evento_id = req.params.id
    if (!evento_id) {
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const custoRequest = criarCustoManualRequest(req.body)

    validateCriarCustoManualRequest(custoRequest)

    const custoManualIdResponse = await service.criarCustoManualService(evento_id, custoRequest)

    res.status(200).json(custoManualIdResponse)
}

export async function deletarVagaServicoController(req, res) {
    const vaga_servico_id = req.params.id
    if (!vaga_servico_id) {
        throw new AppException("O ID da vaga de serviço é obrigatório", 400)
    }

    await service.deletarVagaServicoService(vaga_servico_id)

    res.sendStatus(204)
}

export async function deletarCustoManualController(req, res) {
    const custo_manual_id = req.params.id
    if (!custo_manual_id) {
        throw new AppException("O ID do custo manual é obrigatório", 400)
    }

    await service.deletarCustoManualService(custo_manual_id)

    res.sendStatus(204)
}

export async function listarPropostasEventoController(req, res) {
    const evento_id = req.params.id
    if (!evento_id) {
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const propostas = await service.listarPropostasEventoService(evento_id)

    res.status(200).json(propostas)
}

export async function atualizarStatusPropostaController(req, res) {
    const proposta_id = req.params.id
    const novo_status = req.query.novo_status

    const status = ["selecionada", "recusada", "aceita"]
    if (!status.includes(novo_status)) {
        throw new AppException("Status inválido", 400)
    }

    if (novo_status === 'selecionada') {
        await service.selecionarPropostaService(proposta_id)
    }

    if (novo_status === 'recusada') {
        await service.recusarPropostaService(proposta_id)
    }

    if (novo_status === 'aceita') {
        await service.aceitarPropostaService(proposta_id)
    }

    res.sendStatus(204)
}

export async function listarCustosOrcamentoController(req, res) {
    const evento_id = req.params.id
    if (!evento_id) {
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const custos = await service.listarCustosOrcamentoService(evento_id)

    res.status(200).json(custos)
}

export async function calcularTicketController(req, res) {
    const evento_id = req.params.id
    if (!evento_id || evento_id === ':id') {
        throw new AppException('O ID do evento é obrigatório', 400)
    }

    const ticket_request = calcularTicketRequest(req.query, evento_id)

    validateCalcularTicketRequest(ticket_request)

    const calculoTicket = await service.calcularTicketService(ticket_request)

    res.status(200).json(calculoTicket)
}

export async function salvarOrcamentoController(req, res) {
    const evento_id = req.params.id
    if (!evento_id) {
        throw new AppException("O ID do evento é obrigatório", 400)
    }

    const orcamentoRequest = calcularTicketRequest(req.body, evento_id)

    validateCalcularTicketRequest(orcamentoRequest)

    await service.salvarOrcamentoService(orcamentoRequest)

    res.sendStatus(204)
}
