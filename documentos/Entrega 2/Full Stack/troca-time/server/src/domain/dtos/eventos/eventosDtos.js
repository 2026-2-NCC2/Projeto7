export function eventoLista(evento) {
    return {
        id: evento.id,
        nome: evento.nome,
        status: evento.status,
        descricao: evento.descricao,
        inicio: evento.inicio,
        fim: evento.fim,
        nome_local: evento.nome_local,
        quantidade_propostas: evento.quantidade_propostas,
        ticket_estimado_min: evento.ticket_estimado_min,
        ticket_estimado_max: evento.ticket_estimado_max,
        nome_organizador: evento.nome_organizador,
        organizador_id: evento.organizador_id
    };
}

export function listarEventosResponse(eventos) {
    return {
        eventos: eventos.map(eventoLista)
    };
}