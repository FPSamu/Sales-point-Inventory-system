import { parse } from 'dotenv';
import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(req, res) {
    console.log("Request method:", req.method);

    if (req.method === "GET") {
        const { id } = req.query;

        try {
            // Connect to MongoDB Atlas
            await client.connect();
            console.log("Connected to MongoDB Atlas!");

            const database = client.db(process.env.DB_NAME_MONGO);
            const collection = database.collection('inventario');

            // Query the database for the given ID
            const result = await collection.findOne({ id: parseInt(id, 10) });

            res.status(200).json(result);
        } catch (error) {
            console.error("Error fetching data:", error.message);
            res.status(500).json({ error: "Database query failed", details: error.message });
        } finally {
            await client.close();
            console.log("MongoDB connection closed.");
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
