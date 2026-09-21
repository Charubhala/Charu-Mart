const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());

// SERVE FRONTEND: This automatically serves all HTML, CSS, and JS files from this folder!
app.use(express.static(path.join(__dirname)));

// Connect to SQLite Database
const db = new sqlite3.Database('./charumart.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

// Function to create all required tables
function createTables() {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
    )`, (err) => {
        if (err) console.error("Error creating users table", err.message);
        else console.log("Users table ready.");
    });

    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        price REAL,
        seller TEXT
    )`, (err) => {
        if (err) console.error("Error creating products table", err.message);
        else console.log("Products table ready.");
    });

    db.run(`CREATE TABLE IF NOT EXISTS reviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        product_id INTEGER,
        username TEXT,
        rating INTEGER,
        comment TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error("Error creating reviews table", err.message);
        else console.log("Reviews table ready.");
    });

    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        buyer_id INTEGER,
        total_amount REAL,
        status TEXT DEFAULT 'PENDING',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) console.error("Error creating orders table", err.message);
        else console.log("Orders table ready.");
    });

    db.run(`CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER,
        product_id INTEGER,
        quantity INTEGER,
        unit_price REAL
    )`, (err) => {
        if (err) console.error("Error creating order_items table", err.message);
        else console.log("Order items table ready.");
    });

    db.run(`CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_id INTEGER,
        quantity INTEGER DEFAULT 1
    )`, (err) => {
        if (err) console.error("Error creating cart table", err.message);
        else console.log("Cart table ready.");
    });

    db.run(`CREATE TABLE IF NOT EXISTS wishlist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        product_id INTEGER
    )`, (err) => {
        if (err) console.error("Error creating wishlist table", err.message);
        else console.log("Wishlist table ready.");
    });
}

// 1. REGISTER ROUTE
app.post('/api/register', (req, res) => {
    const { username, password, role } = req.body;
    const query = `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`;
    
    db.run(query, [username, password, role], function(err) {
        if (err) {
            return res.status(400).json({ error: "Username already exists or invalid data!" });
        }
        res.json({ message: "User registered successfully!", userId: this.lastID });
    });
});

// 2. LOGIN ROUTE
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;

    db.get(query, [username, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: "Internal server error" });
        }
        if (row) {
            res.json({ message: "Login successful!", role: row.role, username: row.username, userId: row.id });
        } else {
            res.status(401).json({ error: "Invalid username or password" });
        }
    });
});

// 3. GET ALL PRODUCTS ROUTE
app.get('/api/products', (req, res) => {
    db.all(`SELECT * FROM products`, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// 4. ADD PRODUCT ROUTE (For Sellers)
app.post('/api/products', (req, res) => {
    const { name, price, seller } = req.body;
    const query = `INSERT INTO products (name, price, seller) VALUES (?, ?, ?)`;

    db.run(query, [name, price, seller], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: "Product added successfully!", productId: this.lastID });
    });
});

// 5. REVIEW ROUTES
app.post('/api/reviews', (req, res) => {
    const { product_id, username, rating, comment } = req.body;
    db.run(`INSERT INTO reviews (product_id, username, rating, comment) VALUES (?, ?, ?, ?)`,
        [product_id, username, rating, comment],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Review added successfully", reviewId: this.lastID });
        }
    );
});

app.get('/api/reviews/:product_id', (req, res) => {
    db.all(`SELECT * FROM reviews WHERE product_id = ?`, [req.params.product_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 6. CHECKOUT & ORDER ROUTES
app.post('/api/checkout', (req, res) => {
    const { buyer_id, total_amount, items } = req.body;
    
    db.run(`INSERT INTO orders (buyer_id, total_amount, status) VALUES (?, ?, 'PENDING')`, 
        [buyer_id, total_amount], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            const orderId = this.lastID;
            
            const stmt = db.prepare(`INSERT INTO order_items (order_id, product_id, quantity, unit_price) VALUES (?, ?, ?, ?)`);
            items.forEach(item => {
                stmt.run(orderId, item.product_id, item.quantity, item.price);
            });
            stmt.finalize();

            // Clear the user's cart after successful checkout
            db.run(`DELETE FROM cart WHERE user_id = ?`, [buyer_id]);

            res.json({ message: "Order placed successfully!", orderId });
        }
    );
});

app.get('/api/orders/:buyer_id', (req, res) => {
    const buyerId = req.params.buyer_id;
    db.all(`SELECT * FROM orders WHERE buyer_id = ? ORDER BY created_at DESC`, [buyerId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.put('/api/orders/:id/status', (req, res) => {
    const { status } = req.body;
    db.run(`UPDATE orders SET status = ? WHERE id = ?`, [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Order status updated successfully" });
    });
});

// 7. CART & WISHLIST ROUTES
app.post('/api/cart', (req, res) => {
    const { user_id, product_id, quantity } = req.body;
    db.run(`INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)`, 
        [user_id, product_id, quantity || 1], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Added to cart successfully", cartId: this.lastID });
        }
    );
});

app.get('/api/cart/:user_id', (req, res) => {
    const query = `
        SELECT cart.id as cart_id, cart.quantity, products.* 
        FROM cart 
        JOIN products ON cart.product_id = products.id 
        WHERE cart.user_id = ?
    `;
    db.all(query, [req.params.user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/cart/:id', (req, res) => {
    db.run(`DELETE FROM cart WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item removed from cart" });
    });
});

app.post('/api/wishlist', (req, res) => {
    const { user_id, product_id } = req.body;
    db.run(`INSERT INTO wishlist (user_id, product_id) VALUES (?, ?)`, 
        [user_id, product_id], 
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: "Added to wishlist successfully", wishlistId: this.lastID });
        }
    );
});

app.get('/api/wishlist/:user_id', (req, res) => {
    const query = `
        SELECT wishlist.id as wishlist_id, products.* 
        FROM wishlist 
        JOIN products ON wishlist.product_id = products.id 
        WHERE wishlist.user_id = ?
    `;
    db.all(query, [req.params.user_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/wishlist/:id', (req, res) => {
    db.run(`DELETE FROM wishlist WHERE id = ?`, [req.params.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Item removed from wishlist" });
    });
});

app.get('/api/order-details/:order_id', (req, res) => {
    const query = `
        SELECT order_items.*, products.name, products.price 
        FROM order_items 
        JOIN products ON order_items.product_id = products.id 
        WHERE order_items.order_id = ?
    `;
    db.all(query, [req.params.order_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// 8. AI CHATBOT ENDPOINT
app.post('/api/chat', (req, res) => {
    const { message } = req.body;
    
    let reply = "Hello! Welcome to Charu Mart. I can help you find products, check order statuses, or answer questions about our marketplace.";
    
    const lowerMsg = message.toLowerCase();
    if (lowerMsg.includes('seller') || lowerMsg.includes('sell')) {
        reply = "Sellers can easily list products, set prices, and manage inventory through the Seller Dashboard!";
    } else if (lowerMsg.includes('payment') || lowerMsg.includes('pay')) {
        reply = "Charu Mart uses mock payment confirmation for safe, simulated checkouts during your capstone demo.";
    } else if (lowerMsg.includes('admin')) {
        reply = "The Admin suite allows user moderation, viewing all platform orders, and managing store listings.";
    }

    res.json({ reply });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});