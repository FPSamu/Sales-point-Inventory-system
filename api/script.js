import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

let client;
let db;

async function connectToDatabase() {
    if (!client || !client.isConnected()) {
        console.log('Initializing new MongoDB connection...');
        client = new MongoClient(process.env.MONGO_URI);
        await client.connect();
        db = client.db(process.env.DB_NAME); // Specify the database name
        console.log('Connected to MongoDB');
    } else {
        console.log('Reusing existing MongoDB connection');
    }
    return db;
}

export default async function handler(req, res) {
    try {
        const database = await connectToDatabase();
        const collection = database.collection('inventario'); // Specify the collection

        console.log('Fetching data from MongoDB...');
        const results = await collection.find({}).toArray();

        res.status(200).json(results); // Send the data as a response
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
