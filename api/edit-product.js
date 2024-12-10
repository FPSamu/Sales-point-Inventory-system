import mysql from "mysql2";

export const config = {
    api: {
        bodyParser: true,
    },
};  

export default function handler(req, res) {
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

        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        const query = `UPDATE inventario SET nombre_producto = ?, cantidad = ?, precio = ? WHERE id = ?`;
        const values = [productName, productQuantity, productPrice, productId];
        connection.query(query, values, (err, results) => {
            connection.end();
            if (err) {
                console.error("Query Error:", err.message);
                res.status(500).json({ error: 'Failed to update product', details: err.message });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).json({ error: "Product not found" });
                return;
            }
            res.status(200).json({ message: "Product updated successfully" });
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
