const express = require('express')
const router = express.Router()

const animalRoutes = require('./AnimalRoutes')

router.get('/', (req, res) => {
    res.json({
        mensagem: "API funcionando!",
        versao: "1.0.0",
        arquitetura: "MVC + SOLID"
    })
})

router.use('/api/animais', animalRoutes)

module.exports = router