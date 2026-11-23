import { pool } from '../../configs/database.js'

// Cada conversa é uma proposta. Participam o organizador do evento e o fornecedor da proposta.
export async function listarConversasRepository(usuario_id, tipo_usuario) {
    const filtro = tipo_usuario === 'organizador' ? 'e.organizador_id = ?' : 'p.fornecedor_id = ?'

    const [conversas] = await pool.query(`
        SELECT
            p.id AS proposta_id,
            p.status,
            p.origem,
            p.valor,
            p.descricao,
            p.observacoes,
            p.validade,
            vs.id AS vaga_servico_id,
            vs.item,
            vs.categoria,
            vs.status AS status_vaga,
            e.id AS evento_id,
            e.nome AS nome_evento,
            e.data AS data_evento,
            e.status AS status_evento,
            e.organizador_id,
            uo.nome AS nome_organizador,
            p.fornecedor_id,
            uf.nome AS nome_fornecedor,
            um.conteudo AS ultima_mensagem,
            um.criado_em AS ultima_mensagem_em,
            COALESCE(um.criado_em, p.criado_em) AS atividade_em
        FROM proposta p
        INNER JOIN vaga_servico vs
            ON vs.id = p.vaga_servico_id
        INNER JOIN evento e
            ON e.id = vs.evento_id
        INNER JOIN usuario uo
            ON uo.id = e.organizador_id
        INNER JOIN usuario uf
            ON uf.id = p.fornecedor_id
        LEFT JOIN mensagem um
            ON um.id = (
                SELECT MAX(m.id)
                FROM mensagem m
                WHERE m.proposta_id = p.id
            )
        WHERE ${filtro}
        ORDER BY atividade_em DESC, p.id DESC
    `, [usuario_id])

    return conversas
}

export async function buscarParticipantesRepository(proposta_id) {
    const [resultado] = await pool.query(`
        SELECT
            p.id,
            p.status,
            p.fornecedor_id,
            e.organizador_id
        FROM proposta p
        INNER JOIN vaga_servico vs
            ON vs.id = p.vaga_servico_id
        INNER JOIN evento e
            ON e.id = vs.evento_id
        WHERE p.id = ?
    `, [proposta_id])

    return resultado[0]
}

export async function listarMensagensRepository(proposta_id, depois_de) {
    const [mensagens] = await pool.query(`
        SELECT
            id,
            proposta_id,
            remetente_id,
            tipo,
            conteudo,
            criado_em
        FROM mensagem
        WHERE proposta_id = ?
            AND id > ?
        ORDER BY id ASC
    `, [proposta_id, depois_de])

    return mensagens
}

export async function criarMensagemRepository(proposta_id, remetente_id, conteudo) {
    const conexao = await pool.getConnection()

    try {
        await conexao.beginTransaction()

        const [resultado] = await conexao.execute(`
            INSERT INTO mensagem (proposta_id, remetente_id, tipo, conteudo)
            VALUES (?, ?, 'texto', ?)
        `, [proposta_id, remetente_id, conteudo])

        // Na primeira mensagem, marca quando a conversa começou
        await conexao.execute(`
            UPDATE proposta SET conversa_criada_em = NOW()
            WHERE id = ? AND conversa_criada_em IS NULL
        `, [proposta_id])

        const [mensagem] = await conexao.query(`
            SELECT id, proposta_id, remetente_id, tipo, conteudo, criado_em
            FROM mensagem
            WHERE id = ?
        `, [resultado.insertId])

        await conexao.commit()
        return mensagem[0]
    } catch (erro) {
        await conexao.rollback()
        throw erro
    } finally {
        conexao.release()
    }
}
