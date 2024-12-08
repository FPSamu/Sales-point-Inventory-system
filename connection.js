const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors()); // To allow cross-origin requests
app.use(express.json()); // To parse JSON requests

// MySQL Connection Setup
const db = mysql.createConnection({
  host: 'ayalas.cbwse8g2km92.us-east-2.rds.amazonaws.com', // Replace with your RDS endpoint
  user: 'root',                  // Replace with your database username
  password: 'adminadmin',              // Replace with your database password
  database: 'ayalas'          // Replace with your database name
});

// Connect to Database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
});

// API Endpoint to Fetch Data
app.get('/data', (req, res) => {
  const query = 'SELECT * FROM your_table_name'; // Replace with your table name
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).json({ error: 'Failed to fetch data' });
    } else {
      res.json(results);
    }
  });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
