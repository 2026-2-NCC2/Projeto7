import * as repository from '../../repositories/eventos/eventoRepository.js'
import * as dto from '../../domain/dtos/eventos/eventosDtos.js'

export async function listarEventosService() {
    const eventos = await repository.listarEventosRepository()

    const eventosResponse = dto.listarEventosResponse(eventos)

    return eventosResponse
}

export async function buscarDetalheEventosService(evento_id){
    const eventos = await repository.buscarDetalheEventoRepository(evento_id)

    const vagas_servico = await repository.buscarVagasPorEventoIdRepository(evento_id)

    const detalheEventoResponse = dto.detalheEvento(eventos, vagas_servico)

    return detalheEventoResponse
}