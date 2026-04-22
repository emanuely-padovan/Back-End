// NOME: Emanuely Macedo Padovan
// DATA: 17/04/2026

// Exercício 1

app.get('/usuarios', async (req, res) => {
    try {
        const buscarUsuarios = await queryAsync("SELECT * FROM usuario")
        res.json({
            sucesso: true,
            dados: buscarUsuarios,
            total: buscarUsuarios.length
        })
    } catch (error) {
        console.log('Erro ao listar os usuários: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar os usuários!',
            erro: error.message
        })
    }
})

app.get('/usuarios/:id', async (req, res) => {
    try {
        const {id} = req.params

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID de usuário inválido!'
            })
        }

        const buscarUsuarioId = await queryAsync('SELECT * FROM usuario WHERE id = ?', [id])

        if(buscarUsuarioId.length == 0) {
            return res.status(404).json({
                sucesso: false,
                mensagem: 'Erro ao encontrar usuário!'
            })
        }

        res.json({
            sucesso: true,
            dados: buscarUsuarioId[0]
        })

    } catch (error) {
        console.log('Erro ao listar os usuários pelo ID: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar os usuários pelo ID!',
            erro: error.message
        })
    }
})

// Exercício 2

app.post('/pedidos', async (req, res) => {
    try {
        const {nomeCliente, valorPagamento} = req.body
        if (!nomeCliente || !valorPagamento) {
            return res.status(400).json({
                sucesso: false, 
                mensagem: 'O nome e o valor a pagar são itens obrigatórios!'
            })
        }

        if (typeof valorPagamento !== 'number' || valorPagamento <= 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'O valor do pedido deve ser um valor positivo.'
            })
        }

        const novoPedido = {
            nomeCliente: nomeCliente.trim(),
            valorPagamento: valorPagamento
        }

        const criarNovoPedido = await queryAsync('INSERT INTO pedido SET ?', [novoPedido])
        res.status(201).json({
            sucesso: true,
            mensagem: 'O pedido foi registrado com sucesso!',
            id: criarNovoPedido.insertId
        })

    } catch (error) {
        console.log('Erro ao inserir um pedido: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao inserir um pedido!',
            erro: error.message
        })
    }
})

// Exercício 3

app.put('/salas/:id', async (req, res) => {
    try {
        const {id} = req.params
        const {filmeExibicao, numeroAssentos} = req.body

        if (!id || isNaN(id)) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'ID da sala inválido!'
            })
        }

        const salaExistente = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])

        if (salaExistente.length == 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: 'A sala não foi encontrada!'
            })
        }

        const salaAtualizada = {}

        if(filmeExibicao != undefined) salaAtualizada.filmeExibicao = filmeExibicao.trim()
        if(numeroAssentos != undefined) salaAtualizada.numeroAssentos = numeroAssentos

        if(Object.keys (salaAtualizada).length == 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum campo para atualizar!'
            })
        }

        await queryAsync("UPDATE sala SET ? WHERE id = ?", [salaAtualizada, id])

        res.json({
            sucesso: true,
            mensagem:'Sala atualizada com sucesso!'
        })

    } catch (error) {
        console.log('Erro ao atualizar a sala: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar a sala!',
            erro: error.message
        })
    }
})

app.delete('/salas/:id', async (req, res) => {
    try {
        const {id}= req.params

        if(!id || isNaN(id)) {
            return res.satus(400).json({
                sucesso: false,
                mensagem:'ID da sala inválido!'
            })
        }

        const salaExistente = await queryAsync("SELECT * FROM sala WHERE id = ?", [id])

        if (salaExistente.length == 0) {
            return res.status(404).json ({
                sucesso: false,
                mensagem: 'A sala não foi encontrada!'
            })
        }

        await queryAsync("DELETE FROM sala WHERE id = ?", [id])

        res.json({
            sucesso: true,
            mensagem: 'A sala foi apagada com sucesso!'
        })
    } catch (error) {
        console.log('Erro ao deletar sala: ', error)
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao deletar sala!',
            erro: error.message
        })
    }
})
