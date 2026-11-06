import * as repository from '../../repositories/organizadores/organizadorRepository.js'
import * as dto from '../../domain/dtos/organizadores/organizadorDtos.js'
import { eventoEntity, vagaServicoEntity, custoEntity } from '../../domain/entities/organizadores/organizadorEntities.js'
import { AppException } from '../../exceptions/appExceptions.js'

export async function criarEventoService(criarEventoRequest) {
    const novoEvento = eventoEntity(criarEventoRequest)

    const eventoId = await repository.criarEventoRepository(novoEvento)

    return {
        "evento_id": eventoId
    }
}

export async function listarCustosService(evento_id) {
    const vagas = await repository.listarVagasServicoRepository(evento_id)
    const custos = await repository.listarCustosRepository(evento_id)

    return dto.listarCustosResponse(vagas, custos)
}

export async function criarVagaServicoService(evento_id, criarVagaServicoRequest) {
    const novaVaga = vagaServicoEntity(evento_id, criarVagaServicoRequest)

    const vagaId = await repository.criarVagaServicoRepository(novaVaga)

    return {
        "vaga_servico_id": vagaId
    }
}

export async function criarCustoService(evento_id, criarCustoRequest) {
    const novoCusto = custoEntity(evento_id, criarCustoRequest)

    const custoId = await repository.criarCustoRepository(novoCusto)

    return {
        "custo_id": custoId
    }
}
