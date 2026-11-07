export function eventoEntity(criarEventoRequest) {
    return {
        nome: criarEventoRequest.nome,
        descricao: criarEventoRequest.descricao || null,

        data: criarEventoRequest.data,
        horario_inicio: criarEventoRequest.horario_inicio,
        horario_fim: criarEventoRequest.horario_fim,

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
