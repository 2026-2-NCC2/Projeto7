import * as service from "../../services/usuarios/usuarioService.js"

export async function listarUsuariosController(req, res) {
    const usuarios = await service.listarUsuariosService()
    return res.status(200).json(usuarios)
}
