import bcrypt from 'bcrypt';
import { usuarioEntity } from '../../domain/entities/auth/authEntities.js';
import * as repository from '../../repositories/auth/authRepository.js';
import { AppException } from '../../exceptions/appExceptions.js';

const SALT_ROUNDS = 10;

async function hashPassword(senha) {
    return await bcrypt.hash(senha, SALT_ROUNDS);
}

async function verificarEmail(email) {
    const usuario = await repository.buscarUsuarioPorEmailRepository(email);

    return usuario !== null;
}

async function verificarDocumento(documento) {
    const usuario = await repository.buscarUsuarioPorDocumentoRepository(documento);

    return usuario !== null;
}

export async function cadastrarUsuarioService(usuarioRequest) {
    if (await verificarEmail(usuarioRequest.email)) {
        throw new AppException("E-mail já existente.", 400);
    }

    if (await verificarDocumento(usuarioRequest.cpf_cnpj)) {
        throw new AppException("CNPJ/CPF já existente.", 400);
    }

    const senhaHash = await hashPassword(usuarioRequest.senha);

    const novoUsuario = usuarioEntity(usuarioRequest, senhaHash);

    const novoUsuarioId = await repository.cadastrarUsuarioRepository(novoUsuario);

    return {
        id: novoUsuarioId
    };
}