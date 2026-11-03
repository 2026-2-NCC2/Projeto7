export function usuarioEntity(usuarioRequest, senhaHash) {
    const documento = usuarioRequest.cpf_cnpj.replace(/\D/g, '');

    return {
        nome: usuarioRequest.nome,
        email: usuarioRequest.email,
        telefone: usuarioRequest.telefone,

        cpf: documento.length === 11 ? documento : null,
        cnpj: documento.length === 14 ? documento : null,

        senha_hash: senhaHash,
        tipo_usuario: usuarioRequest.tipo_usuario,
        descricao: usuarioRequest.descricao || null
    };
}