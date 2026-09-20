// ===================================================
// CHARU MART - Studio Ghibli Interactivity Script
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('🌱 Charu Mart Ghibli Theme Initialized!');

  // 1. Initial Welcome Toast Popup after page load
  setTimeout(() => {
    showCutePopup('🧹 Welcome to Charu Mart! Select your role to get started.');
  }, 800);

  // 2. Interactive Role Card Hover Sound Effects & Micro-Popups
  const roleCards = document.querySelectorAll('.role-card');
  roleCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const role = card.getAttribute('data-role');
      if (role === 'buyer') {
        showCutePopup('🛍️ Ready to find magical items?');
      } else if (role === 'seller') {
        showCutePopup('🌾 Welcome back, Artisan!');
      } else if (role === 'admin') {
        showCutePopup('👑 Platform Command Center ahead!');
      }
    });
  });
});

/**
 * Creates and displays a cute Ghibli-style floating popup toast
 * @param {string} message - Text/emoji content to display
 */
function showCutePopup(message) {
  // Remove existing popups to prevent stacking clutter
  const existingPopup = document.querySelector('.cute-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  // Create popup container element
  const popup = document.createElement('div');
  popup.className = 'cute-popup';
  popup.innerHTML = `
    <span class="popup-avatar">✨</span>
    <div class="popup-text">${message}</div>
  `;

  document.body.appendChild(popup);

  // Automatically fade out and remove popup after 3 seconds
  setTimeout(() => {
    popup.style.transition = 'all 0.4s ease';
    popup.style.opacity = '0';
    popup.style.transform = 'translateY(20px)';
    setTimeout(() => popup.remove(), 400);
  }, 3000);
}
// ===================================================
// STAGE 2 - BUYER LOGIN FUNCTIONALITY
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('togglePasswordBtn');
  const passwordInput = document.getElementById('buyerPassword');
  const loginForm = document.getElementById('buyerLoginForm');

  // 1. Show / Hide Password Toggle
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      toggleBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // 2. Demo Login Form Handling
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('buyerEmail').value;
      if (email.trim() === '') {
        showCutePopup('⚠️ Please enter a valid email or phone!');
        return;
      }

      showCutePopup('✨ Welcome back! Redirecting to Home...');
      
      // Simulate navigation to buyer home page after 1.5 seconds
      setTimeout(() => {
        window.location.href = 'home.html';
      }, 1500);
    });
  }
});
// ===================================================
// STAGE 3 - SELLER LOGIN FUNCTIONALITY
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  const toggleSellerBtn = document.getElementById('toggleSellerPasswordBtn');
  const sellerPasswordInput = document.getElementById('sellerPassword');
  const sellerLoginForm = document.getElementById('sellerLoginForm');

  // 1. Show / Hide Seller Password Toggle
  if (toggleSellerBtn && sellerPasswordInput) {
    toggleSellerBtn.addEventListener('click', () => {
      const isPassword = sellerPasswordInput.getAttribute('type') === 'password';
      sellerPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
      toggleSellerBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // 2. Demo Seller Login Handling
  if (sellerLoginForm) {
    sellerLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('sellerEmail').value;
      if (email.trim() === '') {
        showCutePopup('⚠️ Please enter a valid seller email!');
        return;
      }

      showCutePopup('🌾 Welcome back Artisan! Opening your dashboard...');
      
      // Navigate to seller dashboard after 1.5s
      setTimeout(() => {
        window.location.href = 'seller-dashboard.html';
      }, 1500);
    });
  }
});
// ===================================================
// STAGE 4 - ADMIN LOGIN FUNCTIONALITY
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  const toggleAdminBtn = document.getElementById('toggleAdminPasswordBtn');
  const adminPasswordInput = document.getElementById('adminPassword');
  const adminLoginForm = document.getElementById('adminLoginForm');

  // 1. Show / Hide Admin Password Toggle
  if (toggleAdminBtn && adminPasswordInput) {
    toggleAdminBtn.addEventListener('click', () => {
      const isPassword = adminPasswordInput.getAttribute('type') === 'password';
      adminPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
      toggleAdminBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  // 2. Demo Admin Login Handling
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('adminEmail').value;
      if (email.trim() === '') {
        showCutePopup('⚠️ Please enter a valid admin email!');
        return;
      }

      showCutePopup('👑 Admin credentials verified! Opening Control Suite...');
      
      // Navigate to admin dashboard after 1.5s
      setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
      }, 1500);
    });
  }
});
// ===================================================
// STAGE 5 - BUYER HOME PAGE INTERACTIVITY
// ===================================================

