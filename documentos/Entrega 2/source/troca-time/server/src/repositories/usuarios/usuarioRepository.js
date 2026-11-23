import { pool } from '../../configs/database.js'

export async function listarUsuariosRepository() {
    const [usuarios] = await pool.query(`
        SELECT 
            u.id,
            u.nome,
            u.status_cadastro,
            u.tipo_usuario,
            u.cpf,
            u.cnpj,
            u.descricao,
            u.criado_em
        FROM usuario u
        WHERE tipo_usuario != 'adm'
    `)

    return usuarios;
}
