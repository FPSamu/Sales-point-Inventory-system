import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        console.log("Connected to MongoDB!");

        // Specify the database and collection
        const database = client.db(process.env.DB_NAME_MONGO);
        const collection = database.collection('inventario');

        // Perform an operation, e.g., find documents
        const documents = await collection.find({}).toArray();
        console.log("Documents:", documents);

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // Close the connection
        await client.close();
        console.log("Connection closed.");
    }
}

run().catch(console.error);
