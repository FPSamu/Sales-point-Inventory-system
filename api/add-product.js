import mysql from 'mysql2';

export default function handler(req, res) {
    if (req.method === 'POST') {
        let { productName, productPrice, productQuantity } = req.body;

        if (!productName || !productPrice || !productQuantity) {
            res.status(400).json({ error: 'All fields are required' });
            return;
        }
        productName = productName.toUpperCase();

        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const query = 'INSERT INTO inventario (nombre_producto, cantidad, precio) VALUES (?, ?, ?)';
        connection.query(query, [productName, productQuantity, productPrice], (err, results) => {
            connection.end();
            if (err) {
                res.status(500).json({ error: 'Database insert error', details: err.message });
                return;
            }
            res.status(200).json({ message: 'Product added successfully', id: results.insertId });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
