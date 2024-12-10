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
    if (req.method === "GET") {
        const { id, name } = req.query;

        if (!id && (!name || name.trim() === "")) {
            res.status(400).json({ error: "Product ID or name is required" });
            return;
        }

        let query, params;

        if (id) {
            query = "SELECT * FROM inventario WHERE id = ?";
            params = [id];
        } else if (name) {
            query = "SELECT * FROM inventario WHERE LOWER(nombre_producto) = LOWER(?)";
            params = [name.trim()];
        }

        console.log("Executing query:", query, params);

        pool.query(query, params, (err, results) => {
            if (err) {
                console.error("Database error:", err);
                res.status(500).json({ error: "Database query failed", details: err.message });
                return;
            }

            if (results.length === 0) {
                res.status(404).json({ error: "Product not found" });
                return;
            }

            res.status(200).json(results[0]);
        });
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
