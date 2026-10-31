import { pool } from '../../configs/database.js'

export async function listarEventosRepository() {
    const [eventos] = await pool.query(`
        SELECT
            e.id,
            e.nome,
            e.status,
            e.descricao,
            e.inicio,
            e.fim,
            e.nome_local,
            COALESCE(p.quantidade_propostas, 0) AS quantidade_propostas,
            e.ticket_publico_min AS ticket_estimado_min,
            e.ticket_publico_max AS ticket_estimado_max,
            u.nome AS nome_organizador,
            e.organizador_id
        FROM evento e
        INNER JOIN usuario u
            ON u.id = e.organizador_id
        LEFT JOIN (
            SELECT
                v.evento_id,
                COUNT(p.id) AS quantidade_propostas
            FROM vaga_servico v
            LEFT JOIN proposta p
                ON p.vaga_servico_id = v.id
            GROUP BY v.evento_id
        ) p
            ON p.evento_id = e.id
        ORDER BY e.inicio ASC
    `);

    return eventos;
}