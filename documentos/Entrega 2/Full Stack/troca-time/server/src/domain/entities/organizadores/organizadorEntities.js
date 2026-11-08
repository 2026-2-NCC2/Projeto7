export function eventoEntity(criarEventoRequest) {
    return {
        nome: criarEventoRequest.nome,
        descricao: criarEventoRequest.descricao || null,

        data: criarEventoRequest.data,
        horario_inicio: criarEventoRequest.horario_inicio,
        horario_fim: criarEventoRequest.horario_fim,

        organizador_id: criarEventoRequest.organizador_id,
        nome_local: criarEventoRequest.nome_local,
        cep: criarEventoRequest.cep,
        rua: criarEventoRequest.rua,
        numero: criarEventoRequest.numero,
        complemento: criarEventoRequest.complemento || null,
        bairro: criarEventoRequest.bairro,
        cidade: criarEventoRequest.cidade,
        estado: criarEventoRequest.estado
    };
}

export function vagaServicoEntity(evento_id, criarVagaServicoRequest) {
    return {
        evento_id: evento_id,
        item: criarVagaServicoRequest.item,
        categoria: criarVagaServicoRequest.categoria,
        descricao: criarVagaServicoRequest.descricao || null,
        cotacao_ate: criarVagaServicoRequest.cotacao_ate
    };
}

export function custoManualEntity(evento_id, criarCustoManualRequest) {
    return {
        evento_id: evento_id,
        item: criarCustoManualRequest.item,
        categoria: criarCustoManualRequest.categoria,
        descricao: criarCustoManualRequest.descricao,
        valor: criarCustoManualRequest.valor
    };
}
