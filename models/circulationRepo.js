const { ObjectId } = require('mongodb');

module.exports = db => {
    return {
        loadData(data) {
        return new Promise(async (resolve, reject) => {
            try {
                const results = await db.collection('newspapers').insertMany(data);
                resolve(results.insertedCount);
            }
            catch (error) {
                reject(error);
            }
        });
        },
        get(query = {}, limit) {
            return new Promise(async (resolve, reject) => {
                try {
                    let items = await db.collection('newspapers').find(query);

                    if (limit !== undefined && !Number.isInteger(limit))
                        reject({ message: 'Valor do limit deve ser um inteiro.' })

                    if (limit > 0)
                        items = items.limit(limit);

                    const totReg = await items.toArray()
                    resolve({ total_records: totReg.length, registers: totReg })
                }
                catch (error) {
                    reject(error);
                }
            })
        },
        getById(id) {
            return new Promise(async (resolve, reject) => {
                try {
                    const items = await db.collection('newspapers').findOne({ _id: ObjectId(id) });
                    resolve(items);
                }
                catch (error) {
                    reject(error);
                }
            })
        },
        add(newItem) {
            return new Promise(async (resolve, reject) => {
                try {
                    const addedItem = await db.collection('newspapers').insertOne(newItem);
                    resolve(addedItem.insertedId);
                }
                catch (error) {
                    reject(error);
                }
            });
        },
        update(id, newItem) {
            return new Promise(async (resolve, reject) => {
                try {
                    const updatedItem = await db.collection('newspapers').findOneAndReplace({ _id: ObjectId(id) }, newItem);
                    resolve(updatedItem.value)
                }
                catch (error) {
                    reject(error);
                }
            });
        },
        remove(id) {
            return new Promise(async (resolve, reject) => {
                try {
                    const removeItem = await db.collection('newspapers').deleteOne({ _id: ObjectId(id) });
                    resolve(removeItem.deletedCount === 1);
                }
                catch (error) {
                    reject(error);
                }
            });
        },
        averageFinalists() {
            return new Promise(async (resolve, reject) => {
                try {
                    const average = await db.collection('newspapers')
                        .aggregate([{
                            $group:
                            {
                                _id: null,
                                avgFinalists: { $avg: "$Pulitzer Prize Winners and Finalists, 1990-2014" }
                            }
                        }]).toArray();

                    resolve(average[0].avgFinalists);
                }
                catch (error) {
                    reject(error);
                }
            })
        },
        averageFinalistsByChange() {
            return new Promise(async (resolve, reject) => {
                try {
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
                }
                catch (error) {
                    reject(error);
                }
            })
        },
        clearDatabase() {
            return new Promise(async (resolve, reject) => {
                try {
                    const clearItems = await db.collection('newspapers').deleteMany({});
                    resolve(clearItems.deletedCount);
                }
                catch (error) {
                    reject(error);
                }
            });
        }
    }
};