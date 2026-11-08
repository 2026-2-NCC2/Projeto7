export function propostaEntity(criarPropostaRequest){
    return{
        categoria: criarPropostaRequest.categoria,
        valor: criarPropostaRequest.valor,
        validade: criarPropostaRequest.validade,
        descricao: criarPropostaRequest.descricao,
        observacoes: criarPropostaRequest.observacoes || null
    }
}