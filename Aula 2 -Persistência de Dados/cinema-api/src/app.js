
const express = require('express')
const pool = require('./config/database') // COnexão com o Banco de Dados

const app = express()
app.use(express.json())

// Função Assíncrona - 04/03
const queryAsync = (sql, values = []) => { // Condições para que algo seja tratado da forma correta... então uma query e alguns valores são recebidas 
    return new Promise ((resolve, reject) => { // Promise: Irá aceitar ou recusar as solicitações
        pool.query(sql, values, (err, results) => {
            if(err) reject(err)
            else resolve(results)
        })
    })
}

app.get('/', (req, res) => {
    res.send('API is working!')
})

app.get('/filmes', async(req, res) => {
    // TryCatch:
    try {
        const filmes = await queryAsync('SELECT * FROM filme')
        res.json({
            sucesso: true,
            dados: filmes,
            total: filmes.length
        })
    } catch (erro) {
        console.error('Erro ao listar filmes: ', erro)
        res.status(500).json({
            sucesso: false,
            mensagem:"Erro ao listar filmes!🎞️",
            erro: erro.message
        })
    }
})

app.get('/filmes/:id', async(req, res) => {
    try {
        const {id} = req.params
        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de filme inválido!"
            })
        }
        const filme = await queryAsync('SELECT * FROM filme WHERE id = ?', [id])
        
        if (filme.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Filme não encontrado!"
            })
        }
        res.json({
            sucesso: true,
            dados: filme [0]
        })
    } catch (erro){
        console.error("Erro ao listar filmes: ", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar filmes!",
            erro: erro.message
        })
    }
})

module.exports = app // Garante que eu consiga acessar o app em outros arquivos, como o server.js