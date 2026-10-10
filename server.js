const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Connect to SQLite Database and automatically create tables & sample data
const db = new sqlite3.Database('./charumart.db', (err) => {
    if (err) {
        console.error("SQLite connection error:", err.message);
    } else {
        console.log("Connected to the SQLite database.");
        
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                role TEXT
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS products (
                product_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                category TEXT,
                price REAL,
                stock INTEGER,
                seller_id INTEGER,
                image TEXT
            )`, () => {
                // Auto-seed sample products if the table is empty
                db.get(`SELECT COUNT(*) as count FROM products`, (err, row) => {
                    if (row && row.count === 0) {
                        const sampleProducts = [
                            ['Wireless Headphones', 'Electronics', 59.99, 10, 1, 'images/product1.jpg'],
                            ['Smart Watch', 'Electronics', 99.99, 15, 1, 'images/product2.jpg'],
                            ['Running Shoes', 'Sports', 45.50, 20, 1, 'images/product3.jpg'],
                            ['Cotton T-Shirt', 'Fashion', 19.99, 50, 1, 'images/product4.jpg']
                        ];
                        const stmt = db.prepare(`INSERT INTO products (name, category, price, stock, seller_id, image) VALUES (?, ?, ?, ?, ?, ?)`);
                        sampleProducts.forEach(p => stmt.run(p));
                        stmt.finalize();
                        console.log("Sample products seeded successfully.");
                    }
                });
            });

            db.run(`CREATE TABLE IF NOT EXISTS cart (
                cart_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                product_id INTEGER,
                quantity INTEGER
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS wishlist (
                wishlist_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                product_id INTEGER,
                UNIQUE(user_id, product_id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS orders (
                order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                total_amount REAL,
                address TEXT,
                payment_method TEXT,
                payment_status TEXT,
                order_status TEXT
            )`);
            console.log("Database tables verified/created successfully.");
        });
    }
});

// Root Route
app.get("/", (req, res) => {
    res.send("Charu Mart Backend is running with SQLite!");
});

// Register API
app.post("/api/register", (req, res) => {
    const { name, email, password, role } = req.body;
    const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, email, password, role || 'buyer'], function(err) {
        if (err) {
            console.error("REGISTER SQL ERROR:", err.message);
            return res.status(500).json({ message: "Email already exists or database error" });
        }
        res.json({ message: "Account created successfully", user_id: this.lastID });
    });
});

// Login API
app.post("/api/login", (req, res) => {
    const { email, password } = req.body;
    const query = `SELECT * FROM users WHERE email = ? AND password = ?`;
    db.get(query, [email, password], (err, row) => {
        if (err) {
            console.error("LOGIN SQL ERROR:", err.message);
            return res.status(500).json({ message: "Database error: " + err.message });
        }
        if (!row) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.json({ user: row });
    });
});

// Products API
app.get("/api/products", (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(rows);
    });
});

// Add Product API
app.post("/api/products", (req, res) => {
    const { name, category, price, stock, seller_id, image } = req.body;
    const query = `INSERT INTO products (name, category, price, stock, seller_id, image) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(query, [name, category, price, stock, seller_id, image || ''], function(err) {
        if (err) {
            return res.status(500).json({ message: "Failed to add product" });
        }
        res.json({ message: "Product added successfully", product_id: this.lastID });
    });
});

// Cart APIs
app.get("/api/cart/:userId", (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT cart.cart_id, cart.quantity, products.product_id, products.name, products.price, products.category, products.image
        FROM cart
        JOIN products ON cart.product_id = products.product_id
        WHERE cart.user_id = ?
    `;
    db.all(query, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(rows);
    });
});

app.post("/api/cart", (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    const query = `INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`;
    db.run(query, [user_id, product_id, quantity || 1], function(err) {
        if (err) {
            console.error("CART SQL ERROR:", err.message);
            return res.status(500).json({ message: "Failed to add to cart: " + err.message });
        }
        res.json({ message: "Added to cart successfully" });
    });
});

app.put("/api/cart/:cartId", (req, res) => {
    const cartId = req.params.cartId;
    const { quantity } = req.body;
    db.run(`UPDATE cart SET quantity = ? WHERE cart_id = ?`, [quantity, cartId], function(err) {
        if (err) {
            return res.status(500).json({ message: "Failed to update quantity" });
        }
        res.json({ message: "Quantity updated" });
    });
});

app.delete("/api/cart/:cartId", (req, res) => {
    const cartId = req.params.cartId;
    db.run(`DELETE FROM cart WHERE cart_id = ?`, [cartId], function(err) {
        if (err) {
            return res.status(500).json({ message: "Failed to remove item" });
        }
        res.json({ message: "Item removed from cart" });
    });
});

// Wishlist APIs
app.get("/api/wishlist/:userId", (req, res) => {
    const userId = req.params.userId;
    const query = `
        SELECT wishlist.wishlist_id, products.* 
        FROM wishlist 
        JOIN products ON wishlist.product_id = products.product_id 
        WHERE wishlist.user_id = ?
    `;
    db.all(query, [userId], (err, rows) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json(rows);
    });
});

app.post("/api/wishlist", (req, res) => {
    const { user_id, product_id } = req.body;
    db.run(
        `INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)`,
        [user_id, product_id],
        function (err) {
            if (err) {
                if (err.message.includes("UNIQUE")) {
                    return res.status(400).json({ message: "Product already in wishlist" });
                }
                return res.status(500).json({ message: "Database error" });
            }
            res.json({ message: "Added to wishlist", wishlist_id: this.lastID });
        }
    );
});

app.delete("/api/wishlist/:wishlistId", (req, res) => {
    const wishlistId = req.params.wishlistId;
    db.run(`DELETE FROM wishlist WHERE wishlist_id = ?`, [wishlistId], function (err) {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Item removed from wishlist" });
    });
});

// Orders APIs
app.get("/api/orders/:userId", (req, res) => {
    const userId = req.params.userId;
    db.all(`SELECT * FROM orders WHERE user_id = ?`, [userId], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(rows);
    });
});

app.post("/api/orders", (req, res) => {
    const { user_id, total_amount, address, payment_method } = req.body;
    const query = `INSERT INTO orders (user_id, total_amount, address, payment_method, payment_status, order_status) VALUES (?, ?, ?, ?, 'Completed', 'Placed')`;
    db.run(query, [user_id, total_amount, address, payment_method], function(err) {
        if (err) {
            return res.status(500).json({ message: "Failed to place order" });
        }
        const orderId = this.lastID;
        db.run(`DELETE FROM cart WHERE user_id = ?`, [user_id], () => {
            res.json({ message: "Order placed successfully", order_id: orderId });
        });
    });
});

// Admin APIs
app.get("/api/admin/users", (req, res) => {
    db.all(`SELECT user_id, name, email, role FROM users`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(rows);
    });
});

app.get("/api/admin/orders", (req, res) => {
    db.all(`SELECT * FROM orders`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        res.json(rows);
    });
});

app.put("/api/admin/orders/:orderId", (req, res) => {
    const orderId = req.params.orderId;
    const { order_status } = req.body;
    db.run(`UPDATE orders SET order_status = ? WHERE order_id = ?`, [order_status, orderId], function(err) {
        if (err) {
            return res.status(500).json({ message: "Failed to update order status" });
        }
        res.json({ message: "Order status updated" });
    });
});

app.put("/api/admin/products/:productId", (req, res) => {
    const productId = req.params.productId;
    const { name, category, price, stock, seller_id } = req.body;
    const query = `UPDATE products SET name = ?, category = ?, price = ?, stock = ?, seller_id = ? WHERE product_id = ?`;
    db.run(query, [name, category, price, stock, seller_id, productId], function(err) {
        if (err) {
            return res.status(500).json({ message: "Failed to update product" });
        }
        res.json({ message: "Product updated successfully" });
    });
});

app.delete("/api/admin/products/:productId", (req, res) => {
    const productId = req.params.productId;
    db.run(`DELETE FROM products WHERE product_id = ?`, [productId], function(err) {
        if (err) {
            return res.status(500).json({ message: "Failed to delete product" });
        }
        res.json({ message: "Product deleted successfully" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});