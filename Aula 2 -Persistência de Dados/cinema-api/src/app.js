
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

// Continuação do CRUD - 06/03
app.post('/filmes', async(req, res) => {
    try {
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body
        if (!titulo || !genero || !duracao) { // Obs.: || titulo !== ' '
            return res.status(400).json({
                sucesso: false,
                mensagem: "Título, gênero e duração são itens obrigatórios!"
            })
        }

        if (typeof duracao !== 'number' || duracao <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "A duração do filme deve ser um número positivo..."
            })
        }

        const novoFilme = {
            titulo: titulo.trim(),
            genero: genero.trim(),
            duracao: duracao,
            classificacao: classificacao || null,
            data_lancamento: data_lancamento || null
        }

        const resultado = await queryAsync ("INSERT INTO filme SET ?", [novoFilme]) // Atribuição de valores
        res.status(201).json({
            sucesso: true, 
            mensagem: "Filme criado com sucesso!",
            id: resultado.insertId
        })
    } catch (erro) {
        console.error("Erro ao inserir filme: ", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao inserir filme!",
            erro: erro.message
        })
    }
})

app.put('/filmes/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de filme inválido!"
            })
        }

        const filmeExiste = await queryAsync ("SELECT * FROM filme WHERE id = ?", [id])
        if (filmeExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Filme não encontrado!"
            })
        }

        const filmeAtualizado = {}

        if (titulo !== undefined) filmeAtualizado.titulo = titulo.trim()
        if (genero !== undefined) filmeAtualizado.genero = genero.trim()
        if (duracao !== undefined) {
            if (typeof duracao !== 'number'|| duracao <= 0 )
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Duração deve ser um número positivo..."
            })
            filmeAtualizado.duracao = duracao
        }
        if (classificacao !== undefined) filmeAtualizado.classificacao = classificacao.trim()
        if (data_lancamento !== undefined) filmeAtualizado.data_lancamento = data_lancamento.trim()

        if (Object.keys (filmeAtualizado).length === 0) {
            return res.status(400).json({
                sucesso: false, 
                mensagem: "Nenhum campo para atualizar..."
            })
        }

        await queryAsync ("UPDATE filme SET ? WHERE id = ?", [filmeAtualizado, id])
        res.json({
            sucesso: true, 
            mensagem: "Filme atualizado!"
        })
    } catch (erro){
        console.error("Erro ao atualizar filme: ", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao atualizar filme!",
            erro: erro.message
        })
    }
})

app.delete('/filmes/:id', async(req, res) => {
    try {
        const {id}= req.params // Encontrar o Id do filme que eu quero apagar

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de filme inválido!"
            })
        }

        const filmeExiste = await queryAsync ("SELECT * FROM filme WHERE id = ?", [id])
        if (filmeExiste.length === 0) { // A busca não retornou em nada...
            return res.status(404).json({
                sucesso: false,
                mensagem: "Filme não encontrado!"
            })
        }

        await queryAsync ("DELETE FROM filme WHERE id = ?", [id])
        res.json({
            sucesso: true,
            mensagem: "Filme foi apagado com sucesso!🎉"
        })
    } catch (erro) {
        console.error("Erro ao deletar o filme: ", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao deletar o filme!",
            erro: erro.message
        })        
    }
})

// Salas - Início: 06/03

app.get('/salas', async(req, res) => {
    // TryCatch:
    try {
        const salas = await queryAsync('SELECT * FROM sala')
        res.json({
            sucesso: true,
            dados: salas,
            total: salas.length
        })
    } catch (erro) {
        console.error('Erro ao listar salas: ', erro)
        res.status(500).json({
            sucesso: false,
            mensagem:"Erro ao listar salas!",
            erro: erro.message
        })
    }
})

app.get('/salas/:id', async(req, res) => {
    try {
        const {id} = req.params
        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de sala inválido!"
            })
        }
        const sala = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])
        
        if (sala.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Sala não encontrada!"
            })
        }
        res.json({
            sucesso: true,
            dados: sala [0]
        })
    } catch (erro){
        console.error("Erro ao listar salas: ", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar salas!",
            erro: erro.message
        })
    }
})

app.post('/salas', async(req, res) => {
    try {
        const {nome, capacidade} = req.body
        if (!nome || !capacidade) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nome e capacidade são itens obrigatórios!"
            })
        }

        if (typeof capacidade !== 'number' || capacidade <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "A capacidade da sala deve ser um número positivo..."
            })
        }

        const novaSala = {
            nome: nome.trim(),
            capacidade: capacidade || null,
        }

        const resultado = await queryAsync ("INSERT INTO sala SET ?", [novaSala])
        res.status(201).json({
            sucesso: true, 
            mensagem: "Sala criada com sucesso!",
            id: resultado.insertId
        })
    } catch (erro) {
        console.error("Erro ao inserir salas: ", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao inserir salas!",
            erro: erro.message
        })
    }
})

// Continuação: 
app.put('/salas/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {titulo, genero, duracao, classificacao, data_lancamento} = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de filme inválido!"
            })
        }

        const filmeExiste = await queryAsync ("SELECT * FROM filme WHERE id = ?", [id])
        if (filmeExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Filme não encontrado!"
            })
        }

        const filmeAtualizado = {}

        if (titulo !== undefined) filmeAtualizado.titulo = titulo.trim()
        if (genero !== undefined) filmeAtualizado.genero = genero.trim()
        if (duracao !== undefined) {
            if (typeof duracao !== 'number'|| duracao <= 0 )
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Duração deve ser um número positivo..."
            })
            filmeAtualizado.duracao = duracao
        }
        if (classificacao !== undefined) filmeAtualizado.classificacao = classificacao.trim()
        if (data_lancamento !== undefined) filmeAtualizado.data_lancamento = data_lancamento.trim()

        if (Object.keys (filmeAtualizado).length === 0) {
            return res.status(400).json({
                sucesso: false, 
                mensagem: "Nenhum campo para atualizar..."
            })
        }

        await queryAsync ("UPDATE filme SET ? WHERE id = ?", [filmeAtualizado, id])
        res.json({
            sucesso: true, 
            mensagem: "Filme atualizado!"
        })
    } catch (erro){
        console.error("Erro ao atualizar filme: ", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao atualizar filme!",
            erro: erro.message
        })
    }
})

app.delete('/salas/:id', async(req, res) => {
    try {
        const {id}= req.params // Encontrar o Id do filme que eu quero apagar

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de filme inválido!"
            })
        }

        const filmeExiste = await queryAsync ("SELECT * FROM filme WHERE id = ?", [id])
        if (filmeExiste.length === 0) { // A busca não retornou em nada...
            return res.status(404).json({
                sucesso: false,
                mensagem: "Filme não encontrado!"
            })
        }

        await queryAsync ("DELETE FROM filme WHERE id = ?", [id])
        res.json({
            sucesso: true,
            mensagem: "Filme foi apagado com sucesso!🎉"
        })
    } catch (erro) {
        console.error("Erro ao deletar o filme: ", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao deletar o filme!",
            erro: erro.message
        })        
    }
})

module.exports = app // Garante que eu consiga acessar o app em outros arquivos, como o server.js