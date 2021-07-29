const express = require('express');
const router = require('./controllers/newspapers');

app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/newspapers', router);

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));

// async function main() {
//     try {

//         const id = getData[4]._id.toString();
//         const byId = await circulationRepo.getById(id);
//         assert.deepStrictEqual(getData[4], byId);

//         const newItem = {
//             "Newspaper": "Globo News do Brasil",
//             "Daily Circulation, 2004": 1,
//             "Daily Circulation, 2013": 7,
//             "Change in Daily Circulation, 2004-2013": 150,
//             "Pulitzer Prize Winners and Finalists, 1990-2003": 1,
//             "Pulitzer Prize Winners and Finalists, 2004-2014": 10,
//             "Pulitzer Prize Winners and Finalists, 1990-2014": 0
//         };

//         const idInsertedItem = await circulationRepo.add(newItem);
//         assert(idInsertedItem);

//         const newItemUpdated = {
//             "Newspaper": "TESTE Globo News do Brasil",
//             "Daily Circulation, 2004": 1,
//             "Daily Circulation, 2013": 7,
//             "Change in Daily Circulation, 2004-2013": 150,
//             "Pulitzer Prize Winners and Finalists, 1990-2003": 1,
//             "Pulitzer Prize Winners and Finalists, 2004-2014": 10,
//             "Pulitzer Prize Winners and Finalists, 1990-2014": 0
//         };

//         const updatedItemId = await circulationRepo.update(idInsertedItem, newItemUpdated);
//         const newAddedItemQuery = await circulationRepo.getById(updatedItemId._id);
//         assert.strictEqual(newAddedItemQuery.Newspaper, "TESTE Globo News do Brasil");

//         const removed = await circulationRepo.remove(updatedItemId._id);
//         assert(removed);

//         const avgFinalists = await circulationRepo.averageFinalists();
//         assert(avgFinalists);

//         const avgByChange = await circulationRepo.averageFinalistsByChange();
//         assert(avgByChange);

//     }
//     catch (error) {
//         console.log(`Ocorreu um erro: ${error.message}`);
//     }
// }

// main();