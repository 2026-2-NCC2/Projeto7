import * as repository from '../../repositories/adm/admRepository.js';
import * as dto from '../../domain/dtos/adm/admDtos.js';

export async function buscarResumoPlataformaService() {
    const resumo = await repository.buscarResumoPlataformaRepository();

    const resumoResponse = dto.resumoPlataformaResponse(resumo);
    return resumoResponse;
}