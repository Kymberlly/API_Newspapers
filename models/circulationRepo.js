const { ObjectId } = require('mongodb');
const databaseConn = require('./db/configuracao');

module.exports = {
    loadData(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const { conn, db } = await databaseConn();
                const results = await db.collection('newspapers').insertMany(data);

                resolve(results.insertedCount);
                conn.close();
            }
            catch (error) {
                reject(error);
            }
        });
    },
    get(query = {}, limit) {
        return new Promise(async (resolve, reject) => {
            try {
                const { conn, db } = await databaseConn();
                let items = await db.collection('newspapers').find(query);

                if (limit !== undefined && !Number.isInteger(limit))
                    reject({ message: 'Valor do limit deve ser um inteiro.' })

                if (limit > 0)
                    items = items.limit(limit);

                const totReg = await items.toArray()
                resolve({ total_records: totReg.length, registers: totReg })
                conn.close();
            }
            catch (error) {
                reject(error);
            }
        })
    },
    getById(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const { conn, db } = await databaseConn();
                const items = await db.collection('newspapers').findOne({ _id: ObjectId(id) });

                resolve(items);
                conn.close();
            }
            catch (error) {
                reject(error);
            }
        })
    },
    add(newItem) {
        return new Promise(async (resolve, reject) => {
            try {
                const { conn, db } = await databaseConn();
                const addedItem = await db.collection('newspapers').insertOne(newItem);

                resolve(addedItem.insertedId);
                conn.close();
            }
            catch (error) {
                reject(error);
            }
        });
    },
    update(id, newItem) {
        return new Promise(async (resolve, reject) => {
            try {
                const { conn, db } = await databaseConn();
                const updatedItem = await db.collection('newspapers').findOneAndReplace({ _id: ObjectId(id) }, newItem);

                resolve(updatedItem.value)
                conn.close();
            }
            catch (error) {
                reject(error);
            }
        });
    },
    remove(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const { conn, db } = await databaseConn();
                const removeItem = await db.collection('newspapers').deleteOne({ _id: ObjectId(id) });

                resolve(removeItem.deletedCount === 1);
                conn.close();
            }
            catch (error) {
                reject(error);
            }
        });
    },
    averageFinalists() {
        return new Promise(async (resolve, reject) => {
            try {
                const { conn, db } = await databaseConn();

                const average = await db.collection('newspapers')
                    .aggregate([{
                        $group:
                        {
                            _id: null,
                            avgFinalists: { $avg: "$Pulitzer Prize Winners and Finalists, 1990-2014" }
                        }
                    }]).toArray();

                resolve(average[0].avgFinalists);
                conn.close();
            }
            catch (error) {
                reject(error);
            }
        })
    },
    averageFinalistsByChange() {
        return new Promise(async (resolve, reject) => {
            try {
                const { conn, db } = await databaseConn();

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
                conn.close();
            }
            catch (error) {
                reject(error);
            }
        })
    },
    clearDatabase() {
        return new Promise(async (resolve, reject) => {
            try {
                const { conn, db } = await databaseConn();
                const clearItems = await db.collection('newspapers').deleteMany({});

                resolve(clearItems.deletedCount);
                conn.close()
            }
            catch (error) {
                reject(error);
            }
        });
    }
};