const express = require('express');
const routes = require('./routes');

const cors = require('cors');
const app = express();

const path = require('path');
app.use(
    '/uploads',
    express.static(
        path.resolve('uploads')
    )
);

// Middlewares globais
app.use(cors()); // Habilita o CORS para permitir requisições do frontend
app.use(express.json());

// Registro de todas as rotas da API centralizadas
app.use('/', routes);

module.exports = app;