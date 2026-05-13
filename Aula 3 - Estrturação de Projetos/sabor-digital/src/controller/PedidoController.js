const PedidoService = require('../services/PedidoService')

class PedidoController {
    async listar(req, res) {
        try {
            const pedidos = await PedidoService.listarPedidos()
            res.json(pedidos)
        } catch (erro) {
            res.status(500).json ({
                sucesso: false,
                mensagem: erro.mensagem || 'Erro interno do servidor.',
                erro: erro
            })
        }
    }

    async listarPorId(req, res) {}
    async cadastrar(req, res) {
        try {
            const pedido = await PedidoService.criarPedido(req.body)
            res.status(201).json ({
                mensagem: 'Pedido criado com sucesso.',
                pedido
            })
        } catch (erro) {
            
        }
    }
    async atualizar(req, res) {}
    async deletar(req, res) {}
}