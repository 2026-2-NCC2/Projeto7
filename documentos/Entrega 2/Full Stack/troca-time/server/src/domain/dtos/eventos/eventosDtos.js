export function eventoLista(evento) {
    return {
        id: evento.id,
        nome: evento.nome,
        status: evento.status,
        descricao: evento.descricao,
        data: evento.data,
        horario_inicio: evento.horario_inicio,
        horario_fim: evento.horario_fim,
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

function formatarEndereco (evento){
    return evento.nome_local + ' - ' + evento.rua + ', ' + evento.numero + ' - ' + evento.bairro + ' - ' + evento.cep
}

export function vagaServicoDetalhe(vaga_servico){
    return {
        fornecedor_id: vaga_servico.fornecedor_id,
        fornecedor_nome: vaga_servico.nome_fornecedor,
        vaga_categoria: vaga_servico.categoria,
        proposta_valor: vaga_servico.valor
        
    };
}

export function detalheEvento(evento, vagas_servico){
    return{
        id: evento.id,
        nome: evento.nome,
        status: evento.status,
        descricao: evento.descricao,
        data: evento.data,
        horario_inicio: evento.horario_inicio,
        horario_fim: evento.horario_fim,
        endereco: formatarEndereco(evento),
        status: evento.status,
        publico_min: evento.publico_min,
        publico_max: evento.publico_max,
        ticket_min: evento.ticket_estimado_min,
        ticket_max: evento.ticket_estimado_max,
        custo_total: evento.custo_total,
        margem_lucro: evento.margem_lucro,
        organizador_nome: evento.nome_organizador,
        criado_em: evento.criado_em,
        atualizado_em: evento.atualizado_em,
        organizador_id: evento.organizador_id,
        vagas_servico: vagas_servico.map(vagaServicoDetalhe)
    }
}