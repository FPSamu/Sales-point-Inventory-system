import mysql from 'mysql2';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { productName, productPrice, productQuantity } = req.body;

        // Validate input
        if (!productName || !productPrice || !productQuantity) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }

        // Database connection
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Insert query
        const query = 'INSERT INTO inventario (nombre_producto, cantidad, precio) VALUES (?, ?, ?)';
        const values = [productName, productQuantity, productPrice];

        connection.query(query, values, (err, results) => {
            connection.end(); // Close the connection

            if (err) {
                res.status(500).json({ error: 'Database insert error', details: err.message });
                return;
            }

            res.status(200).json({ message: 'Product added successfully', id: results.insertId });
        });
    } else {
        // Handle other HTTP methods
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
