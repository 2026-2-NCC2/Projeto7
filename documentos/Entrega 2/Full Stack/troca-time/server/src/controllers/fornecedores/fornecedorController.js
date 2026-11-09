import * as service from "../../services/fornecedor/fornecedorService.js"
import { AppException } from "../../exceptions/appExceptions.js"
import { criarPropostaRequest, validarCriarPropostaRequest } from "../../domain/dtos/fornecedores/fornecedorDtos.js"

export async function buscarDetalhesFornecedorController(req, res) {
    const usuario_id = Number(req.params.id)

    if (!usuario_id) {
        throw new AppException("ID do fornecedor inválido", 400)
    }

    const fornecedor = await service.buscarDetalhesFornecedorService(usuario_id, req.usuario.tipo_usuario)
    return res.status(200).json(fornecedor)
}

export async function criarPropostaController(req,res){
    const propostaRequest = criarPropostaRequest(req.body, req.usuario.id)

    validarCriarPropostaRequest(propostaRequest)

    const propostaIdResponse = await service.criarPropostaService(propostaRequest)

    res.status(200).json(propostaIdResponse)
}

export async function listarOportunidadesController(req, res) {
    const oportunidades = await service.listarOportunidadesService(req.usuario.id)
    return res.status(200).json(oportunidades)
}
