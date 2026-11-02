import bcrypt from 'bcrypt';
import { usuarioEntity } from '../../domain/entities/auth/authEntities.js';
import {loginResponse} from '../../domain/dtos/auth/authDtos.js'
import * as repository from '../../repositories/auth/authRepository.js';
import { AppException } from '../../exceptions/appExceptions.js';
import jwt from 'jsonwebtoken';
import { configs } from '../../configs/configs.js';

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

export async function gerarToken(usuario_id, tipo_usuario) {
    const token = jwt.sign(
        {
            tipo_usuario: tipo_usuario
        },
        configs.jwt_secret,
        {
            subject: String(usuario_id),
            expiresIn: configs.jwt_expires_in
        }
    );

    return token;
}

export async function loginService(usuarioRequest) {
    const usuario = await repository.buscarUsuarioPorEmailRepository(usuarioRequest.email);

    if (!usuario) {
        throw new AppException('E-mail ou senha incorretos.', 401);
    }

    const senhaCorreta = await bcrypt.compare(
        usuarioRequest.senha,
        usuario.senha_hash
    );

    if (!senhaCorreta) {
        throw new AppException('E-mail ou senha incorretos.', 401);
    }

    if (usuario.status_cadastro !== 'aprovado') {
        throw new AppException('Seu cadastro ainda não foi aprovado.', 403);
    }

    const token = await gerarToken(usuario.id, usuario.tipo_usuario)

    return loginResponse(usuario, token);
}