import * as service from "../../services/adm/admService.js"

export async function buscarResumoPlataformaController(req, res) {
    const resumo = await service.buscarResumoPlataformaService();
    return res.status(200).json(resumo);
}

export async function listarUsuariosController(req, res) {
    const usuarios = await service.listarUsuariosService()
    return res.status(200).json(usuarios)
}