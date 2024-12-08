import mysql from "mysql2";

export default function handler(req, res) {
    if (req.method === "POST") {
        const { id, nombre_producto, cantidad, precio } = req.body;

        // Validate input
        if (!id || !nombre_producto || !cantidad || !precio) {
            res.status(400).json({ error: "All fields (id, nombre_producto, cantidad, precio) are required" });
            return;
        }

        // Create a database connection
        const connection = mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        // Update query
        const query = `UPDATE inventario SET nombre_producto = ?, cantidad = ?, precio = ? WHERE id = ?`;
        const values = [nombre_producto, cantidad, precio, id];

        // Execute the query
        connection.query(query, values, (err, results) => {
            connection.end(); // Close the connection

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
        // Handle other HTTP methods
        res.setHeader("Allow", ["POST"]);
        res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}

document.getElementById("editProductId").addEventListener("input", function () {
    const productId = this.value;

    // Skip fetch if the input is empty
    if (!productId) {
        clearEditFields();
        return;
    }

    // Fetch product details from the backend
    fetch(`/api/get-product?id=${productId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Product not found");
            }
            return response.json();
        })
        .then((data) => {
            // Populate the fields with the retrieved data
            document.getElementById("editProductName").value = data.nombre_producto || "";
            document.getElementById("editProductPrice").value = data.precio || "";
            document.getElementById("editProductQuantity").value = data.cantidad || "";
        })
        .catch((error) => {
            console.error("Error fetching product:", error);
            alert("Producto no encontrado");
            clearEditFields();
        });
});

// Clear other fields
function clearEditFields() {
    document.getElementById("editProductName").value = "";
    document.getElementById("editProductPrice").value = "";
    document.getElementById("editProductQuantity").value = "";
}
