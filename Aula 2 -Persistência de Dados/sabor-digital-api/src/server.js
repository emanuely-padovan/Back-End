// NOME: EMANUELY MACEDO PADOVAN

const pool = require('./config/database')
const app = require('./app')

const PORT = 3000;
pool.getConnection((err, connection) => {
    if(err) {
        console.error('Erro ao conectar ao Banco de Dados: ', err)
        process.exit(1)
    }
    console.log('Conectado ao SQL!🛠️')
    connection.release()
})

app.listen (PORT, () => {
    console.log("Servidor rodando!🎉")
})