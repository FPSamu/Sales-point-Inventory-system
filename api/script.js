import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

// Initialize the MongoDB client outside the function to enable connection reuse
let client;
let clientPromise;

if (!client) {
    client = new MongoClient(process.env.MONGO_URI);
    clientPromise = client.connect();
}

export default async function handler(req, res) {
    try {
        // Wait for the client to connect
        await clientPromise;

        console.log("Connected to MongoDB!");

        // Access the database and collection
        const database = client.db(process.env.DB_NAME);
        const collection = database.collection('inventario');

        // Fetch documents from the collection
        const documents = await collection.find({}).toArray();
        console.log("Documents fetched:", documents);

        // Send the fetched documents as the response
        res.status(200).json(documents);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
