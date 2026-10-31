import mysql from 'mysql2/promise';

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_ROOT_PASSWORD,
    database: process.env.DB_NAME,

    decimalNumbers: true,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    dateStrings: true,
    charset: 'utf8mb4'
});