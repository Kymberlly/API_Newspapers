const express = require('express');
const app = express();

app.use((req, res, next) => {
    const erro = new Error('Página não encontrada!');
    erro.status = 404;
    next(erro);
});

app.use((erro, req, res, next) => {
    res.status(erro.status || 500).send({mensagem: erro.message, status: erro.status});
});

module.exports = app;