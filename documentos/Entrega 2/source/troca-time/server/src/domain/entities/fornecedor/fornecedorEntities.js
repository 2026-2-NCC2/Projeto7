export function propostaEntity(criarPropostaRequest){
    return{
        vaga_servico_id: criarPropostaRequest.vaga_servico_id,
        fornecedor_id: criarPropostaRequest.fornecedor_id,
        valor: criarPropostaRequest.valor,
        validade: criarPropostaRequest.validade,
        descricao: criarPropostaRequest.descricao,
        observacoes: criarPropostaRequest.observacoes || null
    }
}