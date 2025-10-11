import { MongoClient } from "mongodb";

export default async function connectDB() {
  const client = new MongoClient("mongodb://localhost:27017/storageApp");

  await client.connect();
  console.log("Connected to MongoDB");
  const db = client.db("storageApp");
  return db;
}
