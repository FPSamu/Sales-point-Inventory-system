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
        const { id, name } = req.query;

        if (!id && (!name || name.trim() === "")) {
            res.status(400).json({ error: "Product ID or name is required" });
            return;
        }

        try {
            // Connect to MongoDB Atlas
            await client.connect();
            console.log("Connected to MongoDB Atlas!");

            const database = client.db(process.env.DB_NAME_MONGO);
            const collection = database.collection('inventario');

            let query = {};
            
            if (id) {
                query = { _id: new ObjectId(id) };
            } else if (name) {
                query = { nombre_producto: { $regex: `^${name.trim()}$`, $options: 'i' } };
            }

            console.log("Executing MongoDB query:", query);

            const result = await collection.findOne(query);

            if (!result) {
                res.status(404).json({ error: "Product not found" });
                return;
            }

            res.status(200).json(result);
        } catch (error) {
            console.error("Error during query:", error.message);
            res.status(500).json({ error: "Failed to query database", details: error.message });
        } finally {
            await client.close();
            console.log("MongoDB connection closed.");
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
