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
        const productId = document.getElementById("editProductId").value;
        const productName = document.getElementById("editProductName").value;
        const productPrice = document.getElementById("editProductPrice").value;
        const productQuantity = document.getElementById("editProductQuantity").value;

        e.preventDefault(); // Prevent the default form submission
        // Send data to backend
        fetch("/api/edit-product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId, // Ensure this matches what the backend expects
                productName,
                productPrice,
                productQuantity,
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
            closePopup();
        })
        .catch((error) => {
            console.error("Error editting product:", error);
            alert("Error al editar el producto. Inténtalo de nuevo.");
        });
    });
});

document.getElementById("removeProductButton").addEventListener("click", function () {
    showPopup(
        "Eliminar producto",
        `
        <form id="removeProductForm" style="display: none;">
            <input type="number" id="removeProductId" name="removeProductId" placeholder="ID" required />
            <br /><br />
            <input type="text" id="removeProductName" name="removeProductName" placeholder="Nombre del producto" required />
            <button id="removeSubmitButton" type="submit">Eliminar</button>
        </form>
        `
    );

    document.getElementById("removeProductId").addEventListener("input", function () {
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
                document.getElementById("removeProductName").value = data.nombre_producto || "";
            })
            .catch((error) => {
                console.error("Error fetching product:", error);
                alert("Producto no encontrado");
                clearEditFields();
            });
    });
    
    // Clear other fields
    function clearEditFields() {
        document.getElementById("removeProductName").value = "";
    }    

    // Handle form submission
    document.getElementById("removeProductForm").addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect user input
        const productId = document.getElementById("removeProductId").value;
        const productName = document.getElementById("removeProductName").value;

        e.preventDefault(); // Prevent the default form submission
        // Send data to backend
        fetch("/api/remove-product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId,
                productName,
            }),
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error("Failed to remove product");
            }
            return response.json();
        })
        .then((data) => {
            alert("Producto eliminado con éxito!");
            console.log("Response from server:", data);
            closePopup();
        })
        .catch((error) => {
            console.error("Error removing product:", error);
            alert("Error al eliminar el producto. Inténtalo de nuevo.");
        });
    });
});

document.getElementById("searchProductButton").addEventListener("click", function () {
    showPopup(
        "Buscar producto",
        `
        <form id="searchProductForm" style="display: none;">
            <input type="number" id="searchProductId" name="searchProductId" placeholder="ID" required />
            <br /><br />
            <input type="text" id="searchProductName" name="searchProductName" placeholder="Nombre del producto" required />
            <br /><br />
            <div>
                <label for="searchProductPrice">Precio:</label>
                <span id="searchProductPrice" name="searchProductPrice">N/A</span>
                <br /><br />
                <label for="searchProductQuantity">Cantidad:</label>
                <span id="searchProductQuantity" name="searchProductQuantity">N/A</span>
                <br /><br />
            </div>
            <button id="searchSubmitButton" type="submit">Buscar</button>
        </form>
        `
    );

    // Handle form submission
    document.getElementById("searchProductForm").addEventListener("submit", function (e) {
        e.preventDefault();

        // Collect user input
        const productId = document.getElementById("editProductId").value;
        const productName = document.getElementById("editProductName").value;

        e.preventDefault(); // Prevent the default form submission
        // Send data to backend
        if (!productId) {
            fetch(`/api/search-product?name=${productName}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Product not found");
                    }
                    return response.json();
                })
                .then((data) => {
                    // Populate the fields with the retrieved data
                    document.getElementById("searchProductId").value = data.id || "";
                    document.getElementById("searchProductPrice").value = data.precio || "";
                    document.getElementById("searchProductQuantity").value = data.cantidad || "";
                })
                .catch((error) => {
                    console.error("Error fetching product:", error);
                    alert("Producto no encontrado");
                    clearSearchFields();
            });
        } else if (!productName){
            fetch(`/api/search-product?id=${productId}`)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Product not found");
                    }
                    return response.json();
                })
                .then((data) => {
                    // Populate the fields with the retrieved data
                    document.getElementById("searchProductName").value = data.name || "";
                    document.getElementById("searchProductPrice").value = data.precio || "";
                    document.getElementById("searchProductQuantity").value = data.cantidad || "";
                })
                .catch((error) => {
                    console.error("Error fetching product:", error);
                    alert("Producto no encontrado");
                    clearSearchFields();
            });
        }
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

function clearSearchFields() {
    document.getElementById("searchProductName").value = "";
    document.getElementById("searchProductPrice").value = "";
    document.getElementById("searchProductQuantity").value = "";
}  