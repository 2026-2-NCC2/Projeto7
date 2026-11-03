import { AppException } from '../../../exceptions/appExceptions.js';

export function cadastroUsuarioRequest(usuario) {
    return {
        tipo_usuario: usuario.tipo_usuario?.trim(),
        nome: usuario.nome?.trim(),
        descricao: usuario.descricao?.trim() || null,
        email: usuario.email?.trim().toLowerCase(),
        cpf_cnpj: usuario.cpf_cnpj?.replace(/\D/g, ''),
        telefone: usuario.telefone?.replace(/\D/g, ''),
        senha: usuario.senha,
        confirmacao_senha: usuario.confirmacao_senha
    };
}

export function validateCadastroUsuarioRequest(usuario) {

    const camposObrigatorios = [
        'tipo_usuario',
        'nome',
        'email',
        'cpf_cnpj',
        'telefone',
        'senha',
        'confirmacao_senha'
    ];

    for (const campo of camposObrigatorios) {
        if (
            usuario[campo] === undefined ||
            usuario[campo] === null ||
            String(usuario[campo]).trim() === ''
        ) {
            throw new AppException(`O campo ${campo} é obrigatório.`, 400);
        }
    }

    if (!['organizador', 'fornecedor'].includes(usuario.tipo_usuario)) {
        throw new AppException('Tipo de usuário inválido.', 400);
    }

    if (usuario.nome.length < 3) {
        throw new AppException('O nome deve possuir pelo menos 3 caracteres.', 400);
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(usuario.email)) {
        throw new AppException('E-mail inválido.', 400);
    }

    const documento = usuario.cpf_cnpj;

    if (usuario.tipo_usuario === 'organizador') {
        if (documento.length !== 11 && documento.length !== 14) {
            throw new AppException('O organizador deve informar um CPF ou CNPJ válido.', 400);
        }
    }

    if (usuario.tipo_usuario === 'fornecedor') {
        if (documento.length !== 14) {
            throw new AppException('O fornecedor deve informar um CNPJ válido.', 400);
        }
    }

    if (usuario.telefone.length !== 10 && usuario.telefone.length !== 11) {
        throw new AppException('Telefone inválido.', 400);
    }

    if (usuario.senha.length < 8) {
        throw new AppException('A senha deve possuir pelo menos 8 caracteres.', 400);
    }

    if (usuario.senha !== usuario.confirmacao_senha) {
        throw new AppException('As senhas não coincidem.', 400);
    }

    return true;
}

export function loginRequest(usuario) {
    return {
        email: usuario.email?.trim().toLowerCase(),
        senha: usuario.senha
    };
}

export function validateLoginRequest(usuario) {
    if (!usuario.email || !usuario.senha) {
        throw new AppException('E-mail e senha são obrigatórios.', 400);
    }

    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailValido.test(usuario.email)) {
        throw new AppException('E-mail inválido.', 400);
    }
}

export function loginResponse(usuario, token) {
    return {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario
    };
}