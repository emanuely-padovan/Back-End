
const express = require('express')
const pool = require('./config/database') // COnexão com o Banco de Dados

const app = express()
app.use(express.json)

app.get('/', (req, res) => {
    res.send('API is working!')
})

app.get('/filme', (req, res) => {
    // Mudanças:
    pool.query('SELECT * FROM filme', (err, results) => {
        res.json(results) // Retorno em JSON dos meus resultados
    })
})

module.exports = app // Garante que eu consiga acessar o app em outros arquivos, como o server.js