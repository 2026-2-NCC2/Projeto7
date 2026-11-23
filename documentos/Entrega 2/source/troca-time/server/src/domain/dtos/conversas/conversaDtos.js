import { AppException } from '../../../exceptions/appExceptions.js'

export const TAMANHO_MAXIMO_MENSAGEM = 1000

// Para o fornecedor, "selecionada" aparece como pendente (regra já usada no detalhe do fornecedor).
function statusParaUsuario(status, tipo_usuario) {
    return tipo_usuario === 'fornecedor' && status === 'selecionada' ? 'pendente' : status
}

export function conversaLista(conversa, tipo_usuario) {
    const souOrganizador = tipo_usuario === 'organizador'

    return {
        proposta_id: conversa.proposta_id,
        status: statusParaUsuario(conversa.status, tipo_usuario),
        origem: conversa.origem,
        valor: conversa.valor,
        descricao: conversa.descricao,
        observacoes: conversa.observacoes,
        validade: conversa.validade,
        vaga_servico_id: conversa.vaga_servico_id,
        item: conversa.item,
        categoria: conversa.categoria,
        status_vaga: conversa.status_vaga,
        evento_id: conversa.evento_id,
        nome_evento: conversa.nome_evento,
        data_evento: conversa.data_evento,
        status_evento: conversa.status_evento,
        participante: souOrganizador
            ? { id: conversa.fornecedor_id, nome: conversa.nome_fornecedor, tipo: 'fornecedor' }
            : { id: conversa.organizador_id, nome: conversa.nome_organizador, tipo: 'organizador' },
        ultima_mensagem: conversa.ultima_mensagem,
        ultima_mensagem_em: conversa.ultima_mensagem_em,
        aberta: ['pendente', 'selecionada'].includes(conversa.status)
    }
}

export function listarConversasResponse(conversas, tipo_usuario) {
    return {
        conversas: conversas.map((c) => conversaLista(c, tipo_usuario))
    }
}

export function mensagemResponse(mensagem, usuario_id) {
    return {
        id: mensagem.id,
        proposta_id: mensagem.proposta_id,
        remetente_id: mensagem.remetente_id,
        tipo: mensagem.tipo,
        conteudo: mensagem.conteudo,
        criado_em: mensagem.criado_em,
        minha: mensagem.remetente_id === usuario_id
    }
}

export function validarPropostaId(valor) {
    const proposta_id = Number(valor)
    if (!Number.isInteger(proposta_id) || proposta_id <= 0) {
        throw new AppException('ID da proposta inválido', 400)
    }
    return proposta_id
}

export function validarDepoisDe(valor) {
    if (valor === undefined || valor === '') return 0
    const depois_de = Number(valor)
    if (!Number.isInteger(depois_de) || depois_de < 0) {
        throw new AppException('Parâmetro depois_de inválido', 400)
    }
    return depois_de
}

export function enviarMensagemRequest(body) {
    const conteudo = typeof body?.conteudo === 'string' ? body.conteudo.trim() : ''

    if (!conteudo) {
        throw new AppException('A mensagem não pode ser vazia', 400)
    }

    if (conteudo.length > TAMANHO_MAXIMO_MENSAGEM) {
        throw new AppException(`A mensagem deve ter no máximo ${TAMANHO_MAXIMO_MENSAGEM} caracteres`, 400)
    }

    return { conteudo }
}
