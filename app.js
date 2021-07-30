const express = require('express');
const router = require('./controllers/newspapers');
const errosHandler = require('./errors/errorsHandler');

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/newspapers', router);
app.use(errosHandler)

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));