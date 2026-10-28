import * as repository from '../../repositories/eventos/eventoRepository.js'
import * as dto from '../../domain/dtos/eventos/eventosDtos.js'

export async function listarEventosService() {
    const eventos = await repository.listarEventosRepository()

    const eventosResponse = dto.listarEventosResponse(eventos)

    return eventosResponse
}