document.getElementById("addProductButton").addEventListener("click", function () {
    showPopup(
        "Añadir producto",
        `
        <form id="addProductForm">
            <label for="productName">Nombre del producto:</label>
            <input type="text" id="productName" name="productName" placeholder="Escribe el nombre del producto" required><br><br>

            <label for="productPrice">Precio:</label>
            <input type="number" id="productPrice" name="productPrice" placeholder="Escribe el precio" required><br><br>

            <label for="productQuantity">Cantidad:</label>
            <input type="number" id="productQuantity" name="productQuantity" placeholder="Escribe la cantidad" required><br><br>

            <button type="submit">Añadir</button>
        </form>
        `
    );

    // Handle form submission
    document.getElementById("addProductForm").addEventListener("submit", function (e) {
        e.preventDefault();
        const productName = document.getElementById("productName").value;
        const productPrice = document.getElementById("productPrice").value;
        const productQuantity = document.getElementById("productQuantity").value;

        alert(`Producto añadido:
        - Nombre: ${productName}
        - Precio: ${productPrice}
        - Cantidad: ${productQuantity}`);

        document.getElementById("popup").style.display = "none";
    });
});

document.getElementById("closeImage").addEventListener("click", function () {
    document.getElementById("popup").style.display = "none";
});

function showPopup(title, message) {
    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popup").style.display = "flex";
}
