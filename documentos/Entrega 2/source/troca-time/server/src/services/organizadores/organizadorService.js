import * as repository from '../../repositories/organizadores/organizadorRepository.js'
import * as eventoRepository from '../../repositories/eventos/eventoRepository.js'
import * as propostaRepository from '../../repositories/propostas/propostaRepository.js'
import * as fornecedorRepository from '../../repositories/fornecedores/fornecedorRepository.js'
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

export async function editarEventoService(evento_id, editarEventoRequest) {
    const evento = await eventoRepository.buscarDetalheEventoRepository(evento_id)

    if (evento?.status !== 'rascunho') {
        throw new AppException("Apenas eventos em rascunho podem ser editados.", 400)
    }

    const eventoEditado = eventoEntity(editarEventoRequest)

    await repository.editarEventoRepository(evento_id, eventoEditado)
}

export async function disponibilizarParaCotacaoService(evento_id) {
    const evento = await eventoRepository.buscarDetalheEventoRepository(evento_id)

    if (evento.status !== 'rascunho') {
        throw new AppException("Apenas eventos em rascunho podem ser disponibilizados para cotação.", 400)
    }

    const camposObrigatorios = [
        'nome',
        'descricao',
        'data',
        'horario_inicio',
        'horario_fim',
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

    const camposOrcamento = [
        'publico_min',
        'publico_max',
        'publico_esperado',
        'margem_lucro',
        'ticket_estimado_min',
        'ticket_estimado_max'
    ]

    for (const campo of camposOrcamento) {
        if (evento[campo] === undefined || evento[campo] === null) {
            throw new AppException("Salve o orçamento do evento antes de publicar.", 400)
        }
    }

    const custos = await repository.listarCustosOrcamentoRepository(evento_id)

    if (custos.length === 0) {
        throw new AppException("O evento precisa ter pelo menos um custo para ser publicado.", 400)
    }

    await repository.atualizarStatusEventoRepository('publicado', evento_id)
}

export async function encerrarEventoService(evento_id) {
    const evento = await eventoRepository.buscarDetalheEventoRepository(evento_id)

    if (evento?.status !== 'publicado') {
        throw new AppException("Apenas eventos publicados podem ser encerrados.", 400)
    }

    await repository.atualizarStatusEventoRepository('encerrado', evento_id)
}

export async function listarPropostasEventoService(evento_id) {
    const propostas = await repository.listarPropostasEventoRepository(evento_id)

    const propostasResponse = dto.listarPropostasEventoResponse(propostas)
    return propostasResponse
}

// Confere se a proposta existe, é de um evento deste organizador
// e foi enviada pelo fornecedor (proposta direta é respondida pelo fornecedor).
async function buscarPropostaDoOrganizador(proposta_id, organizador_id) {
    const proposta = await propostaRepository.buscarPropostaCompletaRepository(proposta_id)

    if (!proposta) {
        throw new AppException("Proposta não encontrada", 404)
    }

    if (proposta.organizador_id !== organizador_id) {
        throw new AppException("Esta proposta não é de um evento seu.", 403)
    }

    return proposta
}

async function buscarPropostaDoFornecedorParaOrganizador(proposta_id, organizador_id) {
    const proposta = await buscarPropostaDoOrganizador(proposta_id, organizador_id)

    if (proposta.origem === 'organizador') {
        throw new AppException("Propostas diretas são aceitas ou recusadas pelo fornecedor. Você só pode cancelá-las.", 400)
    }

    return proposta
}

export async function selecionarPropostaService(proposta_id, organizador_id) {
    const proposta = await buscarPropostaDoFornecedorParaOrganizador(proposta_id, organizador_id)

    await repository.selecionarPropostaRepository(proposta_id, proposta.vaga_servico_id)
}

export async function recusarPropostaService(proposta_id, organizador_id) {
    await buscarPropostaDoFornecedorParaOrganizador(proposta_id, organizador_id)

    await repository.recusarPropostaRepository(proposta_id)
}

export async function aceitarPropostaService(proposta_id, organizador_id) {
    const proposta = await buscarPropostaDoFornecedorParaOrganizador(proposta_id, organizador_id)

    const resultado = await repository.aceitarPropostaRepository(proposta_id, proposta.vaga_servico_id)

    if (resultado === 'vaga_preenchida') {
        throw new AppException("Esta vaga de serviço já foi preenchida.", 409)
    }

    if (resultado === 'status_invalido') {
        throw new AppException("Esta proposta não pode mais ser aceita.", 409)
    }
}

export async function criarPropostaDiretaService(request) {
    const fornecedor = await fornecedorRepository.buscarDetalhesFornecedorRepository(request.fornecedor_id)

    if (!fornecedor) {
        throw new AppException("Fornecedor não encontrado", 404)
    }

    if (fornecedor.status_cadastro !== 'aprovado') {
        throw new AppException("Só é possível enviar proposta direta para fornecedores aprovados.", 400)
    }

    const vaga = await repository.buscarVagaComEventoRepository(request.vaga_servico_id)

    if (!vaga) {
        throw new AppException("Vaga de serviço não encontrada", 404)
    }

    if (vaga.organizador_id !== request.organizador_id) {
        throw new AppException("Esta vaga de serviço não é de um evento seu.", 403)
    }

    if (vaga.status_evento !== 'em_cotacao') {
        throw new AppException("O evento precisa estar em cotação para enviar proposta direta.", 400)
    }

    if (vaga.status === 'preenchida') {
        throw new AppException("Esta vaga de serviço já foi preenchida.", 409)
    }

    const existente = await repository.buscarPropostaPorVagaFornecedorRepository(request.vaga_servico_id, request.fornecedor_id)

    if (existente) {
        throw new AppException("Este fornecedor já tem uma proposta para esta vaga. Continue a negociação pela conversa dessa proposta.", 409)
    }

    const proposta_id = await repository.criarPropostaDiretaRepository(request)

    return { proposta_id }
}

export async function cancelarPropostaDiretaService(proposta_id, organizador_id) {
    const proposta = await buscarPropostaDoOrganizador(proposta_id, organizador_id)

    if (proposta.origem !== 'organizador') {
        throw new AppException("Só o organizador que enviou a proposta pode cancelá-la", 403)
    }

    const alteradas = await propostaRepository.mudarStatusPropostaRepository(proposta_id, ['pendente'], 'cancelada')

    if (alteradas === 0) {
        throw new AppException("Só propostas pendentes podem ser canceladas", 409)
    }

    return { id: Number(proposta_id), status: 'cancelada' }
}

export async function listarVagasPropostaDiretaService(organizador_id, fornecedor_id) {
    const vagas = await repository.listarVagasPropostaDiretaRepository(organizador_id, fornecedor_id)

    return { vagas }
}

export async function listarCustosOrcamentoService(evento_id) {
    const custos = await repository.listarCustosOrcamentoRepository(evento_id)

    const custosResponse = dto.listarCustosOrcamentoResponse(custos)
    return custosResponse
}

function calcularTicketPublico(publico, custo_total, margem_lucro) {
    const ticket_bruto = custo_total / (publico * (1 - margem_lucro)) / 0.99
    const taxa = ticket_bruto * 0.01

    return dto.calculo_ticket_publico(
        publico,
        ticket_bruto,
        taxa,
        ticket_bruto - taxa
    )
}

export async function calcularTicketService(calcularTicketRequest) {
    const custos = await repository.listarCustosOrcamentoRepository(calcularTicketRequest.evento_id)

    const custo_total = custos.reduce((total, custo) => total + custo.valor, 0)
    const margem_lucro = calcularTicketRequest.margem_lucro / 100

    // Fórmula: Ticket = custo total ÷ [público × (1 − margem)] ÷ 0,99. O cálculo inclui a taxa de 1% que vai para a Troca Ticket em cada transação monetária no site.
    const publicos = {
        ticket_publico_min: calcularTicketRequest.publico_min,
        ticket_publico_esperado: calcularTicketRequest.publico_esperado,
        ticket_publico_max: calcularTicketRequest.publico_max
    }

    let calculos_ticket_publico = {}
    for (const p in publicos) {
        calculos_ticket_publico[p] = calcularTicketPublico(publicos[p], custo_total, margem_lucro)
    }

    return dto.calculoTicketResponse(calculos_ticket_publico, calcularTicketRequest.margem_lucro, custo_total)
}

export async function salvarOrcamentoService(salvarOrcamentoRequest) {
    const calculo = await calcularTicketService(salvarOrcamentoRequest)

    await repository.salvarOrcamentoRepository(salvarOrcamentoRequest.evento_id, {
        publico_min: salvarOrcamentoRequest.publico_min,
        publico_max: salvarOrcamentoRequest.publico_max,
        publico_esperado: salvarOrcamentoRequest.publico_esperado,
        margem_lucro: salvarOrcamentoRequest.margem_lucro,
        custo_total: calculo.custo_total,
        ticket_publico_min: calculo.ticket_publico_min.ticket_bruto,
        ticket_publico_max: calculo.ticket_publico_max.ticket_bruto
    })
}
