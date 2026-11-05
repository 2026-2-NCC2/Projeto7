export function usuarioLista(usuario) {
    return {
        id: usuario.id,
        nome: usuario.nome,
        status_cadastro: usuario.status_cadastro,
        tipo_usuario: usuario.tipo_usuario,
        cpf_cnpj: usuario.cpf || usuario.cnpj,
        descricao: usuario.descricao,
        criado_em: usuario.criado_em
    };
}

export function listarUsuariosResponse(usuarios) {
    return {
        usuarios: usuarios.map(usuarioLista)
    };
}
