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