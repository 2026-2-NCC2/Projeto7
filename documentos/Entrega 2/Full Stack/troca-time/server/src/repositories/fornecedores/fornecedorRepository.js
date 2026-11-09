import { pool } from '../../configs/database.js'

export async function buscarDetalhesFornecedorRepository(usuario_id) {
    const [detalhesFornecedor] = await pool.query(`
        SELECT
            u.id,
            u.nome,
            u.status_cadastro,
            u.tipo_usuario,
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
            vs.item AS nome_vaga,
            vs.categoria,
            e.id AS evento_id,
            e.nome AS nome_evento,
            e.organizador_id,
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

export async function buscarStatusEventoDaVagaRepository(vaga_servico_id) {
    const [resultado] = await pool.query(`
        SELECT e.status
        FROM vaga_servico vs
        INNER JOIN evento e
            ON e.id = vs.evento_id
        WHERE vs.id = ?
    `, [vaga_servico_id])

    return resultado[0]?.status
}

export async function criarPropostaFornecedorRepository(proposta) {
    const [criacaoProposta] = await pool.query(`
        INSERT INTO proposta (
            vaga_servico_id,
            fornecedor_id,
            valor,
            validade,
            descricao,
            observacoes
        )
        VALUES (
            ?,?,?,?,?,?
        )
    `, [
        proposta.vaga_servico_id,
        proposta.fornecedor_id,
        proposta.valor,
        proposta.validade,
        proposta.descricao,
        proposta.observacoes
    ]) 

    return criacaoProposta.insertId
    
}

export async function listarOportunidadesRepository(fornecedor_id) {
    const [oportunidades] = await pool.query(`
        SELECT
            vs.id,
            vs.evento_id,
            vs.item,
            vs.categoria,
            vs.descricao,
            vs.cotacao_ate,
            e.nome AS nome_evento,
            e.data,
            e.horario_inicio,
            e.nome_local,
            e.cidade,
            e.estado
        FROM vaga_servico vs
        INNER JOIN evento e
            ON e.id = vs.evento_id
        WHERE e.status = 'em_cotacao'
            AND vs.status = 'pendente'
            AND vs.cotacao_ate >= CURDATE()
            AND NOT EXISTS (
                SELECT 1
                FROM proposta p
                WHERE p.vaga_servico_id = vs.id
                    AND p.fornecedor_id = ?
            )
        ORDER BY e.data ASC, e.horario_inicio ASC
    `, [fornecedor_id]);

    return oportunidades;
}
