import * as service from "../../services/adm/admService.js"

export async function buscarResumoPlataformaController(req, res) {
    const resumo = await service.buscarResumoPlataformaService();
    return res.status(200).json(resumo);
}