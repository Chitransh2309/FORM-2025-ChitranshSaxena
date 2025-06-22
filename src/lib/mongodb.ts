import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "";
const dbName = process.env.MONGODB_DB || "questions"; // fallback

let cachedClient: MongoClient | null = null;

export async function connectToDB() {
  if (!uri) throw new Error("MONGODB_URI not defined in .env.local");

  const dbClient = cachedClient || new MongoClient(uri);
  if (!cachedClient) {
    await dbClient.connect();
    cachedClient = dbClient;
  }

  const db = dbClient.db(dbName);
  return { dbClient, db };
}

export async function disconnectFromDB(dbClient: MongoClient) {
  if (dbClient && dbClient !== cachedClient) {
    await dbClient.close();
  }
}
