import { pool } from '../../configs/database.js'

export async function criarEventoRepository(evento) {
    const [resultado] = await pool.execute(`
        INSERT INTO evento (
            nome, 
            descricao,
            data,
            horario_inicio,
            horario_fim,
            organizador_id,
            nome_local,
            cep,
            rua,
            numero,
            complemento,
            bairro,
            cidade,
            estado
        )
        VALUES (
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?
        )
     `, [
        evento.nome,
        evento.descricao,
        evento.data,
        evento.horario_inicio,
        evento.horario_fim,
        evento.organizador_id,
        evento.nome_local,
        evento.cep,
        evento.rua,
        evento.numero,
        evento.complemento,
        evento.bairro,
        evento.cidade,
        evento.estado
    ])

    return resultado.insertId
}

export async function listarVagasServicoRepository() {
    const [vagasServico] = await pool.query(`
        WITH propostas_vagas AS (
            SELECT
                p.vaga_servico_id,
                COUNT(DISTINCT p.id) AS qnt_propostas
            FROM proposta p
            GROUP BY 1
        )

        SELECT 
            vs.id,
            vs.evento_id,
            vs.item,
            vs.categoria,
            vs.cotacao_ate,
            vs.descricao,
            vs.status,
            vs.criado_em,
            vs.atualizado_em,
            COALESCE(p.qnt_propostas, 0) AS qnt_propostas
        FROM vaga_servico vs LEFT JOIN propostas_vagas p ON p.vaga_servico_id = vs.id
    `)
    
    return vagasServico
}

export async function listarCustosManuaisRepository(evento_id) {
    const [custos] = await pool.query(`
        SELECT
            c.id,
            c.evento_id,
            c.item,
            c.categoria,
            c.valor,
            c.descricao,
            c.criado_em,
            c.atualizado_em
        FROM custo_manual c
        WHERE c.evento_id = ?
        ORDER BY c.criado_em
    `, [evento_id])

    return custos
}

export async function salvarOrcamentoRepository(evento_id, orcamento) {
    await pool.execute(`
        UPDATE evento SET
            publico_min = ?,
            publico_max = ?,
            publico_esperado = ?,
            margem_lucro = ?,
            custo_total = ?,
            ticket_publico_min = ?,
            ticket_publico_max = ?
        WHERE id = ?
    `, [
        orcamento.publico_min,
        orcamento.publico_max,
        orcamento.publico_esperado,
        orcamento.margem_lucro,
        orcamento.custo_total,
        orcamento.ticket_publico_min,
        orcamento.ticket_publico_max,
        evento_id
    ])
}

export async function atualizarStatusEventoRepository(novo_status, evento_id) {
    await pool.execute(`
        UPDATE evento SET status = ? WHERE id = ?
    `, [novo_status, evento_id])
}

export async function criarVagaServicoRepository(vaga) {
    const [resultado] = await pool.execute(`
        INSERT INTO vaga_servico (
            evento_id,
            item,
            categoria,
            descricao,
            cotacao_ate
        )
        VALUES (
            ?,?,?,?,?
        )
    `, [
        vaga.evento_id,
        vaga.item,
        vaga.categoria,
        vaga.descricao,
        vaga.cotacao_ate
    ])

    return resultado.insertId
}

export async function criarCustoManualRepository(custo) {
    const [resultado] = await pool.execute(`
        INSERT INTO custo_manual (
            evento_id,
            item,
            categoria,
            descricao,
            valor
        )
        VALUES (
            ?,?,?,?,?
        )
    `, [
        custo.evento_id,
        custo.item,
        custo.categoria,
        custo.descricao,
        custo.valor
    ])

    return resultado.insertId
}

export async function contarPropostasVagaServicoRepository(vaga_servico_id) {
    const [resultado] = await pool.query(`
        SELECT COUNT(*) AS total
        FROM proposta p
        WHERE p.vaga_servico_id = ?
    `, [vaga_servico_id])

    return resultado[0].total
}

