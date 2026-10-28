import * as repository from '../../repositories/fornecedores/fornecedorRepository.js'
import * as dto from '../../domain/dtos/fornecedores/fornecedorDtos.js'
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
