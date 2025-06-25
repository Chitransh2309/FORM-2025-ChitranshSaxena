import { Db, MongoClient } from "mongodb"

export async function connectToDB() {
    const dbClient = new MongoClient(process.env.MONGODB_URI || "")
    await dbClient.connect();
    const db = dbClient.db("FORM-2025");

    return {dbClient, db};
}

export async function disconnectFromDB(dbClient: MongoClient) {
    await dbClient.close();
}