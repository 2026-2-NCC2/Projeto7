import * as service from '../../services/conversas/conversaService.js'
import { enviarMensagemRequest, validarDepoisDe, validarPropostaId } from '../../domain/dtos/conversas/conversaDtos.js'

export async function listarConversasController(req, res) {
    const conversas = await service.listarConversasService(req.usuario)

    res.status(200).json(conversas)
}

export async function listarMensagensController(req, res) {
    const proposta_id = validarPropostaId(req.params.propostaId)
    const depois_de = validarDepoisDe(req.query.depois_de)

    const mensagens = await service.listarMensagensService(proposta_id, depois_de, req.usuario)

    res.status(200).json(mensagens)
}

export async function enviarMensagemController(req, res) {
    const proposta_id = validarPropostaId(req.params.propostaId)
    const { conteudo } = enviarMensagemRequest(req.body)

    const mensagem = await service.enviarMensagemService(proposta_id, conteudo, req.usuario)

    res.status(201).json(mensagem)
}
