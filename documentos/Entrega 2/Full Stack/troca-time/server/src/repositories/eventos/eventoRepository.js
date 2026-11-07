import { pool } from '../../configs/database.js'

export async function listarEventosRepository() {
    const [eventos] = await pool.query(`
        SELECT
            e.id,
            e.nome,
            e.status,
            e.descricao,
            e.data,
            e.horario_inicio,
            e.horario_fim,
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
        ORDER BY e.data ASC, e.horario_inicio ASC
    `);

    return eventos;
}

export async function buscarDetalheEventoRepository(evento_id){
    const [detalheEvento] = await pool.query(`
        SELECT
            e.id,
            e.nome,
            e.status,
            e.descricao,
            e.data,
            e.horario_inicio,
            e.horario_fim,
            e.nome_local,
            e.rua,
            e.cep,
            e.bairro,
            e.cidade,
            e.numero,
            e.criado_em,
            e.atualizado_em,
            e.custo_total,
            e.margem_lucro,
            e.ticket_publico_min AS ticket_estimado_min,
            e.ticket_publico_max AS ticket_estimado_max,
            e.publico_min,
            e.publico_max,
            u.nome AS nome_organizador,
            e.organizador_id
        FROM evento e
        INNER JOIN usuario u
            ON u.id = e.organizador_id
        WHERE e.id = ?
    `, evento_id);

    return detalheEvento[0];
}

export async function buscarVagasPorEventoIdRepository(evento_id){
    const[vagasEvento] = await pool.query(`
        SELECT
        u.nome AS nome_fornecedor,
        u.id AS fornecedor_id,
        p.valor,
        v.categoria
        FROM proposta p 
        INNER JOIN usuario u ON u.id = p.fornecedor_id
        INNER JOIN vaga_servico v ON p.vaga_servico_id = v.id 
        WHERE v.evento_id = ?
            AND p.status = 'aceita'
    `, evento_id);

    return vagasEvento;
}