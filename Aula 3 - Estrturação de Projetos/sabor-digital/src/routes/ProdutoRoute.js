const express = require('express')
const router = express.Router()

const ProdutoController = require('./controller/ProdutoController')

router.get('/', ProdutoController.listar)
router.get('/:id', ProdutoController.buscarPorID)
router.post('/', ProdutoController.cadastrar)
router.put('/:id', ProdutoController.atualizar)
router.delete('/:id', ProdutoController.deletar)