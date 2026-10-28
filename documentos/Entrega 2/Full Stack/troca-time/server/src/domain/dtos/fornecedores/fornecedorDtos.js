export function propostaFornecedorLista(proposta) {
    return {
        id: proposta.id,
        nome_vaga: proposta.nome_vaga,
        categoria: proposta.categoria,
        evento_id: proposta.evento_id,
        nome_evento: proposta.nome_evento,
        nome_evento: proposta.nome_evento,
        valor: proposta.valor,
        status: proposta.status,
        descricao: proposta.descricao
    };
}

export function buscarDetalhesFornecedorResponse(dadosFornecedor, propostasFornecedor) {
    return {
        id: dadosFornecedor.id,
        nome: dadosFornecedor.nome,
        status_cadastro: dadosFornecedor.status_cadastro,
        tipo_usuario: dadosFornecedor.tipo_usuario,
        categoria: dadosFornecedor.categoria,
        cnpj: dadosFornecedor.cnpj,
        telefone: dadosFornecedor.telefone,
        email: dadosFornecedor.email,
        descricao: dadosFornecedor.descricao,
        criado_em: dadosFornecedor.criado_em,
        propostas: propostasFornecedor.map(propostaFornecedorLista)
    };
}
