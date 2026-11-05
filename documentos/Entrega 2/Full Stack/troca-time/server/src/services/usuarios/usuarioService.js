import * as repository from '../../repositories/usuarios/usuarioRepository.js';
import * as dto from '../../domain/dtos/usuarios/usuarioDtos.js';

export async function listarUsuariosService() {
    const usuarios = await repository.listarUsuariosRepository()

    const usuarioResponse = dto.listarUsuariosResponse(usuarios)
    return usuarioResponse
}
