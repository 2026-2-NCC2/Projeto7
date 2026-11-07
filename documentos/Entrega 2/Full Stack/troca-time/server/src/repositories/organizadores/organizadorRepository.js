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
            publico_min,
            publico_max,
            publico_esperado,
            margem_lucro,
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
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
        )
     `, [
        evento.nome,
        evento.descricao,
        evento.data,
        evento.horario_inicio,
        evento.horario_fim,
        evento.organizador_id,
        evento.publico_min,
        evento.publico_max, 
        evento.publico_esperado,
        evento.margem_lucro,
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

export async function listarVagasServicoRepository(evento_id) {
    const [vagas] = await pool.query(`
        SELECT
            vs.id,
            vs.item,
            vs.categoria,
            vs.descricao,
            vs.cotacao_ate,
            vs.status,
            COUNT(p.id) AS quantidade_propostas
        FROM vaga_servico vs
        LEFT JOIN proposta p
            ON p.vaga_servico_id = vs.id
        WHERE vs.evento_id = ?
        GROUP BY vs.id
        ORDER BY vs.criado_em
    `, [evento_id])

    return vagas
}

export async function listarCustosRepository(evento_id) {
    const [custos] = await pool.query(`
        SELECT
            c.id,
            c.descricao,
            c.origem,
            c.valor
        FROM custo_evento c
        WHERE c.evento_id = ?
        ORDER BY c.criado_em
    `, [evento_id])

    return custos
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

export async function criarCustoRepository(custo) {
    const [resultado] = await pool.execute(`
        INSERT INTO custo_evento (
            evento_id,
            descricao,
            origem,
            valor
        )
        VALUES (
            ?,?,?,?
        )
    `, [
        custo.evento_id,
        custo.descricao,
        custo.origem,
        custo.valor
    ])

    return resultado.insertId
}