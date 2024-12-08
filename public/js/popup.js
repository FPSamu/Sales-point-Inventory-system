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
        fetch("/api/add-product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productName,
                productQuantity,
                productPrice,
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

document.getElementById("editProductButton").addEventListener("click", function () {
    showPopup(
        "Editar producto",
        `
        <form id="editProductForm">
            <input type="text" id="productName" name="productName" placeholder="Nombre del producto" required><br><br>
        
            <div>
                <input type="number" id="productPrice" name="productPrice" placeholder="Precio" required><br><br>
                <input type="number" id="productQuantity" name="productQuantity" placeholder="Cantidad" required><br><br>
            </div>
        
            <button type="submit">Editar</button>
        </form>
        `
    );

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

    // Handle form submission
    document.getElementById("editProductForm").addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect user input
        const id = document.getElementById("editProductId").value;
        const productName = document.getElementById("productName").value;
        const productPrice = document.getElementById("productPrice").value;
        const productQuantity = document.getElementById("productQuantity").value;

        // Send data to backend
        fetch("/api/edit-product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                productName,
                productQuantity,
                productPrice,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to edit product");
            }
            return response.json();
        })
        .then((data) => {
            alert("Producto editado con éxito!");
            console.log("Response from server:", data);
            closePopup(); // Close the popup after successful submission
        })
        .catch((error) => {
            console.error("Error editting product:", error);
            alert("Error al editar el producto. Inténtalo de nuevo.");
        });
    });
});

// Add Product Button
document.getElementById("addProductButton").addEventListener("click", function () {
    showPopup("Añadir producto", "add");
});

// Edit Product Button
document.getElementById("editProductButton").addEventListener("click", function () {
    showPopup("Editar producto", "edit");
});

document.getElementById("editProductId").addEventListener("input", function () {
    const productId = this.value;

    if (!productId) {
        clearEditFields();
        return;
    }

    fetch(`/api/get-product?id=${productId}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Product not found");
            }
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
    } else if (formType === "edit") {
        document.getElementById("addProductForm").style.display = "none";
        document.getElementById("editProductForm").style.display = "block";
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
}

function clearEditFields() {
    document.getElementById("editProductName").value = "";
    document.getElementById("editProductPrice").value = "";
    document.getElementById("editProductQuantity").value = "";
}
