const { Router } = require('express');
const router = Router();

const circulationDatabase = require('../models/circulationRepo');
const schemaNewspapers = require('./schemaNewspapers');

module.exports = conn => {
    const circulationRepo = circulationDatabase(conn);

    router.get('/', async (_, res) => {
        try {
            const getData = await circulationRepo.get();
            res.json(getData);
        }
        catch (error) {
            res.status(400).json({ message: error.message, status: error.status });
        }
    });

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

    router.get('/avgFinalists', async (req, res) => {
        try{
            const avgFinalists = await circulationRepo.averageFinalists();
            res.json({avgFinalists});
        }
        catch(error){
            res.status(400).json({ mensagem: error.message });
        }
    });

    router.get('/avgByChange', async (req, res) => {
        try{
            const avgByChange = await circulationRepo.averageFinalistsByChange();
            res.json(avgByChange);
        }
        catch(error){
            res.status(400).json({ mensagem: error.message });
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

    router.post('/', async (req, res) => {
        try {
            const newItem = req.body;

            const { error } = schemaNewspapers.validate(newItem);
            if (error)
                throw new Error(error.message);

            const idInsertedItem = await circulationRepo.add(newItem);
            res.json({ _id: idInsertedItem, inserted: idInsertedItem !== undefined });
        }
        catch (error) {
            res.status(400).json({ mensagem: error.message });
        }
    });

    router.put('/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const newItemUpdated = req.body;

            const updatedItemId = await circulationRepo.update(id, newItemUpdated);
            res.json({ updatedItemId });
        }
        catch (error) {
            res.status(400).json({ mensagem: error.message });
        }
    })

    router.delete('/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const removed = await circulationRepo.remove(id);
            res.json({ removed });
        }
        catch (error) {
            res.status(400).json({ mensagem: error.message })
        }
    });

    return router;
}