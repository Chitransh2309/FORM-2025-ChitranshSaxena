import { Db, MongoClient } from "mongodb"

export async function connectToDB() {
    const dbClient = new MongoClient(process.env.MONGODB_URI || "mongodb+srv://dv:dvdv@mern-sustainability.ns4xq.mongodb.net/?retryWrites=true&w=majority&appName=Mern-Sustainability")
    await dbClient.connect();
    const db = dbClient.db("FORM-2025");

    return {dbClient, db};
}

export async function disconnectFromDB(dbClient: MongoClient) {
    await dbClient.close();
}