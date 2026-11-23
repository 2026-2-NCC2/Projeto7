import { pool } from '../../configs/database.js'

// Consultas de proposta usadas por mais de um perfil (organizador e fornecedor).

export async function buscarPropostaCompletaRepository(proposta_id) {
    const [proposta] = await pool.query(`
        SELECT
            p.id,
            p.status,
            p.origem,
            p.validade,
            p.fornecedor_id,
            p.vaga_servico_id,
            vs.status AS status_vaga,
            e.id AS evento_id,
            e.status AS status_evento,
            e.organizador_id
        FROM proposta p
        INNER JOIN vaga_servico vs
            ON vs.id = p.vaga_servico_id
        INNER JOIN evento e
            ON e.id = vs.evento_id
        WHERE p.id = ?
    `, [proposta_id])

    return proposta[0]
}

// Muda o status só se a proposta ainda estiver num dos status esperados.
// Retorna quantas linhas mudaram (0 = alguém mudou a proposta antes).
export async function mudarStatusPropostaRepository(proposta_id, statusEsperados, novoStatus) {
    const [resultado] = await pool.query(`
        UPDATE proposta
        SET status = ?
        WHERE id = ?
            AND status IN (?)
    `, [novoStatus, proposta_id, statusEsperados])

    return resultado.affectedRows
}

// Aceita a proposta e preenche a vaga.
// As outras propostas abertas da mesma vaga são fechadas:
//   - proposta direta (origem organizador) ainda pendente -> cancelada
//   - demais propostas abertas -> recusada
// Retorna 'ok', 'vaga_preenchida' ou 'status_invalido'.
export async function aceitarPropostaRepository(proposta_id, vaga_servico_id) {
    const conexao = await pool.getConnection()

    try {
        await conexao.beginTransaction()

        const [vaga] = await conexao.query(`
            SELECT status FROM vaga_servico WHERE id = ? FOR UPDATE
        `, [vaga_servico_id])

        if (vaga[0]?.status === 'preenchida') {
            await conexao.rollback()
            return 'vaga_preenchida'
        }

        const [aceite] = await conexao.execute(`
            UPDATE proposta SET status = 'aceita'
            WHERE id = ? AND status IN ('pendente', 'selecionada')
        `, [proposta_id])

        if (aceite.affectedRows === 0) {
            await conexao.rollback()
            return 'status_invalido'
        }

        await conexao.execute(`
            UPDATE proposta SET status = 'cancelada'
            WHERE vaga_servico_id = ? AND id != ?
                AND origem = 'organizador'
                AND status = 'pendente'
        `, [vaga_servico_id, proposta_id])

        await conexao.execute(`
            UPDATE proposta SET status = 'recusada'
            WHERE vaga_servico_id = ? AND id != ?
                AND status IN ('pendente', 'selecionada')
        `, [vaga_servico_id, proposta_id])

        await conexao.execute(`
            UPDATE vaga_servico SET status = 'preenchida' WHERE id = ?
        `, [vaga_servico_id])

        await conexao.commit()
        return 'ok'
    } catch (erro) {
        await conexao.rollback()
        throw erro
    } finally {
        conexao.release()
    }
}
