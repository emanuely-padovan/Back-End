
const express = require('express')
const pool = require('./config/database')

const app = express()
app.use(express.json())

const queryAsync = (sql, values = []) => {
    return new Promise ((resolve, reject) => {
        pool.query(sql, values, (err, results) => {
            if(err) reject(err)
            else resolve(results)
        })
    })
}

app.get ('/', (req, res) => {
    res.send('API está funcionando!')
})

app.get('/produtos', async(req, res) => {
    try {
        const produtos = await queryAsync('SELECT * FROM produto ORDER BY id DESC')
        res.json({
            sucesso: true, 
            dados: produtos,
            total: produtos.length
        })
    } catch (error) {
        console.log('Erro ao listar produtos: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar produtos!',
            erro: error.menssage
        })
    }
})

app.get('/produtos/:id', async(req, res) => {
    try {
        const {id} = req.params
        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de produto inválido!"
            })
        }

        const produto = await queryAsync('SELECT * FROM produto WHERE id = ?', [id])

        if (produto.length === 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem:"Produto não encontrado!"
            })
        }

        res.json({
            sucesso: true,
            dados: produto [0]
        })

    } catch (error) {
        console.log('Erro ao listar produtos: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar produtos!',
            erro: error.message
        })
    }
})

app.post('/produtos', async(req, res) => {
    try {
        const {nome, descricao, preco, disponivel} = req.body
        if(!nome || !descricao || !preco || !disponivel) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "Nome, descrição, preço e disponibilidade são itens obrigatórios!"
            })
        }

        if (typeof preco !== 'number' || preco <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "O preço do produto deve ser um número positivo..."
            })
        }

        const novoProduto ={
            nome: nome.trim(),
            descricao: descricao.trim(),
            preco: preco,
            disponivel: disponivel
        }

        const resultado = await queryAsync('INSERT INTO produto SET ?', [novoProduto])
        res.status(201).json({
            sucesso: true, 
            mensagem: 'Produto criado com sucesso!',
            id: resultado.insertId
        })

    } catch (error) {
        console.log('Erro ao criar produto: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao criar produto!',
            erro: error.message
        })
    }
})

app.put('/produtos/:id', async(req, res) => {
    try {
        const {id} = req.params
        const {nome, descricao, preco, disponivel} = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de produto inválido!'
            })
        }

        const produtoExiste = await queryAsync ('SELECT * FROM produto WHERE id = ?', [id])
        if (produtoExiste.length === 0) {
            return res.status(404).json({
                sucesso: false, 
                mensagem:'Produto não encontrado!'
            })
        }

        const produtoAtualizado = {}

        if(nome != undefined) produtoAtualizado.nome = nome.trim()
        if(descricao != undefined) produtoAtualizado.descricao = descricao.trim()
        if(preco != undefined) {
            if (typeof preco != 'number' || preco <= 0)
                return res.status(400).json({
                    sucesso: false,
                    mensagem: 'Preço deve ser uma valor positivo...'
            })
            produtoAtualizado.preco = preco
        }
        if(disponivel != undefined) produtoAtualizado.disponivel = disponivel

        if(Object.keys (produtoAtualizado).length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum campo para atualizar...'
            })
        }

        await queryAsync('UPDATE produto SET ? WHERE id = ?', [produtoAtualizado, id])
        res.json({
            sucesso: true, 
            mensagem: 'Produto atualizado!'
        })
    } catch (error) {
        console.log('Erro ao atualizar produto: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar produto!',
            erro: error.message
        })
    }
})

app.delete('/produtos/:id', async(req, res) => {
    try {
        const {id} = req.params

        if(!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: "ID de produto inválido!"
            })
        }
        
        const produtoExiste = await queryAsync ('SELECT * FROM produto WHERE id = ?', [id])
        if (produtoExiste.length === 0) {
            return res.status(404).json({
                sucesso: false, 
                mensagem: 'Produto não encontrado!'
            })
        }

        await queryAsync ('DELETE FROM produto WHERE id = ?', [id])
        res.json({
            sucesso: true, 
            mensagem: 'Produto foi apagado com sucesso!'
        })
        
    } catch (error) {
        console.log('Erro ao deletar produto: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao deletar produto!',
            erro: error.message
        })
    }
})

module.exports = app