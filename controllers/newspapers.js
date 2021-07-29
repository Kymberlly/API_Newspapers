const { Router } = require('express');
const circulationRepo = require('../repos/circulationRepo');
const router = Router();

// Implementar teste de assertividade
router.get('/', async (_, res) => {
    try {
        const getData = await circulationRepo.get();
        res.json(getData);
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: error.status });
    }
});

router.post('/', async (req, res) => {
    const limit = req.body.limit;

    try {
        const getData = await circulationRepo.get({}, parseInt(limit));
        res.json(getData);
    }
    catch (error) {
        res.status(400).json({ message: error.message, status: error.status });
    }
});

router.get('/:newspaper', async (req, res) => {
    const newspaper = req.params.newspaper;

    try{
        const filterData = await circulationRepo.get({ Newspaper: newspaper });
        res.json(filterData);
    }
    catch(error){
        res.status(400).json({ message: error.message, status: error.status });
    }
});

module.exports = router;