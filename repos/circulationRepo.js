const { MongoClient, ObjectId } = require('mongodb');

const url = "mongodb://localhost:27017";
const dbName = 'circulation';

const funcsRepo = {
    loadData(data) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                results = await db.collection('newspapers').insertMany(data);
                resolve(results);
                client.close();
            }
            catch (error) {
                reject(error);
            }

        });
    },
    get(query = {}, limit) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);

                let items = await db.collection('newspapers').find(query);

                if (limit > 0)
                    items = items.limit(limit);

                resolve(await items.toArray())
                client.close();
            }
            catch (error) {
                reject(error);
            }
        })
    },
    getById(id) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);

                const items = await db.collection('newspapers').findOne({ _id: ObjectId(id) });

                resolve(items)
                client.close();
            }
            catch (error) {
                reject(error);
            }
        })
    },
    add(newItem) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);

                const addedItem = await db.collection('newspapers').insertOne(newItem);

                resolve(addedItem.insertedId);
                client.close();
            }
            catch (error) {
                reject(error);
            }
        });
    },
    update(id, newItem) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);

                const updatedItem = await db.collection('newspapers').findOneAndReplace({ _id: ObjectId(id) }, newItem);

                resolve(updatedItem.value)
                client.close();
            }
            catch (error) {
                reject(error);
            }
        });
    },
    remove(id) {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);

                const removeItem = await db.collection('newspapers').deleteOne({ _id: ObjectId(id) });

                resolve(removeItem.deletedCount === 1);
                client.close();
            }
            catch (error) {
                reject(error);
            }
        });
    },
    averageFinalists() {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                const average = await db.collection('newspapers')
                    .aggregate([{
                        $group:
                        {
                            _id: null,
                            avgFinalists: { $avg: "$Pulitzer Prize Winners and Finalists, 1990-2014" }
                        }
                    }]).toArray();

                resolve(average[0].avgFinalists);
                client.close();
            }
            catch (error) {
                reject(error);
            }
        })
    },
    averageFinalistsByChange() {
        return new Promise(async (resolve, reject) => {
            const client = new MongoClient(url);
            try {
                await client.connect();
                const db = client.db(dbName);

                const average = await db.collection('newspapers')
                    .aggregate([
                        {
                            $project: {
                                "Newspaper": 1,
                                "Pulitzer Prize Winners and Finalists, 1990-2014": 1,
                                "Change in Daily Circulation, 2004-2013": 1,
                                overallChange: {
                                    $cond: {
                                        if: {
                                            $gte: ["$Change in Daily Circulation, 2004-2013", 0]
                                        },
                                        then: "positive",
                                        else: "negative"
                                    }
                                }
                            }
                        },
                        {
                            $group: {
                                _id: "$overallChange",
                                avgFinalists: { $avg: "$Pulitzer Prize Winners and Finalists, 1990-2014" }
                            }
                        }
                    ]).toArray();

                resolve(average);
                client.close();
            }
            catch (error) {
                reject(error);
            }
        })
    }
};

module.exports = funcsRepo