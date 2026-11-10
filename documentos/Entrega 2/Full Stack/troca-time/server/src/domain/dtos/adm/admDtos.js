export function resumoPlataformaResponse(resumo) {
    return {
        total_cadastros_pendentes: resumo.total_cadastros_pendentes,
        total_eventos_cotacao: resumo.total_eventos_cotacao,
        total_propostas_recebidas: resumo.total_propostas_recebidas,
    };
}

export function eventoOrganizadorLista(evento) {
    return {
        id: evento.id,
        nome: evento.nome,
        data: evento.data,
        horario_inicio: evento.horario_inicio,
        nome_local: evento.nome_local,
        cidade: evento.cidade,
        estado: evento.estado,
    };
}

export function detalheOrganizadorResponse(organizador, eventos) {
    return {
        id: organizador.id,
        nome: organizador.nome,
        status_cadastro: organizador.status_cadastro,
        cpf: organizador.cpf,
        cnpj: organizador.cnpj,
        telefone: organizador.telefone,
        email: organizador.email,
        descricao: organizador.descricao,
        criado_em: organizador.criado_em,
        eventos: eventos.map(eventoOrganizadorLista),
    };
}

