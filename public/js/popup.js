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

    document.getElementById("addProductForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const productName = document.getElementById("productName").value;
        const productPrice = parseFloat(document.getElementById("productPrice").value);
        const productQuantity = parseInt(document.getElementById("productQuantity").value);

        try {
            const response = await fetch("/api/add-product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName, productPrice, productQuantity }),
            });

            if (!response.ok) throw new Error("Error al agregar producto");

            const data = await response.json();
            alert("Producto añadido con éxito!");
            closePopup();
            console.log(data);
        } catch (error) {
            console.error("Error:", error);
            alert("Error al añadir producto. Inténtalo de nuevo.");
        }
    });
});

document.getElementById("removeProductButton").addEventListener("click", function () {
    showPopup(
        "Eliminar producto",
        `
        <form id="removeProductForm">
            <input type="number" id="removeProductId" name="removeProductId" placeholder="ID del producto" required><br><br>
            <button type="submit">Eliminar</button>
        </form>
        `
    );

    document.getElementById("removeProductForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const productId = document.getElementById("removeProductId").value;

        try {
            const response = await fetch("/api/remove-product", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) throw new Error("Error al eliminar producto");

            const data = await response.json();
            alert("Producto eliminado con éxito!");
            closePopup();
            console.log(data);
        } catch (error) {
            console.error("Error:", error);
            alert("Error al eliminar producto. Inténtalo de nuevo.");
        }
    });
});

document.getElementById("editProductButton").addEventListener("click", function () {
    showPopup(
        "Editar producto",
        `
        <form id="editProductForm">
            <input type="text" id="editProductName" placeholder="Nombre del producto" required><br><br>
            <input type="number" id="editProductPrice" placeholder="Precio" required><br><br>
            <input type="number" id="editProductQuantity" placeholder="Cantidad" required><br><br>
            <button type="submit">Editar</button>
        </form>
        `
    );

    document.getElementById("editProductForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const productName = document.getElementById("editProductName").value;
        const productPrice = parseFloat(document.getElementById("editProductPrice").value);
        const productQuantity = parseInt(document.getElementById("editProductQuantity").value);

        try {
            const response = await fetch("/api/edit-product", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productName, productPrice, productQuantity }),
            });

            if (!response.ok) throw new Error("Error al editar producto");

            const data = await response.json();
            alert("Producto editado con éxito!");
            closePopup();
            console.log(data);
        } catch (error) {
            console.error("Error:", error);
            alert("Error al editar producto.");
        }
    });
});

document.getElementById("searchProductButton").addEventListener("click", function () {
    showPopup(
        "Buscar producto",
        `
        <form id="searchProductForm">
            <input type="text" id="searchProductName" placeholder="Nombre del producto"><br><br>
            <button type="submit">Buscar</button>
        </form>
        `
    );

    document.getElementById("searchProductForm").addEventListener("submit", async function (e) {
        e.preventDefault();
        const productName = document.getElementById("searchProductName").value;

        try {
            const response = await fetch(`/api/search-product?name=${productName}`);
            if (!response.ok) throw new Error("Producto no encontrado");

            const data = await response.json();
            alert("Producto encontrado");
            console.log(data);
        } catch (error) {
            console.error("Error:", error);
            alert("Error al buscar producto");
        }
    });
});

// Popup management helpers
function showPopup(title, formType) {
    document.getElementById("popupTitle").innerText = title;
    document.getElementById("popup").style.display = "flex";
}

function closePopup() {
    document.getElementById("popup").style.display = "none";
    window.location.reload();
}

// Add Product Button
document.getElementById("addProductButton").addEventListener("click", function () {
    showPopup("Añadir producto", "add");
});

// Edit Product Button
document.getElementById("editProductButton").addEventListener("click", function () {
    showPopup("Editar producto", "edit");
});

// Remove Product Button
document.getElementById("removeProductButton").addEventListener("click", function () {
    showPopup("Eliminar producto", "remove");
});

// Search Product Button
document.getElementById("searchProductButton").addEventListener("click", function () {
    showPopup("Buscar producto", "search");
});

document.getElementById("editProductId").addEventListener("input", function () {
    const productId = this.value;

    if (!productId) {
        clearEditFields();
        return;
    }

    fetch(`/api/get-product?id=${productId}`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
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


// Function to show the popup and toggle between forms
function showPopup(title, formType) {
    clearEditFields();
    document.getElementById("popupTitle").innerText = title;

    // Toggle forms based on the type
    if (formType === "add") {
        document.getElementById("addProductForm").style.display = "block";
        document.getElementById("editProductForm").style.display = "none";
        document.getElementById("removeProductForm").style.display = "none";
        document.getElementById("searchProductForm").style.display = "none";
    } else if (formType === "edit") {
        document.getElementById("addProductForm").style.display = "none";
        document.getElementById("editProductForm").style.display = "block";
        document.getElementById("removeProductForm").style.display = "none";
        document.getElementById("searchProductForm").style.display = "none";
    } else if (formType === "remove") {
        document.getElementById("addProductForm").style.display = "none";
        document.getElementById("editProductForm").style.display = "none";
        document.getElementById("removeProductForm").style.display = "block";
        document.getElementById("searchProductForm").style.display = "none";
    } else if (formType === "search") {
        document.getElementById("addProductForm").style.display = "none";
        document.getElementById("editProductForm").style.display = "none";
        document.getElementById("removeProductForm").style.display = "none";
        document.getElementById("searchProductForm").style.display = "block";
    }

    // Display the popup
    document.getElementById("popup").style.display = "flex";
}

// Close the popup when the close image is clicked
document.getElementById("closeImage").addEventListener("click", function () {
    closePopup();
});

function closePopup() {
    document.getElementById("popup").style.display = "none";
    document.getElementById("addProductForm").style.display = "none";
    document.getElementById("editProductForm").style.display = "none";
    window.location.reload();
}

function clearEditFields() {
    document.getElementById("editProductName").value = "";
    document.getElementById("editProductPrice").value = "";
    document.getElementById("editProductQuantity").value = "";
}
