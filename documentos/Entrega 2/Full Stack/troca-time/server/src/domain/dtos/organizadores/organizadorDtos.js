import { AppException } from "../../../exceptions/appExceptions.js"

export function criarEventoRequest(evento, organizador_id) {
    return {
        nome: evento.nome,
        descricao: evento.descricao,
        data: evento.data,
        horario_inicio: evento.horario_inicio,
        horario_fim: evento.horario_fim,
        organizador_id: organizador_id,
        publico_min: evento.publico_min,
        publico_max: evento.publico_max,
        publico_esperado: evento.publico_esperado,
        margem_lucro: evento.margem_lucro,
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
        'publico_min',
        'publico_max',
        'margem_lucro',
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

    return true;
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

    return true;
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

    return true;
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