let cartItemsCount = 0;
let wishlistItemsCount = 0;

function addToCart(productName) {
  cartItemsCount++;
  const cartBadge = document.getElementById('cartCount');
  if (cartBadge) cartBadge.textContent = cartItemsCount;
  showCutePopup(`🛒 Added "${productName}" to your cart!`);
}

function toggleWishlist(button, productName) {
  if (button.textContent === '🤍') {
    button.textContent = '💖';
    wishlistItemsCount++;
    showCutePopup(`❤️ Saved "${productName}" to wishlist!`);
  } else {
    button.textContent = '🤍';
    wishlistItemsCount = Math.max(0, wishlistItemsCount - 1);
    showCutePopup(`💔 Removed "${productName}" from wishlist.`);
  }
  const wishlistBadge = document.getElementById('wishlistCount');
  if (wishlistBadge) wishlistBadge.textContent = wishlistItemsCount;
}

function filterCategory(categoryName) {
  const cards = document.querySelectorAll('.product-card');
  cards.forEach(card => {
    if (categoryName === 'all' || card.getAttribute('data-category') === categoryName) {
      card.style.display = 'flex';
    } else {
      card.style.display = 'none';
    }
  });
  showCutePopup(`📁 Filtered category: ${categoryName.toUpperCase()}`);
}

// Real-time Search Filter
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      const cards = document.querySelectorAll('.product-card');
      
      cards.forEach(card => {
        const title = card.querySelector('.product-title').textContent.toLowerCase();
        const desc = card.querySelector('.product-desc').textContent.toLowerCase();
        
        if (title.includes(query) || desc.includes(query)) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  }
});
// ===================================================
// STAGE 6 - SELLER DASHBOARD FUNCTIONALITY
// ===================================================

function deleteProduct(button, productName) {
  const row = button.closest('tr');
  row.remove();
  
  // Update count counter
  const list = document.getElementById('sellerProductList');
  if (list) {
    const countBadge = document.getElementById('activeProductsCount');
    if (countBadge) countBadge.textContent = list.children.length;
  }
  
  showCutePopup(`🗑️ Removed "${productName}" from listings!`);
}

