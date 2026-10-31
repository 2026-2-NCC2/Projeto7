import { pool } from '../../configs/database.js'

export async function buscarDetalhesFornecedorRepository(usuario_id) {
    const [detalhesFornecedor] = await pool.query(`
        SELECT
            u.id,
            u.nome,
            u.status_cadastro,
            u.tipo_usuario,
            u.categoria,
            u.cnpj,
            u.telefone,
            u.email,
            u.descricao,
            u.criado_em
        FROM usuario u
        WHERE u.id = ?
            AND u.tipo_usuario = 'fornecedor'
    `, [usuario_id])

    return detalhesFornecedor[0]
}

export async function buscarPropostasFornecedorRepository(usuario_id) {
    const [propostasFornecedor] = await pool.query(`
        SELECT
            p.id,
            vs.nome AS nome_vaga,
            vs.categoria,
            e.id AS evento_id,
            e.nome AS nome_evento,
            p.valor,
            p.status,
            p.descricao
        FROM proposta p
        INNER JOIN vaga_servico vs
            ON vs.id = p.vaga_servico_id
        INNER JOIN evento e
            ON e.id = vs.evento_id
        WHERE p.fornecedor_id = ?
        ORDER BY p.criado_em DESC
    `, [usuario_id])

    return propostasFornecedor
}
