import dotenv from 'dotenv';
import { MongoClient } from 'mongodb';

dotenv.config();

const client = new MongoClient(process.env.MONGO_URI);

async function run() {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        console.log("Connected to MongoDB!");

        // Specify the database and collections
        const database = client.db(process.env.DB_NAME_MONGO);
        const inventarioCollection = database.collection('inventario');
        const countersCollection = database.collection('counters');

        console.log("Attempting to find or increment sequence...");
        const counterResult = await countersCollection.findOneAndUpdate(
            { _id: 'productId' }, // Filter for the productId counter
            { $inc: { seq: 1 } }, // Increment the sequence by 1
            { returnDocument: 'after', upsert: true } // Create the counter if it doesn't exist
        );

        console.log("Counter result after findOneAndUpdate:", counterResult);


        const doc = await countersCollection.findOne({ _id: 'productId' });
        const productId = doc?.seq;
        console.log("Using productId:", productId);

        // Insert the new product into MongoDB
        const result = await inventarioCollection.insertOne({
            id: parseInt(productId),
            nombre_producto: "producto 1",
            cantidad: 1000,
            precio: 100,
        });

        console.log("Insert result:", result);

        console.log("Documents in the inventario collection:");
        const documents = await inventarioCollection.find({}).toArray();
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
