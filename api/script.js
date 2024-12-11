import dotenv from 'dotenv'; // Import dotenv for environment variables
import express from 'express'; // Import Express
import cors from 'cors';
import { MongoClient } from 'mongodb'; // Import MongoDB client

dotenv.config();

const app = express();

app.use(cors());

const uri = process.env.MONGO_URI; // MongoDB connection string from environment variables
const dbName = process.env.DB_NAME; // Database name from environment variables

async function fetchData() {
  console.log('Connecting to MongoDB...'); // Log the start of the connection
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
      await client.connect();
      console.log('Connected to MongoDB');
      const database = client.db(dbName);
      const collection = database.collection('inventario');

      console.log('Fetching data...');
      const results = await collection.find({}).toArray();
      console.log('Fetched data:', results);

      return results;
  } catch (error) {
      console.error('Error occurred:', error);
  }
}

fetchData();


app.get('/data', async (req, res) => {
  try {
    const results = await getDataFromMongoDB();
    res.status(200).json(results); // Send the data as JSON
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Failed to fetch data', details: err.message });
  }
});
