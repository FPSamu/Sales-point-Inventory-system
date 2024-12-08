import mysql from "mysql2";

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default function handler(req, res) {
    if (req.method === "POST") {
        const { id, nombre_producto, cantidad, precio } = req.body;

        if (!id || !nombre_producto || !cantidad || !precio) {
            res.status(400).json({ error: "All fields (id, nombre_producto, cantidad, precio) are required" });
            return;
        }

        const query = `UPDATE inventario SET nombre_producto = ?, cantidad = ?, precio = ? WHERE id = ?`;
        const values = [nombre_producto, cantidad, precio, id];

        pool.query(query, values, (err, results) => {
            if (err) {
                res.status(500).json({ error: "Failed to update product", details: err.message });
                return;
            }

            if (results.affectedRows === 0) {
                res.status(404).json({ error: "Product not found" });
                return;
            }

            res.status(200).json({ message: "Product updated successfully" });
        });
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
