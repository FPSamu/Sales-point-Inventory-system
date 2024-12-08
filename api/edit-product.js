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
