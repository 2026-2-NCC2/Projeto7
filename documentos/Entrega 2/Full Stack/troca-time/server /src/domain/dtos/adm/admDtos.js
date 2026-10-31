export function resumoPlataformaResponse(resumo) {
    return {
        total_cadastros_pendentes: resumo.total_cadastros_pendentes,
        total_eventos_cotacao: resumo.total_eventos_cotacao,
        total_propostas_recebidas: resumo.total_propostas_recebidas,
    };
}

export function usuarioLista(usuario) {
    return {
        id: usuario.id,
        nome: usuario.nome,
        status_cadastro: usuario.status_cadastro,
        tipo_usuario: usuario.tipo_usuario,
        cpf: usuario.cpf,
        cnpj: usuario.cnpj,
        descricao: usuario.descricao,
        criado_em: usuario.criado_em
    };
}

export function listarUsuariosResponse(usuarios) {
    return {
        usuarios: usuarios.map(usuarioLista)
    };
}

