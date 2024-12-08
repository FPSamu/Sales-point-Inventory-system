import dotenv from 'dotenv'; // Import dotenv for environment variables
import mysql from 'mysql2'; // Import MySQL
import express from 'express'; // Import Express
import cors from 'cors';


dotenv.config();

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

const app = express();
const port = 3000;

// Enable CORS for all origins
app.use(cors());

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database!');
});

// Example query
connection.query('SELECT * FROM inventario', (err, results) => {
  if (err) {
    console.error('Error executing query:', err);
    return;
  }
  console.log('Query results:', results);
});

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
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

// Close the connection when done
// connection.end();
