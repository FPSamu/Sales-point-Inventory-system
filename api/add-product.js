import { MongoClient } from 'mongodb';

// Connect to MongoDB Atlas using connection string from environment variables
const client = new MongoClient(process.env.MONGO_URI);

export default async function handler(req, res) {
    if (req.method === 'POST') {
        let { productName, productPrice, productQuantity } = req.body;

        if (!productName || !productPrice || !productQuantity) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        productName = productName.toUpperCase();

        try {
            // Connect to MongoDB
            await client.connect();
            console.log("Connected to MongoDB Atlas!");

            // Select database and collection
            const database = client.db(process.env.DB_NAME_MONGO);
            const inventarioCollection = database.collection('inventario');
            const countersCollection = database.collection('counters');

            const counterResult = await countersCollection.findOneAndUpdate(
                { _id: 'productId' }, // Filter for the productId counter
                { $inc: { seq: 1 } }, // Increment the sequence by 1
                { returnDocument: 'after', upsert: true } // Create the counter if it doesn't exist
            );

            const doc = await countersCollection.findOne({ _id: 'productId' });
            const productId = doc?.seq; // Extract the auto-incremented ID value

            // Insert the new product into MongoDB
            const result = await inventarioCollection.insertOne({
                id: parseInt(productId),
                nombre_producto: productName,
                cantidad: parseInt(productQuantity),
                precio: parseFloat(productPrice),
            });

            res.status(200).json({ 
                message: 'Product added successfully',
                id: productId
            });
        } catch (error) {
            console.error('Database insert error:', error);
            res.status(500).json({ error: 'Database insert error', details: error.message });
        } finally {
            // Always close the connection
            await client.close();
            console.log("MongoDB connection closed.");
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
