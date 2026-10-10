function goToPage(page) {
    window.location.href = page;
}


/* ================================
   BUYER HOME PAGE FUNCTIONS
================================ */

function showDemoMessage(message) {
    alert(message + " feature will be implemented in the next stage.");
}


function scrollToProducts() {
    const products = document.getElementById("featured");

    if (products) {
        products.scrollIntoView({
            behavior: "smooth"
        });
    }
}


/* ================================
   LOAD PRODUCTS ON HOME PAGE
================================ */

document.addEventListener("DOMContentLoaded", async () => {
    const productsContainer = document.getElementById("featured-products") || document.querySelector(".featured-grid") || document.getElementById("featured");
    
    if (!productsContainer) return;

    try {
        const response = await fetch("/api/products");
        const products = await response.json();

        if (response.ok && products.length > 0) {
            productsContainer.innerHTML = ""; 
            products.forEach(product => {
                const productCard = `
                    <div class="product-card" style="border: 1px solid #ddd; padding: 15px; border-radius: 8px; margin: 10px; background: white; width: 220px; display: inline-block; vertical-align: top;">
                        <img src="${product.image || 'image/placeholder.jpg'}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: cover; border-radius: 4px;">
                        <h3 style="font-size: 16px; margin: 10px 0 5px;">${product.name}</h3>
                        <p style="color: gray; font-size: 14px; margin: 0 0 5px;">${product.category}</p>
                        <p style="font-weight: bold; color: #2b6cb0; margin: 0 0 10px;">$${product.price.toFixed(2)}</p>
                        <button onclick="addToCart(${product.product_id})" style="background: #3182ce; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; width: 100%;">Add to Cart</button>
                    </div>
                `;
                productsContainer.innerHTML += productCard;
            });
        } else {
            productsContainer.innerHTML = "<p>No products available right now.</p>";
        }
    } catch (error) {
        console.error("Failed to load products:", error);
    }
});


/* ================================
   BUYER LOGIN
================================ */

const buyerLoginForm = document.getElementById("buyerLoginForm");

if (buyerLoginForm) {
    buyerLoginForm.addEventListener(
        "submit",
        async function(event) {
            event.preventDefault();

            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value.trim();

            if (email === "" || password === "") {
                alert("Please enter your email and password.");
                return;
            }

            try {
                const response = await fetch(
                    "/api/login",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            email: email,
                            password: password
                        })
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem(
                        "user",
                        JSON.stringify(data.user)
                    );

                    alert("Login successful!");
                    window.location.href = "home.html";
                } else {
                    alert(data.message || "Invalid credentials.");
                }

            } catch (error) {
                console.error("Login fetch error:", error);
                alert("Unable to connect to server.");
            }
        }
    );
}


/* ================================
   BUYER REGISTRATION
================================ */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
    registerForm.addEventListener(
        "submit",
        async function(event) {
            event.preventDefault();

            const name = document.getElementById("registerName").value.trim();
            const email = document.getElementById("registerEmail").value.trim();
            const password = document.getElementById("registerPassword").value.trim();

            if (
                name === "" ||
                email === "" ||
                password === ""
            ) {
                alert("Please fill all fields.");
                return;
            }

            try {
                const response = await fetch(
                    "/api/register",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            name: name,
                            email: email,
                            password: password,
                            role: "buyer"
                        })
                    }
                );

                const data = await response.json();

                if (response.ok) {
                    alert("Account created successfully!");
                    window.location.href = "login.html";
                } else {
                    alert(data.message || "Registration failed.");
                }

            } catch (error) {
                console.error("Register fetch error:", error);
                alert("Unable to connect to server.");
            }
        }
    );
}


/* ================================
   PASSWORD TOGGLE
================================ */

function togglePassword() {
    const password = document.getElementById("password");

    if (!password) return;

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}


function toggleRegisterPassword() {
    const password = document.getElementById("registerPassword");

    if (!password) return;

    if (password.type === "password") {
        password.type = "text";
    } else {
        password.type = "password";
    }
}


/* ================================
   FORGOT PASSWORD
================================ */

function forgotPassword(event) {
    event.preventDefault();
    alert(
        "Password reset feature will be implemented in the next stage."
    );
}


/* ================================
   ADD TO CART
================================ */

async function addToCart(productId) {
    const userData = localStorage.getItem("user");

    if (!userData) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    const user = JSON.parse(userData);

    try {
        const response = await fetch(
            "/api/cart",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: user.user_id || user.id,
                    product_id: productId,
                    quantity: 1
                })
            }
        );

        const data = await response.json();

        if (response.ok) {
            alert("Product added to cart successfully!");
        } else {
            alert(data.message || "Failed to add product to cart.");
        }

    } catch (error) {
        console.error("Cart error:", error);
        alert("Server connection failed.");
    }
}