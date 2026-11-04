import * as service from "../../services/fornecedor/fornecedorService.js"
import { AppException } from "../../exceptions/appExceptions.js"

export async function buscarDetalhesFornecedorController(req, res) {
    const usuario_id = Number(req.params.id)

    if (!usuario_id) {
        throw new AppException("ID do fornecedor inválido", 400)
    }

    const fornecedor = await service.buscarDetalhesFornecedorService(usuario_id)
    return res.status(200).json(fornecedor)
}