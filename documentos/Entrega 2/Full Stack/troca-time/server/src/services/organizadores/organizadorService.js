import * as repository from '../../repositories/organizadores/organizadorRepository.js'
import * as dto from '../../domain/dtos/organizadores/organizadorDtos.js'
import { AppException } from '../../exceptions/appExceptions.js'

export async function criarEventoService(criarEventoRequest) {
    const eventoId = await repository.criarEventoRepository(
        
    )
    
}
