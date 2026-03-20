
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

// Continuação: 20/03/2026

app.put('/salas/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {nome, capacidade} = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de sala inválido!"
            })
        }

        const salaExiste = await queryAsync ("SELECT * FROM sala WHERE id = ?", [id])
        if (salaExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Sala não encontrada!"
            })
        }

        const salaAtualizada = {}

        if (nome !== undefined) salaAtualizada.nome = nome.trim()
        if (capacidade !== undefined) {
            if (typeof capacidade !== 'number'|| capacidade <= 0 )
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "Capacidade deve ser um número positivo..."
            })
            salaAtualizada.capacidade = capacidade
        }

        if (Object.keys (salaAtualizada).length === 0) {
            return res.status(400).json({
                sucesso: false, 
                mensagem: "Nenhum campo para atualizar..."
            })
        }

        await queryAsync ("UPDATE sala SET ? WHERE id = ?", [salaAtualizada, id])
        res.json({
            sucesso: true, 
            mensagem: "Sala atualizada!"
        })
    } catch (erro){
        console.error("Erro ao atualizar sala: ", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao atualizar sala!",
            erro: erro.message
        })
    }
})

app.delete('/salas/:id', async(req, res) => {
    try {
        const {id}= req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de sala inválido!"
            })
        }

        const salaExiste = await queryAsync ("SELECT * FROM sala WHERE id = ?", [id])
        if (salaExiste.length === 0) { 
            return res.status(404).json({
                sucesso: false,
                mensagem: "Sala não encontrado!"
            })
        }

        await queryAsync ("DELETE FROM sala WHERE id = ?", [id])
        res.json({
            sucesso: true,
            mensagem: "Sala foi apagado com sucesso!🎉"
        })
    } catch (erro) {
        console.error("Erro ao deletar o sala: ", erro)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao deletar o sala!",
            erro: erro.message
        })        
    }
})

app.get('/sessoes', async(req, res) => {
    try {
        const sessoes = await queryAsync('SELECT * FROM sessao')
        res.json({
            sucesso: true, 
            dados: sessoes,
            total: sessoes.length
        })
    } catch (error) {
        console.log('Erro ao listar sessões: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao listar sessões!",
            erro: error.message
        })
    }
})

app.get('/sessoes/:id', async(req, res) => {
    try {
        const {id} = req.params
        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de sessão inválido!"
            })
        }
        const sessao = await queryAsync('SELECT * FROM sessao WHERE id = ?', [id])

        if (sessao.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Sessão não encontrada!"
            })
        }
        res.json({
            sucesso: true, 
            dados: sessao [0]
        })
    } catch (error) {
        console.log("Erro ao listar as sessões: ", error)
        res.status(500).json ({
            sucesso: false,
            mensagem: "Erro ao listar sessões!",
            erro: error.message
        })
    }
})

// Continuação do POST e PUT: 
app.post('/sessoes', async(req, res) => {
    try {
        const {filme_id, sala_id, data_hora, preco} = req.body
        if (!filme_id || !sala_id || !data_hora || !preco) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Informações da sala/filme, horário e preço são itens obrigatórios!"
            })
        }

        if (filme_id !== undefined){
            if(isNaN(filme_id)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "ID de filme não existe!"
                })
            }
        }
        if(await queryAsync("SELECT * FROM filme WHERE id = ?", [filme_id]).length == 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: "Erro ao procurar ID!"
            })
        }

        if (sala_id !== undefined){
            if(isNaN(sala_id)) {
                return res.status(400).json({
                    sucesso: false,
                    mensagem: "ID de sala não existe!"
                })
            }
        }
        if(await queryAsync("SELECT * FROM sala WHERE id = ?", [sala_id]).length == 0) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: "Erro ao procurar ID!"
            })
        }

        const novaSessao = {
            filme_id: filme_id,
            sala_id: sala_id,
            data_hora: data_hora,
            preco: preco
        }

        const resultado = await queryAsync ("INSERT INTO sessao SET ?", [novaSessao])
        res.status(201).json({
            sucesso: true, 
            mensagem:"Sessão criada com sucesso!",
            id: resultado.insertId
        })
    } catch (error) {
        console.log("Erro ao adicionar sessões: ", error)
        res.status(500).json ({
            sucesso: false,
            mensagem: "Erro ao adicionar sessões!",
            erro: error.message
        })
    }
})



app.delete('/sessoes/:id', async(req, res) => {
    try {
        const {id} = req.params

        if (!id ||isNaN(id)) {
            return res.status(400).json ({
                sucesso: false,
                mensagem: "ID de sessão inválido!"
            })
        }

        const sessaoExiste = await queryAsync ("SELECT * FROM sessao WHERE id = ?", [id])
        if(sessaoExiste.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: "Sessão não encontrada!"
            })
        }
        await queryAsync ("DELETE FROM sessao WHERE id = ?", [id])
        res.json({
            sucesso: true, 
            mensagem: "Sessão foi apagada com sucesso!"
        })
    } catch (error) {
        console.log("Erro ao deletar a sessão: ", error)
        res.status(500).json({
            sucesso: false,
            mensagem: "Erro ao deletar a sessão!",
            erro: error.message
        })
    }
})

// Continuação do Projeto: 

module.exports = app