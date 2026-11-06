export function eventoEntity(criarEventoRequest) {
    return {
        nome: criarEventoRequest.nome,
        descricao: criarEventoRequest.descricao || null,

        inicio: `${criarEventoRequest.data_inicio} ${criarEventoRequest.horario_inicio}`,
        fim: `${criarEventoRequest.data_fim} ${criarEventoRequest.horario_fim}`,

        organizador_id: criarEventoRequest.organizador_id,
        publico_min: criarEventoRequest.publico_min,
        publico_max: criarEventoRequest.publico_max,
        publico_esperado: criarEventoRequest.publico_esperado,
        margem_lucro: criarEventoRequest.margem_lucro,
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

export function custoEntity(evento_id, criarCustoRequest) {
    return {
        evento_id: evento_id,
        descricao: criarCustoRequest.descricao,
        origem: criarCustoRequest.tipo,
        valor: criarCustoRequest.valor
    };
}
