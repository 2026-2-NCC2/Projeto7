import * as repository from '../../repositories/adm/admRepository.js';
import * as dto from '../../domain/dtos/adm/admDtos.js';
import { AppException } from '../../exceptions/appExceptions.js';

export async function buscarResumoPlataformaService() {
    const resumo = await repository.buscarResumoPlataformaRepository();

    const resumoResponse = dto.resumoPlataformaResponse(resumo);
    return resumoResponse;
}

export async function buscarDetalheOrganizadorService(organizador_id) {
    const organizador = await repository.buscarDetalheOrganizadorRepository(organizador_id);

    if (!organizador) {
        throw new AppException("Organizador não encontrado.", 404);
    }

    const eventos = await repository.listarProximosEventosOrganizadorRepository(organizador_id);

    const organizadorResponse = dto.detalheOrganizadorResponse(organizador, eventos);
    return organizadorResponse;
}

async function verificarReprovacao(usuario_id) {
    const usuario = await repository.buscarTipoUsuarioRepository(usuario_id);

    if (!usuario) {
        throw new AppException("Usuário não encontrado.", 404);
    }

    if (usuario.tipo_usuario === 'fornecedor') {
        const propostasSelecionadas = await repository.contarPropostasSelecionadasRepository(usuario_id);

        if (propostasSelecionadas > 0) {
            throw new AppException("O fornecedor possui propostas selecionadas em eventos não encerrados.", 400);
        }
    }

    if (usuario.tipo_usuario === 'organizador') {
        const eventosAtivos = await repository.contarEventosAtivosRepository(usuario_id);

        if (eventosAtivos > 0) {
            throw new AppException("O organizador possui eventos em cotação ou publicados.", 400);
        }
    }
}

export async function atualizarStatusCadastroService(usuario_id, novo_status) {
    if (novo_status === 'reprovado') {
        await verificarReprovacao(usuario_id)
    }

    await repository.atualizarStatusCadastroRepository(usuario_id, novo_status)
}