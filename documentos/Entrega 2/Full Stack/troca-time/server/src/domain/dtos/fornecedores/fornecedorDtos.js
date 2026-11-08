import { AppException } from "../../../exceptions/appExceptions.js";

export function propostaFornecedorLista(proposta) {
    return {
        id: proposta.id,
        nome_vaga: proposta.nome_vaga,
        categoria: proposta.categoria,
        evento_id: proposta.evento_id,
        nome_evento: proposta.nome_evento,
        organizador_id: proposta.organizador_id,
        valor: proposta.valor,
        status: proposta.status,
        descricao: proposta.descricao
    };
}

export function buscarDetalhesFornecedorResponse(dadosFornecedor, propostasFornecedor) {
    return {
        id: dadosFornecedor.id,
        nome: dadosFornecedor.nome,
        status_cadastro: dadosFornecedor.status_cadastro,
        tipo_usuario: dadosFornecedor.tipo_usuario,
        cnpj: dadosFornecedor.cnpj,
        telefone: dadosFornecedor.telefone,
        email: dadosFornecedor.email,
        descricao: dadosFornecedor.descricao,
        criado_em: dadosFornecedor.criado_em,
        propostas: propostasFornecedor.map(propostaFornecedorLista)
    };
}

export function validarCriarPropostaRequest(criarPropostaRequest){
    const camposObrigatorios = [
        categoria,
        valor,
        validade,
        descricao,
    ];

    for (const campo of camposObrigatorios){
        if (
            criarPropostaRequest[campo] === null ||
            criarPropostaRequest[campo] === undefined ||
            String(criarPropostaRequest[campo]).trim === ''
        ){
            throw new AppException (`O campo ${campo} é obrigatório.`,400);
        }
    }
}