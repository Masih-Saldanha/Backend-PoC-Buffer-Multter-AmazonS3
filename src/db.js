import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

let db;
const mongoClient = new MongoClient(process.env.MONGO_URI);
try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.DATABASE);
    console.log("Conectado ao Banco de Dados!");
} catch (error) {
    console.log("Não foi possível se conectar ao Banco de Dados!", error);
}

export default db;