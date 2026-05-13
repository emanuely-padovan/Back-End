const app = require('./app')
const pool = require('./config/database')
require('dotenv').config()

const PORT = process.env.PORT || 3000

async function startServer() {
    try {
        const connection = await pool.getConnection()
        console.log("Conexão com MySQL estabelecida na veterinária!✔️")
        connection.release()

        app.listen(PORT, () => {
            console.log(`Servidor da Clínica Veterinária rodando na porta ${PORT} 🐶`)
        })
    } catch (error) {
        console.error("Erro fatal ao conectar ao banco de dados:", error);
        process.exit(1);
    }
}

startServer()