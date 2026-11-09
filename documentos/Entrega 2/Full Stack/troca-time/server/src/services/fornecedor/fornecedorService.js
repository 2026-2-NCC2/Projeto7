import * as repository from '../../repositories/fornecedores/fornecedorRepository.js'
import * as dto from '../../domain/dtos/fornecedores/fornecedorDtos.js'
import { propostaEntity } from '../../domain/entities/fornecedor/fornecedorEntities.js'
import { AppException } from '../../exceptions/appExceptions.js'

export async function buscarDetalhesFornecedorService(usuario_id) {
    const dadosFornecedor = await repository.buscarDetalhesFornecedorRepository(usuario_id)

    if (!dadosFornecedor) {
        throw new AppException("Fornecedor não encontrado", 404)
    }

    const propostasFornecedor = await repository.buscarPropostasFornecedorRepository(usuario_id)

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
