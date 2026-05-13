// NOME: Emanuely Macedo Padovan
// DATA: 29/04/2026

const validarExistencia = (resultado, res, tipo) => {
    if (resultado.length === 0) {
        res.status(404).json({
            sucesso: false,
            mensagem: `${tipo} não foi encontrado.`
        })
        return false
    }
    return true
}

app.put('/produto/:id', async (req, res) => {
    try {
        const {id} = req.params
        const dados = req.body

        const buscarProduto = await queryAsync('SELECT * FROM produto WHERE id = ?', [id])

        if(!validarExistencia(buscarProduto, res, "Produto")) {
            return
        }

        if (Object.keys(dados).length === 0) {
            return res.status(400).json({
                sucesso: false,
                mensagem: 'Nenhum dado enviado.'
            })
        }

        await queryAsync("UPDATE * FROM produtos SET ? WHERE id = ?", [buscarProduto, id])

        res.json({
            sucesso: true,
            mensagem: 'Os dados foram atualizados com sucesso.'
        })
    } catch (error) {
        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao atualizar produto.',
            erro: error.message
        })
    }
})