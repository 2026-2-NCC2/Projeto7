export function criarEventoRequest(evento) {
    return {
        nome: evento.nome,
        descricao: evento.descricao,
        horario_fim: evento.horario_fim,
        horario_inicio: evento.horario_inicio,
        data_inicio: evento.data_inicio,
        data_fim: evento.data_fim,
        organizador_id: evento.organizador_id,
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
        'horario_fim',
        'horario_inicio',
        'data_inicio',
        'data_fim',
        'organizador_id',
        'publico_min',
        'publico_max',
        'publico_esperado',
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
            evento[campo] === undefined ||
            evento[campo] === null ||
            String(evento[campo]).trim() === ''
        ) {
            throw new AppException(`O campo ${campo} é obrigatório.`, 400);
        }
    }

    return true;
}