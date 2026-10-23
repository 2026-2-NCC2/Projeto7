export function resumoPlataformaResponse(resumo) {
    return {
        total_cadastros_pendentes: resumo.total_cadastros_pendentes,
        total_eventos_cotacao: resumo.total_eventos_cotacao,
        total_propostas_recebidas: resumo.total_propostas_recebidas,
    };
}