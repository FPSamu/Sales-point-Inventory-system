document.getElementById("addProductButton").addEventListener("click", function () {
    showPopup(
        "Añadir producto",
        `
        <form id="addProductForm">
            <input type="text" id="productName" name="productName" placeholder="Nombre del producto" required><br><br>
        
            <div>
                <input type="number" id="productPrice" name="productPrice" placeholder="Precio" required><br><br>
                <input type="number" id="productQuantity" name="productQuantity" placeholder="Cantidad" required><br><br>
            </div>
        
            <button type="submit">Añadir</button>
        </form>
        `
    );

    // Handle form submission
    document.getElementById("addProductForm").addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect user input
        const productName = document.getElementById("productName").value;
        const productPrice = document.getElementById("productPrice").value;
        const productQuantity = document.getElementById("productQuantity").value;

        // Send data to backend
        fetch("/api/script.js", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productName,
                productPrice,
                productQuantity,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to add product");
            }
            return response.json();
        })
        .then((data) => {
            alert("Producto añadido con éxito!");
            console.log("Response from server:", data);
            closePopup(); // Close the popup after successful submission
        })
        .catch((error) => {
            console.error("Error adding product:", error);
            alert("Error al añadir el producto. Inténtalo de nuevo.");
        });
    });
});

document.getElementById("closeImage").addEventListener("click", function () {
    closePopup();
});

function showPopup(title, message) {
    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
}