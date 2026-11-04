import { pool } from '../../configs/database.js'

export async function criarEventoRepository(evento) {
    const [resultado] = await pool.execute(`
        INSERT INTO evento (
            nome, 
            descricao,
            inicio,
            fim,
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
            ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?
        )
     `, evento.nome,
        evento.descricao,
        evento.inicio,
        evento.fim,
        evento.organizador_id,
        evento.publico_min,
        evento.publico_max, 
        evento.publico_esperado,
        evento.margem_lucro,
        evento.nome_local,
        evento.cep,
        evento.rua,
        evento.numero,
        evento.complemonto,
        evento.bairro,
        evento.cidade,
        evento.estado
    ) 

    return resultado.insertId
}