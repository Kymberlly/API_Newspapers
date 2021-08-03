const express = require('express');
const routerNewspaper = require('./controllers/newspapers');
const errosHandler = require('./errors/errorsHandler');
const database = require('./models/db/configuracao');

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

database.then(result => {
    app.use('/newspapers', routerNewspaper(result));
    app.use(errosHandler);

    app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
})
.catch(error => {
    console.log(error);
});
