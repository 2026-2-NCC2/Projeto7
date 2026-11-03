import {
    cadastroUsuarioRequest,
    validateCadastroUsuarioRequest,
    loginRequest,
    validateLoginRequest
} from '../../domain/dtos/auth/authDtos.js';

import {
    cadastrarUsuarioService,
    loginService
} from '../../services/auth/authService.js';

export async function cadastrarUsuarioController(req, res) {
    const usuario = cadastroUsuarioRequest(req.body);

    validateCadastroUsuarioRequest(usuario);

    const novoUsuario = await cadastrarUsuarioService(usuario);

    return res.status(201).json(novoUsuario);
}

export async function loginController(req, res) {
    const usuario = loginRequest(req.body);

    validateLoginRequest(usuario);

    const [usuarioLogin, token] = await loginService(usuario);

    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/'
    });

    return res.status(200).json(usuarioLogin);
}