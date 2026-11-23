import { pool } from '../../configs/database.js';

export async function cadastrarUsuarioRepository(usuario) {
    const sql = `
        INSERT INTO usuario (
            tipo_usuario,
            nome,
            descricao,
            email,
            cpf,
            cnpj,
            telefone,
            senha_hash
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [resultado] = await pool.execute(sql, [
        usuario.tipo_usuario,
        usuario.nome,
        usuario.descricao,
        usuario.email,
        usuario.cpf,
        usuario.cnpj,
        usuario.telefone,
        usuario.senha_hash
    ]);

    return resultado.insertId;
}

export async function buscarUsuarioPorEmailRepository(email) {
    const [usuarios] = await pool.execute(`
        SELECT * FROM usuario WHERE email = ?
    `, [email]);

    return usuarios[0] || null;
}

export async function buscarUsuarioPorDocumentoRepository(documento) {
    const [usuarios] = await pool.execute(`
        SELECT * FROM usuario WHERE cpf = ? OR cnpj = ?
    `, [documento, documento]);

    return usuarios[0] || null;
}