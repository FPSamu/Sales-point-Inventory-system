import { MongoClient, ObjectId } from 'mongodb';

const client = new MongoClient(process.env.MONGO_URI);

export const config = {
    api: {
        bodyParser: true,
    },
};

export default async function handler(req, res) {
    console.log("Request method:", req.method);

    if (req.method === "POST") {
        const { productId, productName } = req.body;

        if (!productId) {
            res.status(400).json({ error: "Product ID is required" });
            return;
        }

        try {
            // Connect to MongoDB Atlas
            await client.connect();
            console.log("Connected to MongoDB Atlas!");

            const database = client.db(process.env.DB_NAME_MONGO);
            const collection = database.collection('inventario');

            // Attempt to delete the product by its _id
            const deleteResult = await collection.deleteOne({ _id: new ObjectId(productId) });

            if (deleteResult.deletedCount === 0) {
                res.status(404).json({ error: "Product not found" });
                return;
            }

            res.status(200).json({ message: "Product removed successfully" });
        } catch (error) {
            console.error("Error during deletion:", error.message);
            res.status(500).json({ error: "Failed to remove product", details: error.message });
        } finally {
            await client.close();
            console.log("MongoDB connection closed.");
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
