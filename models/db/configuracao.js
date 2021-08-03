require('dotenv/config')
const { MongoClient } = require('mongodb');

module.exports = new Promise(async (resolve, reject) => {
    const client = new MongoClient(process.env.URL);

    try{
        await client.connect()
        const db = client.db(process.env.DATABASE);
        resolve(db);
    }
    catch(error){
        reject(`Erro ao realizar a conexão. Erro: ${error}`);
        client.close();
    }
});
