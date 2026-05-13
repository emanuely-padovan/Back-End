const express = require('express')
const router = express.Router()
const PedidoController = require('../controller/PedidoController')

router.get('/', PedidoController.listar)
router.get('/:id', PedidoController.listarPorId)
router.post('/', PedidoController.cadastrar)
router.put('/:id', PedidoController.atualizar)
router.delete('/:id', PedidoController.deletar)

module.exports = router