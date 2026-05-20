// NOME: Emanuely Macedo Padovan
// DATA: 17/04/2026

// Exercício 1

const validarExistencia = (resultado, res, tipo) => {
    if (resultado.length === 0) {
        res.status(404).json({
            sucesso: false,
            mensagem: `${tipo} não foi encontrado!`
        })
        return false // Interrompe a execução do GET
    }
    return true
}

app.get('/usuarios', async (req, res) => {
    try {
        const buscarUsuarios = await queryAsync("SELECT * FROM usuario")
        res.status(202).json({
            sucesso: true,
            dados: buscarUsuarios,
            total: buscarUsuarios.length
        })
    } catch (error) {
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
        const usuario = await queryAsync('SELECT * FROM usuario WHERE id = ?', [id])

        if (!validarExistencia(usuario, res, "Usuário")) { // Inverte o FALSE para TRUE e TRUE para FALSE 
            return
        }

        res.status(200).json ({
            sucesso: true,
            dados: usuario[0]
        })
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao listar os usuários pelo ID!',
            erro: error.message
        })
    }
})

// Exercício 2

const validarDados = ({cliente, valor}) => {
    if(!cliente || !valor) {
        return "Cliente e valor são obrigatórios."
    }
    if(typeof valor !== 'Number' || valor <= 0) {
        return 'Valor inválido'
    }
    return null
}

app.post('/pedidos', async (req, res) => {
    try {
        const erro = validarDados(req.body)
        if (erro) {
            return res.status(400).json({
                sucesso: false,
                mensagem: erro
            })
        }

        await queryAsync('INSERT INTO pedido SET ?', [req.body])
        res.status(201).json({
            sucesso: true,
            mensagem: "Pedido cadastrado."
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
        const dados = req.body
        const sala = await queryAsync('SELECT * FROM sala WHERE id = ?', [id])

        if(!validarExistencia(sala, res, "Sala")) {
            return
        }

        // Verifica se os dados foram preenchidos (o 0 verifica se tem dados vazio)
        if(Object.keys(dados).length === 0) { // Existe na BODY?
            return res.status(400).json({
                sucesso: false, 
                mensagem: "Nenhum dado enviado!"
            })
        }

        // Não é necessário dos STATUS, ele serve para o tratamento do Back-End não para o usuário?
        res.json({
            sucesso: true,
            mensagem: "Os dados foram atualizados com sucesso."
        })
    } catch (error) {
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
        const sala = await queryAsync("SELECT * FROM sala WHERE id = ?", [id])
        
        if(!validarExistencia(sala, res, "Sala")) { // Existe no BANCO?
            return
        }

        await queryAsync("DELETE FROM sala WHERE id = ?", [id])

        res.status(200).json({
            sucesso: true,
            mensagem: 'A sala foi apagada com sucesso!'
        })
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao deletar sala!',
            erro: error.message
        })
    }
})
