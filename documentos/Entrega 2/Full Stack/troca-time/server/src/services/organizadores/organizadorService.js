import * as repository from '../../repositories/organizadores/organizadorRepository.js'
import * as eventoRepository from '../../repositories/eventos/eventoRepository.js'
import * as dto from '../../domain/dtos/organizadores/organizadorDtos.js'
import { eventoEntity, vagaServicoEntity, custoManualEntity } from '../../domain/entities/organizadores/organizadorEntities.js'
import { AppException } from '../../exceptions/appExceptions.js'

export async function criarEventoService(criarEventoRequest) {
    const novoEvento = eventoEntity(criarEventoRequest)

    const eventoId = await repository.criarEventoRepository(novoEvento)

    return {
        "evento_id": eventoId
    }
}

export async function disponibilizarParaCotacaoService(evento_id) {
    const evento = await eventoRepository.buscarDetalheEventoRepository(evento_id)

    if (!evento) {
        throw new AppException("Evento não encontrado.", 404)
    }

    if (evento.status !== 'rascunho') {
        throw new AppException("Apenas eventos em rascunho podem ser disponibilizados para cotação.", 400)
    }

    const camposObrigatorios = [
        'nome',
        'descricao',
        'data',
        'horario_inicio',
        'horario_fim',
        'publico_min',
        'publico_max',
        'margem_lucro',
        'nome_local',
        'cep',
        'rua',
        'numero',
        'bairro',
        'cidade',
        'estado'
    ]

    for (const campo of camposObrigatorios) {
        if (
            evento[campo] === undefined ||
            evento[campo] === null ||
            String(evento[campo]).trim() === ''
        ) {
            throw new AppException(`O campo ${campo} do evento precisa estar preenchido.`, 400)
        }
    }

    await repository.atualizarStatusEventoRepository('em_cotacao', evento_id)
}

export async function listarVagasServicoService() {
    const vagasServico = await repository.listarVagasServicoRepository()

    const vagasServicoResponse = dto.listarVagasServicoResponse(vagasServico)
    return vagasServicoResponse
}

export async function listarCustosManuaisService(evento_id) {
    const custos = await repository.listarCustosManuaisRepository(evento_id)

    const custosResponse = dto.listarCustosManuaisResponse(custos)
    return custosResponse
}

export async function criarVagaServicoService(evento_id, criarVagaServicoRequest) {
    const novaVaga = vagaServicoEntity(evento_id, criarVagaServicoRequest)

    const vagaServicoId = await repository.criarVagaServicoRepository(novaVaga)

    return {
        "vaga_servico_id": vagaServicoId
    }
}

export async function criarCustoManualService(evento_id, criarCustoManualRequest) {
    const novoCusto = custoManualEntity(evento_id, criarCustoManualRequest)

    const custoManualId = await repository.criarCustoManualRepository(novoCusto)

    return {
        "custo_manual_id": custoManualId
    }
}

export async function deletarVagaServicoService(vaga_servico_id) {
    const totalPropostas = await repository.contarPropostasVagaServicoRepository(vaga_servico_id)

    if (totalPropostas > 0) {
        throw new AppException("Não é possível deletar uma vaga de serviço que já recebeu propostas.", 400)
    }

    await repository.deletarVagaServicoRepository(vaga_servico_id)
}

export async function deletarCustoManualService(custo_manual_id) {
    await repository.deletarCustoManualRepository(custo_manual_id)
}

export async function publicarEventoService(evento_id) {
    const evento = await eventoRepository.buscarDetalheEventoRepository(evento_id)

    if (evento?.status !== 'em_cotacao') {
        throw new AppException("Apenas eventos em cotação podem ser publicados.", 400)
    }

    const vagasNaoPreenchidas = await repository.contarVagasNaoPreenchidasRepository(evento_id)

    if (vagasNaoPreenchidas > 0) {
        throw new AppException("Todas as vagas de serviço precisam estar preenchidas para publicar o evento.", 400)
    }

    await repository.atualizarStatusEventoRepository('publicado', evento_id)
}

export async function listarPropostasEventoService(evento_id) {
    const propostas = await repository.listarPropostasEventoRepository(evento_id)

    const propostasResponse = dto.listarPropostasEventoResponse(propostas)
    return propostasResponse
}

export async function selecionarPropostaService(proposta_id) {
    const proposta = await repository.buscarPropostaRepository(proposta_id)

    await repository.selecionarPropostaRepository(proposta_id, proposta.vaga_servico_id)
}

export async function recusarPropostaService(proposta_id) {
    await repository.recusarPropostaRepository(proposta_id)
}

export async function aceitarPropostaService(proposta_id) {
    const proposta = await repository.buscarPropostaRepository(proposta_id)

    await repository.aceitarPropostaRepository(proposta_id, proposta.vaga_servico_id)
}

export async function listarCustosOrcamentoService(evento_id) {
    const custos = await repository.listarCustosOrcamentoRepository(evento_id)

    const custosResponse = dto.listarCustosOrcamentoResponse(custos)
    return custosResponse
}
