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
            WHERE p.status = 'pendente'
        )

        SELECT c.total_cadastros_pendentes, e.total_eventos_cotacao, p.total_propostas_recebidas
        FROM cadastros_pendentes c 
        CROSS JOIN eventos_cotacao e
        CROSS JOIN propostas_recebidas p
    `);

    return resumo[0];
}

export async function buscarDetalheOrganizadorRepository(organizador_id) {
    const [organizador] = await pool.query(`
        SELECT
            u.id,
            u.nome,
            u.status_cadastro,
            u.cpf,
            u.cnpj,
            u.telefone,
            u.email,
            u.descricao,
            u.criado_em
        FROM usuario u
        WHERE u.id = ?
            AND u.tipo_usuario = 'organizador'
    `, [organizador_id])

    return organizador[0]
}

export async function listarProximosEventosOrganizadorRepository(organizador_id) {
    const [eventos] = await pool.query(`
        SELECT
            e.id,
            e.nome,
            e.data,
            e.horario_inicio,
            e.nome_local,
            e.cidade,
            e.estado
        FROM evento e
        WHERE e.organizador_id = ?
            AND e.status = 'publicado'
            AND e.data >= CURDATE()
        ORDER BY e.data, e.horario_inicio
    `, [organizador_id])

    return eventos
}

export async function atualizarStatusCadastroRepository(usuario_id, novo_status) {
    await pool.execute(`UPDATE usuario SET status_cadastro = ? WHERE id = ?`,[novo_status, usuario_id])
}

export async function buscarTipoUsuarioRepository(usuario_id) {
    const [usuario] = await pool.query(`
        SELECT u.tipo_usuario
        FROM usuario u
        WHERE u.id = ?
    `, [usuario_id])

    return usuario[0]
}

export async function contarPropostasSelecionadasRepository(fornecedor_id) {
    const [resultado] = await pool.query(`
        SELECT COUNT(*) AS total
        FROM proposta p
        INNER JOIN vaga_servico vs
            ON vs.id = p.vaga_servico_id
        INNER JOIN evento e
            ON e.id = vs.evento_id
        WHERE p.fornecedor_id = ?
            AND p.status = 'aceita'
            AND e.status != 'encerrado'
    `, [fornecedor_id])

    return resultado[0].total
}

export async function contarEventosAtivosRepository(organizador_id) {
    const [resultado] = await pool.query(`
        SELECT COUNT(*) AS total
        FROM evento e
        WHERE e.organizador_id = ?
            AND e.status IN ('em_cotacao', 'publicado')
    `, [organizador_id])

    return resultado[0].total
}
