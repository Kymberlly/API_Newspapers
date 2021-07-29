const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = "mongodb://localhost:27017";
const dbName = 'circulation';

async function main() {
    const client = new MongoClient(url);

    try {
        await client.connect();
        const results = await circulationRepo.loadData(data);
        assert.strictEqual(data.length, results.insertedCount);

        const getData = await circulationRepo.get();
        assert.strictEqual(data.length, getData.length);

        const filterData = await circulationRepo.get({ Newspaper: getData[4].Newspaper });
        assert.deepStrictEqual(filterData[0], getData[4]);

        const limitData = await circulationRepo.get({}, 3);
        assert.deepStrictEqual(3, limitData.length);

        const id = getData[4]._id.toString();
        const byId = await circulationRepo.getById(id);
        assert.deepStrictEqual(getData[4], byId);

        const newItem = {
            "Newspaper": "Globo News do Brasil",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 7,
            "Change in Daily Circulation, 2004-2013": 150,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 1,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 10,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 0
        };

        const idInsertedItem = await circulationRepo.add(newItem);
        assert(idInsertedItem);

        const newItemUpdated = {
            "Newspaper": "TESTE Globo News do Brasil",
            "Daily Circulation, 2004": 1,
            "Daily Circulation, 2013": 7,
            "Change in Daily Circulation, 2004-2013": 150,
            "Pulitzer Prize Winners and Finalists, 1990-2003": 1,
            "Pulitzer Prize Winners and Finalists, 2004-2014": 10,
            "Pulitzer Prize Winners and Finalists, 1990-2014": 0
        };

        const updatedItemId = await circulationRepo.update(idInsertedItem, newItemUpdated);
        const newAddedItemQuery = await circulationRepo.getById(updatedItemId._id);
        assert.strictEqual(newAddedItemQuery.Newspaper, "TESTE Globo News do Brasil");

        const removed = await circulationRepo.remove(updatedItemId._id);
        assert(removed);

        const avgFinalists = await circulationRepo.averageFinalists();
        assert(avgFinalists);

        const avgByChange = await circulationRepo.averageFinalistsByChange();
        assert(avgByChange);

    }
    catch (error) {
        console.log(`Erro ao conectar no banco de dados. Erro: ${error.message}`);
    }
    finally {
        await client.db(dbName).dropDatabase();
        client.close();
    }
}

main();