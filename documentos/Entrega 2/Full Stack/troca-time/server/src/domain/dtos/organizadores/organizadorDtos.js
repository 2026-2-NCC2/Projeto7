import { AppException } from "../../../exceptions/appExceptions.js"

export function criarEventoRequest(evento, organizador_id) {
    return {
        nome: evento.nome,
        descricao: evento.descricao,
        data: evento.data,
        horario_inicio: evento.horario_inicio,
        horario_fim: evento.horario_fim,
        organizador_id: organizador_id,
        nome_local: evento.nome_local,
        cep: evento.cep,
        rua: evento.rua,
        numero: evento.numero,
        complemento: evento.complemento,
        bairro: evento.bairro,
        cidade: evento.cidade,
        estado: evento.estado
    };
}

export function validateCriarEventoRequest(criarEventoRequest) {
    const camposObrigatorios = [
        'nome',
        'data',
        'horario_inicio',
        'horario_fim',
        'organizador_id',
        'nome_local',
        'cep',
        'rua',
        'numero',
        'bairro',
        'cidade',
        'estado'
    ];

    for (const campo of camposObrigatorios) {
        if (
            criarEventoRequest[campo] === undefined ||
            criarEventoRequest[campo] === null ||
            String(criarEventoRequest[campo]).trim() === ''
        ) {
            throw new AppException(`O campo ${campo} é obrigatório.`, 400);
        }
    }
}

export function vagaServico(vagaServico) {
    return {
        id: vagaServico.id,
        evento_id: vagaServico.evento_id,
        item: vagaServico.item,
        categoria: vagaServico.categoria,
        descricao: vagaServico.descricao,
        cotacao_ate: vagaServico.cotacao_ate,
        status: vagaServico.status,
        quantidade_propostas: vagaServico.qnt_propostas
    }
}

export function listarVagasServicoResponse(vagasServico) {
    return {
        vagas_servico: vagasServico.map(vagaServico)
    }
}

export function custoManual(custo) {
    return {
        id: custo.id,
        evento_id: custo.evento_id,
        item: custo.item,
        categoria: custo.categoria,
        descricao: custo.descricao,
        valor: custo.valor
    }
}

export function listarCustosManuaisResponse(custos) {
    return {
        custos_manuais: custos.map(custoManual)
    }
}

export function criarVagaServicoRequest(vaga) {
    return {
        item: vaga.item,
        categoria: vaga.categoria,
        descricao: vaga.descricao,
        cotacao_ate: vaga.cotacao_ate
    };
}

export function validateCriarVagaServicoRequest(criarVagaServicoRequest) {
    const camposObrigatorios = [
        'item',
        'categoria',
        'cotacao_ate'
    ];

    for (const campo of camposObrigatorios) {
        if (
            criarVagaServicoRequest[campo] === undefined ||
            criarVagaServicoRequest[campo] === null ||
            String(criarVagaServicoRequest[campo]).trim() === ''
        ) {
            throw new AppException(`O campo ${campo} é obrigatório.`, 400);
        }
    }
}

export function criarCustoManualRequest(custo) {
    return {
        item: custo.item,
        categoria: custo.categoria,
        descricao: custo.descricao,
        valor: custo.valor
    };
}

export function validateCriarCustoManualRequest(criarCustoManualRequest) {
    const camposObrigatorios = [
        'item',
        'categoria',
        'descricao',
        'valor'
    ];

    for (const campo of camposObrigatorios) {
        if (
            criarCustoManualRequest[campo] === undefined ||
            criarCustoManualRequest[campo] === null ||
            String(criarCustoManualRequest[campo]).trim() === ''
        ) {
            throw new AppException(`O campo ${campo} é obrigatório.`, 400);
        }
    }

    if (Number(criarCustoManualRequest.valor) <= 0) {
        throw new AppException('O valor deve ser maior que zero.', 400);
    }
}

export function propostaEvento(proposta) {
    return {
        id: proposta.id,
        vaga_servico_id: proposta.vaga_servico_id,
        item: proposta.item,
        categoria: proposta.categoria,
        cotacao_ate: proposta.cotacao_ate,
        status_vaga: proposta.status_vaga,
        fornecedor_id: proposta.fornecedor_id,
        nome_fornecedor: proposta.nome_fornecedor,
        valor: proposta.valor,
        descricao: proposta.descricao,
        observacoes: proposta.observacoes,
        validade: proposta.validade,
        status: proposta.status
    }
}

export function listarPropostasEventoResponse(propostas) {
    return {
        propostas: propostas.map(propostaEvento)
    }
}

export function custoOrcamento(custo) {
    return {
        item: custo.item,
        origem: custo.origem,
        valor: custo.valor
    }
}

export function listarCustosOrcamentoResponse(custos) {
    return {
        custos_orcamento: custos.map(custoOrcamento)
    }
}

export function calcularTicketRequest(ticket_request, evento_id) {
    return {
        evento_id: evento_id,
        publico_min: ticket_request.publico_min,
        publico_max: ticket_request.publico_max,
        publico_esperado: ticket_request.publico_esperado,
        margem_lucro: ticket_request.margem_lucro
    }
}

export function validateCalcularTicketRequest(calcularTicketRequest) {
    const camposObrigatorios = [
        'publico_min',
        'publico_max',
        'publico_esperado',
        'margem_lucro'
    ];

    for (const campo of camposObrigatorios) {
        if (
            calcularTicketRequest[campo] === undefined ||
            calcularTicketRequest[campo] === null ||
            String(calcularTicketRequest[campo]).trim() === ''
        ) {
            throw new AppException(`O campo ${campo} é obrigatório.`, 400);
        }
    }

    if (Number(calcularTicketRequest.publico_min) <= 0) {
        throw new AppException('O público mínimo deve ser maior que zero.', 400);
    }

    if (Number(calcularTicketRequest.publico_max) <= Number(calcularTicketRequest.publico_min)) {
        throw new AppException('O público máximo deve ser maior que o público mínimo.', 400);
    }

    if (Number(calcularTicketRequest.margem_lucro) < 0 || Number(calcularTicketRequest.margem_lucro) >= 100) {
        throw new AppException('A margem de lucro deve ser entre 0 e 100.', 400);
    }
}

export function calculo_ticket_publico(quantidade, ticketBruto, taxa, ticketLiquido) {
    return {
        ticket_bruto: ticketBruto,
        taxa: taxa,
        ticket_liquido: ticketLiquido,
        quantidade: quantidade
    }
}

export function calculoTicketResponse(tickets_publicos, margem_lucro, custo_total) {
    return {
        custo_total: custo_total,
        ticket_publico_min: tickets_publicos.ticket_publico_min,
        ticket_publico_esperado: tickets_publicos.ticket_publico_esperado,
        ticket_publico_max: tickets_publicos.ticket_publico_max,
        margem_lucro: margem_lucro
    }
}