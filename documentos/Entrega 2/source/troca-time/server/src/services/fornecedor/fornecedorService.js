import * as repository from '../../repositories/fornecedores/fornecedorRepository.js'
import * as propostaRepository from '../../repositories/propostas/propostaRepository.js'
import * as dto from '../../domain/dtos/fornecedores/fornecedorDtos.js'
import { propostaEntity } from '../../domain/entities/fornecedor/fornecedorEntities.js'
import { AppException } from '../../exceptions/appExceptions.js'

export async function listarPropostasFornecedorService(usuario_id) {
    const propostas = await repository.buscarPropostasFornecedorRepository(usuario_id)
    return propostas.map(dto.propostaFornecedorLista)
}

export async function buscarDetalhesFornecedorService(usuario_id, tipo_usuario) {
    const dadosFornecedor = await repository.buscarDetalhesFornecedorRepository(usuario_id)

    if (!dadosFornecedor) {
        throw new AppException("Fornecedor não encontrado", 404)
    }

    let propostasFornecedor = await repository.buscarPropostasFornecedorRepository(usuario_id)

    if (tipo_usuario === 'fornecedor') {
        propostasFornecedor = propostasFornecedor.map((proposta) => ({
            ...proposta,
            status: proposta.status === 'selecionada' ? 'pendente' : proposta.status
        }))
    }

    const detalhesFornecedorResponse = dto.buscarDetalhesFornecedorResponse(dadosFornecedor, propostasFornecedor)

    return detalhesFornecedorResponse
}

export async function criarPropostaService(criarPropostaRequest){
    const statusEvento = await repository.buscarStatusEventoDaVagaRepository(criarPropostaRequest.vaga_servico_id)

    if (statusEvento !== 'em_cotacao') {
        throw new AppException("Esta vaga de serviço não está disponível para propostas.", 400)
    }

    const novaProposta = propostaEntity(criarPropostaRequest)
    
    const propostaId = await repository.criarPropostaFornecedorRepository(novaProposta)

    return{
        "proposta_id": propostaId
    }    
}

export async function listarOportunidadesService(fornecedor_id) {
    const oportunidades = await repository.listarOportunidadesRepository(fornecedor_id)

    const oportunidadesResponse = dto.listarOportunidadesResponse(oportunidades)

    return oportunidadesResponse
}

// O fornecedor aceita ou recusa uma proposta direta enviada pelo organizador.
export async function responderPropostaDiretaService(proposta_id, fornecedor_id, resposta) {
    const proposta = await propostaRepository.buscarPropostaCompletaRepository(proposta_id)

    if (!proposta) {
        throw new AppException("Proposta não encontrada", 404)
    }

    if (proposta.fornecedor_id !== fornecedor_id) {
        throw new AppException("Esta proposta não foi enviada para você.", 403)
    }

    if (proposta.origem !== 'organizador') {
        throw new AppException("Só propostas diretas do organizador podem ser respondidas pelo fornecedor.", 400)
    }

    if (proposta.status !== 'pendente') {
        throw new AppException("Esta proposta não está mais aguardando resposta.", 409)
    }

    if (resposta === 'recusada') {
        const alteradas = await propostaRepository.mudarStatusPropostaRepository(proposta_id, ['pendente'], 'recusada')

        if (alteradas === 0) {
            throw new AppException("Esta proposta não está mais aguardando resposta.", 409)
        }

        return { id: proposta_id, status: 'recusada' }
    }

    if (proposta.status_evento !== 'em_cotacao') {
        throw new AppException("O evento não está mais em cotação.", 409)
    }

    const hoje = new Date().toISOString().slice(0, 10)
    if (String(proposta.validade).slice(0, 10) < hoje) {
        throw new AppException("A validade desta proposta já passou.", 409)
    }

    const resultado = await propostaRepository.aceitarPropostaRepository(proposta_id, proposta.vaga_servico_id)

    if (resultado === 'vaga_preenchida') {
        // A vaga foi preenchida por outro fornecedor antes do aceite: a proposta direta é cancelada.
        await propostaRepository.mudarStatusPropostaRepository(proposta_id, ['pendente'], 'cancelada')
        throw new AppException("A vaga já foi preenchida por outro fornecedor. A proposta foi cancelada.", 409)
    }

    if (resultado === 'status_invalido') {
        throw new AppException("Esta proposta não está mais aguardando resposta.", 409)
    }

    return { id: proposta_id, status: 'aceita' }
}
