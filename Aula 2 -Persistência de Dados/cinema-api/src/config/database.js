
const mysql = require('mysql2')
require('dotenv').config()

// Conexão com o Banco de Dados
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,   // 10 acessos por vez          
    queueLimit: 0,         // Fila para acessar o banco - 0 = ilimitado
})

module.exports = pool