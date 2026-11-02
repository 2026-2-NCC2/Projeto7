import {cadastroUsuarioRequest, validateCadastroUsuarioRequest} from '../../domain/dtos/auth/authDtos.js';
import { cadastrarUsuarioService } from '../../services/auth/authService.js';

export async function cadastrarUsuarioController(req, res) {
    const usuario = cadastroUsuarioRequest(req.body);

    validateCadastroUsuarioRequest(usuario);

    const novoUsuario = await cadastrarUsuarioService(usuario);

    return res.status(201).json(novoUsuario);
}