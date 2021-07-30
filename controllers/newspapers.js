const { Router } = require('express');
const router = Router();

const circulationRepo = require('../models/circulationRepo');
const schemaNewspapers = require('./schemaNewspapers');

router.get('/', async (_, res) => {
    try {
        const getData = await circulationRepo.get();
        res.json(getData);
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: error.status });
    }
});

router.post('/carga', async (_, res) => {
    try {
        const data = require('../circulation.json');
        const loadData = await circulationRepo.loadData(data);

        res.json({ mensagem: `Foram inseridos o total de ${loadData} registros no banco de dados.` });
    }
    catch (error) {
        res.status(400).json({ mensagem: error.message })
    }

});

router.post('/limpar', async (_, res) => {
    try {
        const removeData = await circulationRepo.clearDatabase();
        res.json({ message: `Total de registros removidos: ${removeData}` });
    }
    catch (error) {
        res.status(400).json({ mensagem: error.message });
    }
})

router.get('/search/:newspaper', async (req, res) => {
    const newspaper = req.params.newspaper;
    try {
        const filterData = await circulationRepo.get({ Newspaper: { $regex: newspaper } });
        res.json(filterData);
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: error.status });
    }
});

router.post('/', async (req, res) => {
    try {
        const newItem = req.body;

        const { error } = schemaNewspapers.validate(newItem);
         if(error)
             throw new Error(error.message);

        const idInsertedItem = await circulationRepo.add(newItem);
        res.json({ id_inserted: idInsertedItem });
    }
    catch (error) {
        res.status(400).json({ mensagem: error.message });
    }
});

module.exports = router;