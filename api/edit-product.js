import { MongoClient } from 'mongodb';

export const config = {
    api: {
        bodyParser: true,
    },
};

// Initialize MongoDB client
const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
    console.log("Request method:", req.method);

    if (req.method === 'POST') {
        const { productId, productName, productPrice, productQuantity } = req.body;

        if (!productId || !productName || !productPrice || !productQuantity) {
            res.status(400).json({ error: "All fields (id, nombre_producto, cantidad, precio) are required" });
            return;
        }

        productName = productName.toUpperCase();

        console.log(productId);
        console.log(productName);
        console.log(productPrice);
        console.log(productQuantity);

        try {
            // Connect to MongoDB Atlas
            await client.connect();
            console.log("Connected to MongoDB Atlas!");

            const database = client.db(process.env.DB_NAME_MONGO);
            const collection = database.collection('inventario');

            // Attempt to update the document in MongoDB
            const result = await collection.updateOne(
                { _id: new MongoClient.ObjectId(productId) }, // Filter by ID
                {
                    $set: {
                        nombre_producto: productName,
                        cantidad: parseInt(productQuantity),
                        precio: parseFloat(productPrice),
                    }
                }
            );

            if (result.matchedCount === 0) {
                res.status(404).json({ error: "Product not found" });
            } else {
                res.status(200).json({ message: "Product updated successfully" });
            }
        } catch (error) {
            console.error("Database query error:", error.message);
            res.status(500).json({ error: 'Failed to update product', details: error.message });
        } finally {
            await client.close();
            console.log("MongoDB connection closed.");
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
