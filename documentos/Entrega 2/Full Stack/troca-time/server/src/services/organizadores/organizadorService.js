import * as repository from '../../repositories/organizadores/organizadorRepository.js'
import * as dto from '../../domain/dtos/organizadores/organizadorDtos.js'
import { eventoEntity } from '../../domain/entities/organizadores/organizadorEntities.js'
import { AppException } from '../../exceptions/appExceptions.js'

export async function criarEventoService(criarEventoRequest) {
    const novoEvento = eventoEntity(criarEventoRequest)

    const eventoId = await repository.criarEventoRepository(novoEvento)

    return {
        "evento_id": eventoId
    }
}
