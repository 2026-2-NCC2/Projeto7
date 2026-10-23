import { pool } from '../../configs/database.js'

export async function buscarResumoPlataformaRepository() {
    const [resumo] = await pool.query(`
        WITH cadastros_pendentes AS (
            SELECT COUNT(*) as total_cadastros_pendentes
            FROM usuario u
            WHERE u.status_cadastro = 'pendente'
        ),

        eventos_cotacao AS (
            SELECT COUNT(*) as total_eventos_cotacao
            FROM evento e
            WHERE e.status = 'em_cotacao'
        ),

        propostas_recebidas AS (
            SELECT COUNT(*) as total_propostas_recebidas
            FROM proposta p
            WHERE p.status = 'enviada'
        )

        SELECT c.total_cadastros_pendentes, e.total_eventos_cotacao, p.total_propostas_recebidas
        FROM cadastros_pendentes c 
        CROSS JOIN eventos_cotacao e
        CROSS JOIN propostas_recebidas p
    `);

    return resumo[0];
}