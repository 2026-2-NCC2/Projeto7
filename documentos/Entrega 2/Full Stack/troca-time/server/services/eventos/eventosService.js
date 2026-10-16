import * as repository from "../../repositories/eventos/eventosRepository.js";
import * as dto from "../../domains/eventos/dtos/listarEventosResponseDto.js"

export async function listarEventosService() {
    const eventos = await repository.listarEventosRepository();
    
    const eventosResponse = new dto.ListarEventosResponseDto(eventos);
    return eventosResponse;
}