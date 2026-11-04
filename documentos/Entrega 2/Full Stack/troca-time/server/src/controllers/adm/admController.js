import * as service from "../../services/adm/admService.js"
import {AppException} from "../../exceptions/appExceptions.js"

export async function buscarResumoPlataformaController(req, res) {
    const resumo = await service.buscarResumoPlataformaService();
    return res.status(200).json(resumo);
}

export async function listarUsuariosController(req, res) {
    const usuarios = await service.listarUsuariosService()
    return res.status(200).json(usuarios)
}

export async function atualizarStatusCadastroController(req, res) {

    const usuario_id = req.params.id
    if (!usuario_id || usuario_id == ':id') {
        throw new AppException("O id do usuário é obrigatório", 400)
    }

    const status_cadastro = req.query.status_cadastro
    if (!status_cadastro) {
        throw new AppException("O status do cadastro é obrigatório", 400)
    } 

    await service.atualizarStatusCadastroService(usuario_id, status_cadastro)

    res.sendStatus(204)
}