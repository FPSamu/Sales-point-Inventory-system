import dotenv from 'dotenv';
import mysql from 'mysql2';
import express from 'express';
import cors from 'cors';

dotenv.config();

const app = express();
const port = 3000;

// Enable CORS and JSON parsing middleware
app.use(cors());
app.use(express.json());

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Route: Get all products
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM inventario';

  pool.query(query, (err, results) => {
    if (err) {
      console.error('Database query error:', err);
      res.status(500).json({ error: 'Database query failed', details: err.message });
      return;
    }
    res.status(200).json(results);
  });
});

// Route: Add a new product
app.post('/add-product', (req, res) => {
  const { productName, productPrice, productQuantity } = req.body;

  // Validate the input
  if (!productName || !productPrice || !productQuantity) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  const query = 'INSERT INTO inventario (nombre_producto, cantidad, precio) VALUES (?, ?, ?)';
  const values = [productName, productQuantity, productPrice];

  pool.query(query, values, (err, results) => {
    if (err) {
      console.error('Database insert error:', err);
      res.status(500).json({ error: 'Failed to add product', details: err.message });
      return;
    }
    res.status(200).json({ message: 'Product added successfully', id: results.insertId });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});