import dotenv from 'dotenv'; // Import dotenv for environment variables
import mysql from 'mysql2'; // Import MySQL
import express from 'express'; // Import Express
import cors from 'cors';


dotenv.config();

export default function handler(req, res) {
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  connection.connect(err => {
    if (err) {
      console.error('Database connection failed:', err);
      res.status(500).json({ error: 'Database connection failed', details: err.message });
      return;
    }

    const query = 'SELECT * FROM inventario';
    connection.query(query, (err, results) => {
      connection.end(); // Close connection
      if (err) {
        console.error('Query failed:', err);
        res.status(500).json({ error: 'Query failed', details: err.message });
        return;
      }
      res.status(200).json(results);
    });
  });
}

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

app.get('/data', (req, res) => {
  console.log('GET /data route was called');
  const query = 'SELECT * FROM inventario'; // Replace with your actual table name

  connection.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err); // Log the exact error
      res.status(500).json({ error: 'Database query failed', details: err.message });
      return;
    }
    console.log('Query results:', results); // Log results for debugging
    res.json(results);
  });

  app.post('/add-product', (req, res) => {
    const { productName, productPrice, productQuantity } = req.body;
  
    // Validate the input
    if (!productName || !productPrice || !productQuantity) {
      res.status(400).json({ error: 'All fields are required' });
      return;
    }
  
    const query = 'INSERT INTO inventario (nombre_producto, cantidad, precio) VALUES (?, ?, ?)';
    const values = [productName, productQuantity, productPrice];
  
    connection.query(query, values, (err, results) => {
      if (err) {
        console.error('Database insert error:', err);
        res.status(500).json({ error: 'Failed to add product', details: err.message });
        return;
      }
      res.status(200).json({ message: 'Product added successfully', id: results.insertId });
    });
  });
  
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Close the connection when done
// connection.end();