function addDemoProduct() {
  const list = document.getElementById('sellerProductList');
  if (!list) return;

  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    <td><strong>✨ Ceramic Mug</strong></td>
    <td>Home & Living</td>
    <td>$14.00</td>
    <td>25 pcs</td>
    <td><span class="status-tag status-active">In Stock</span></td>
    <td>
      <button class="action-btn-sm" onclick="showCutePopup('✏️ Editing Ceramic Mug details...')">✏️</button>
      <button class="action-btn-sm" onclick="deleteProduct(this, 'Ceramic Mug')">🗑️</button>
    </td>
  `;
  list.appendChild(newRow);

  const countBadge = document.getElementById('activeProductsCount');
  if (countBadge) countBadge.textContent = list.children.length;

  showCutePopup('✨ Added new item "Ceramic Mug" to inventory!');
}
// ===================================================
// STAGE 7 - ADMIN DASHBOARD FUNCTIONALITY
// ===================================================

function approveStore(button, storeName) {
  const row = button.closest('tr');
  const statusTd = row.children[3];
  const actionsTd = row.children[4];

  statusTd.innerHTML = '<span class="status-tag status-badge-approved">Approved</span>';
  actionsTd.innerHTML = '<button class="action-btn-sm" onclick="showCutePopup(\'🔍 Inspecting store logs...\')">🔍</button>';

  updateAdminReviewCount();
  showCutePopup(`✅ Approved storefront application for "${storeName}"!`);
}

function rejectStore(button, storeName) {
  const row = button.closest('tr');
  const statusTd = row.children[3];
  const actionsTd = row.children[4];

  statusTd.innerHTML = '<span class="status-tag status-badge-flagged">Rejected</span>';
  actionsTd.innerHTML = '<button class="action-btn-sm" onclick="showCutePopup(\'📜 Application archived.\')">📁</button>';

  updateAdminReviewCount();
  showCutePopup(`❌ Rejected application for "${storeName}".`);
}

function updateAdminReviewCount() {
  const pendingTags = document.querySelectorAll('.status-badge-review');
  const badge = document.getElementById('pendingReviewsCount');
  if (badge) badge.textContent = pendingTags.length;
}

function switchAdminTab(tabName) {
  showCutePopup(`📜 Loaded view: ${tabName.toUpperCase()}`);
}
// Example login script connection
const loginBtn = document.getElementById('loginBtn'); // Change to match your button's ID

if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Stop form from refreshing the page

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Login successful! Welcome, ' + data.username);
                // Redirect based on role
                if (data.role === 'seller') {
                    window.location.href = 'seller-dashboard.html';
                } else if (data.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else {
                    window.location.href = 'home.html';
                }
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Something went wrong connecting to the server!');
        }
    });
}
// Registration script connection
const registerBtn = document.getElementById('registerBtn'); // Change to match your register button's ID

if (registerBtn) {
    registerBtn.addEventListener('click', async (e) => {
        e.preventDefault(); // Stop form from refreshing the page

        const username = document.getElementById('regUsername').value; // Adjust ID if needed
        const password = document.getElementById('regPassword').value; // Adjust ID if needed
        const role = document.getElementById('regRole') ? document.getElementById('regRole').value : 'buyer'; // Default to buyer if no role selector

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html'; // Redirect to login page
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert('Something went wrong connecting to the server!');
        }
    });
}
// Seller Add Product Connection
const addProductBtn = document.getElementById('addProductBtn');

if (addProductBtn) {
    addProductBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const name = document.getElementById('productName').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const seller = localStorage.getItem('username') || 'Unknown Seller'; // Gets logged-in seller name

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price, seller })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Product added successfully!');
                location.reload(); // Refresh page to show update
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Something went wrong connecting to the server!');
        }
    });
}
// Function to prompt seller and save product to SQLite database
async function addDemoProduct() {
    const name = prompt("Enter product name:");
    if (!name) return; // Cancelled

    const priceInput = prompt("Enter product price ($):");
    if (!priceInput) return;
    const price = parseFloat(priceInput);

    const seller = localStorage.getItem('username') || 'Charu Artisan';

    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, price, seller })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Product successfully added to database!');
            location.reload(); // Refresh page to see changes
        } else {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Failed to connect to server!');
    }
}
// Fetch and display database products on the buyer home page
async function loadProducts() {
    const productContainer = document.getElementById('productsGrid');
    
    if (!productContainer) return; // Exit if not on home page

    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        if (products.length === 0) return; // Keep dummy cards if database is empty

        // Optional: clear dummy cards or prepend database items
        // For now, let's append database items as new product cards:
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-category', 'all');
            productCard.innerHTML = `
                <span class="product-badge">Live Listing</span>
                <button class="wishlist-btn" onclick="toggleWishlist(this, '${product.name}')">🤍</button>
                <div class="product-img-box">📦</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">Seller: ${product.seller}</p>
                <div class="product-rating">★ 5.0 (New)</div>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="add-cart-btn" onclick="addToCart('${product.name}')">+ Add to Cart</button>
                </div>
            `;
            productContainer.appendChild(productCard);
        });
    } catch (err) {
        console.error('Error loading products:', err);
    }
}

window.addEventListener('DOMContentLoaded', loadProducts);
// Get all users (Admin only)
app.get('/api/admin/users', (req, res) => {
    db.all("SELECT id, username, role FROM users", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Delete a product listing (Admin moderation)
app.delete('/api/admin/products/:id', (req, res) => {
    const productId = req.params.id;
    db.run("DELETE FROM products WHERE id = ?", [productId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: "Product removed successfully by admin" });
    });
});
// Fetch and display users in the Admin Dashboard
async function loadAdminUsers() {
    // You can add a second tab table or container in your HTML for users if needed
    const userTableBody = document.getElementById('userListBody'); 
    if (!userTableBody) return;

    try {
        const response = await fetch('/api/admin/users');
        const users = await response.json();

        userTableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${user.username}</strong></td>
                <td><span class="status-tag">${user.role}</span></td>
                <td>
                    <button class="action-btn-sm" onclick="alert('Managing user ID: ${user.id}')">⚙️</button>
                </td>
            `;
            userTableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error loading admin users:', err);
    }
}

window.addEventListener('DOMContentLoaded', loadAdminUsers);