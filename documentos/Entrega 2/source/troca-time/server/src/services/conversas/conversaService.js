import * as repository from '../../repositories/conversas/conversaRepository.js'
import * as dto from '../../domain/dtos/conversas/conversaDtos.js'
import { AppException } from '../../exceptions/appExceptions.js'

const STATUS_CONVERSA_ABERTA = ['pendente', 'selecionada']

async function buscarConversaDoUsuario(proposta_id, usuario_id) {
    const proposta = await repository.buscarParticipantesRepository(proposta_id)

    if (!proposta) {
        throw new AppException('Proposta não encontrada', 404)
    }

    if (proposta.fornecedor_id !== usuario_id && proposta.organizador_id !== usuario_id) {
        throw new AppException('Você não participa desta conversa', 403)
    }

    return proposta
}

export async function listarConversasService(usuario) {
    const conversas = await repository.listarConversasRepository(usuario.id, usuario.tipo_usuario)

    return dto.listarConversasResponse(conversas, usuario.tipo_usuario)
}

export async function listarMensagensService(proposta_id, depois_de, usuario) {
    await buscarConversaDoUsuario(proposta_id, usuario.id)

    const mensagens = await repository.listarMensagensRepository(proposta_id, depois_de)

    return {
        mensagens: mensagens.map((m) => dto.mensagemResponse(m, usuario.id))
    }
}

export async function enviarMensagemService(proposta_id, conteudo, usuario) {
    const proposta = await buscarConversaDoUsuario(proposta_id, usuario.id)

    if (!STATUS_CONVERSA_ABERTA.includes(proposta.status)) {
        throw new AppException('Esta conversa está encerrada', 409)
    }

    const mensagem = await repository.criarMensagemRepository(proposta_id, usuario.id, conteudo)

    return dto.mensagemResponse(mensagem, usuario.id)
}
