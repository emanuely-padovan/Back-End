const express = require('express')
const router = express.Router()

const produtoRoutes = require('./ProdutoRoutes')
router.use('/api/produtos', produtoRoutes)

module.exports = router