export async function deletarVagaServicoRepository(vaga_servico_id) {
    await pool.execute(`
        DELETE FROM vaga_servico WHERE id = ?
    `, [vaga_servico_id])
}

export async function deletarCustoManualRepository(custo_manual_id) {
    await pool.execute(`
        DELETE FROM custo_manual WHERE id = ?
    `, [custo_manual_id])
}

export async function contarVagasNaoPreenchidasRepository(evento_id) {
    const [resultado] = await pool.query(`
        SELECT COUNT(*) AS total
        FROM vaga_servico vs
        WHERE vs.evento_id = ?
            AND vs.status != 'preenchida'
    `, [evento_id])

    return resultado[0].total
}

export async function listarPropostasEventoRepository(evento_id) {
    const [propostas] = await pool.query(`
        SELECT
            p.id,
            p.vaga_servico_id,
            vs.item,
            vs.categoria,
            vs.cotacao_ate,
            vs.status AS status_vaga,
            p.fornecedor_id,
            u.nome AS nome_fornecedor,
            p.valor,
            p.descricao,
            p.observacoes,
            p.validade,
            p.status
        FROM proposta p
        INNER JOIN vaga_servico vs
            ON vs.id = p.vaga_servico_id
        INNER JOIN usuario u
            ON u.id = p.fornecedor_id
        WHERE vs.evento_id = ?
        ORDER BY p.valor
    `, [evento_id])

    return propostas
}

export async function buscarPropostaRepository(proposta_id) {
    const [proposta] = await pool.query(`
        SELECT
            p.id,
            p.status,
            p.vaga_servico_id,
            vs.status AS status_vaga
        FROM proposta p
        INNER JOIN vaga_servico vs
            ON vs.id = p.vaga_servico_id
        WHERE p.id = ?
    `, [proposta_id])

    return proposta[0]
}

export async function selecionarPropostaRepository(proposta_id, vaga_servico_id) {
    const conexao = await pool.getConnection()

    try {
        await conexao.beginTransaction()

        await conexao.execute(`
            UPDATE proposta SET status = 'pendente'
            WHERE vaga_servico_id = ? AND status = 'selecionada'
        `, [vaga_servico_id])

        await conexao.execute(`
            UPDATE proposta SET status = 'selecionada' WHERE id = ?
        `, [proposta_id])

        await conexao.commit()
    } catch (erro) {
        await conexao.rollback()
        throw erro
    } finally {
        conexao.release()
    }
}

export async function recusarPropostaRepository(proposta_id) {
    await pool.execute(`
        UPDATE proposta SET status = 'recusada' WHERE id = ?
    `, [proposta_id])
}

export async function aceitarPropostaRepository(proposta_id, vaga_servico_id) {
    const conexao = await pool.getConnection()

    try {
        await conexao.beginTransaction()

        await conexao.execute(`
            UPDATE proposta SET status = 'aceita' WHERE id = ?
        `, [proposta_id])

        await conexao.execute(`
            UPDATE proposta SET status = 'recusada'
            WHERE vaga_servico_id = ? AND id != ?
        `, [vaga_servico_id, proposta_id])

        await conexao.execute(`
            UPDATE vaga_servico SET status = 'preenchida' WHERE id = ?
        `, [vaga_servico_id])

        await conexao.commit()
    } catch (erro) {
        await conexao.rollback()
        throw erro
    } finally {
        conexao.release()
    }
}

export async function listarCustosOrcamentoRepository(evento_id) {
    const [custos] = await pool.query(`
        SELECT
            vs.item,
            CONCAT('Proposta — ', u.nome) AS origem,
            p.valor
        FROM proposta p
        INNER JOIN vaga_servico vs
            ON vs.id = p.vaga_servico_id
        INNER JOIN usuario u
            ON u.id = p.fornecedor_id
        WHERE vs.evento_id = ?
            AND p.status IN ('selecionada', 'aceita')

        UNION ALL

        SELECT
            c.item,
            'Cadastrado pelo Organizador' AS origem,
            c.valor
        FROM custo_manual c
        WHERE c.evento_id = ?
    `, [evento_id, evento_id])

    return custos
}
