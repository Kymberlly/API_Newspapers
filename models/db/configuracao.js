const { MongoClient } = require('mongodb');

const url = "mongodb://localhost:27017";
const dbName = 'circulation';


module.exports = async () => {
    const client = new MongoClient(url);

    try{
        const conn = await client.connect();
        const db = client.db(dbName);

        return {conn, db};
    }
    catch(error){
        console.log(`Erro ao realizar a conexão. Erro: ${error}`);
    }
    // finally{
    //     await client.db(dbName).dropDatabase();
    //     client.close();
    // }
    
}