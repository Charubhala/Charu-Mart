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
  const existingPopup = document.querySelector('.cute-popup');
  if (existingPopup) {
    existingPopup.remove();
  }

  const popup = document.createElement('div');
  popup.className = 'cute-popup';
  popup.innerHTML = `
    <span class="popup-avatar">✨</span>
    <div class="popup-text">${message}</div>
  `;

  document.body.appendChild(popup);

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

  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const isPassword = passwordInput.getAttribute('type') === 'password';
      passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
      toggleBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('buyerEmail').value;
      if (email.trim() === '') {
        showCutePopup('⚠️ Please enter a valid email or phone!');
        return;
      }

      showCutePopup('✨ Welcome back! Redirecting to Home...');
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

  if (toggleSellerBtn && sellerPasswordInput) {
    toggleSellerBtn.addEventListener('click', () => {
      const isPassword = sellerPasswordInput.getAttribute('type') === 'password';
      sellerPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
      toggleSellerBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  if (sellerLoginForm) {
    sellerLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('sellerEmail').value;
      if (email.trim() === '') {
        showCutePopup('⚠️ Please enter a valid seller email!');
        return;
      }

      showCutePopup('🌾 Welcome back Artisan! Opening your dashboard...');
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

  if (toggleAdminBtn && adminPasswordInput) {
    toggleAdminBtn.addEventListener('click', () => {
      const isPassword = adminPasswordInput.getAttribute('type') === 'password';
      adminPasswordInput.setAttribute('type', isPassword ? 'text' : 'password');
      toggleAdminBtn.textContent = isPassword ? '🙈' : '👁️';
    });
  }

  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('adminEmail').value;
      if (email.trim() === '') {
        showCutePopup('⚠️ Please enter a valid admin email!');
        return;
      }

      showCutePopup('👑 Admin credentials verified! Opening Control Suite...');
      setTimeout(() => {
        window.location.href = 'admin-dashboard.html';
      }, 1500);
    });
  }
});

// ===================================================
// STAGE 5 - BUYER HOME PAGE & DATABASE CART / WISHLIST
// ===================================================

// Database-backed Add to Cart Function (Supports both static & dynamic products)
async function addToCart(productId, productName) {
  const userId = localStorage.getItem('userId') || 1; 

  // Fallback if productName is passed as 'undefined' from static cards
  if (!productName || productName === 'undefined') {
    const card = event.target.closest('.product-card');
    if (card) {
      const titleElem = card.querySelector('.product-title');
      if (titleElem) productName = titleElem.textContent;
    }
  }
  productName = productName || 'Magical Item';

  try {
    const response = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, product_id: productId || 1, quantity: 1 })
    });

    if (response.ok) {
      showCutePopup(`🛒 Added "${productName}" to your cart!`);
      updateCartBadgeCount();
    } else {
      showCutePopup('⚠️ Failed to add item to cart.');
    }
  } catch (err) {
    console.error('Error adding to cart:', err);
    showCutePopup('⚠️ Server error adding to cart.');
  }
}

// Database-backed Wishlist Toggle Function
async function toggleWishlist(button, productId, productName) {
  const userId = localStorage.getItem('userId') || 1;

  if (button.textContent === '🤍') {
    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, product_id: productId })
      });

      if (response.ok) {
        button.textContent = '💖';
        showCutePopup(`❤️ Saved "${productName}" to wishlist!`);
      }
    } catch (err) {
      console.error('Error adding to wishlist:', err);
    }
  } else {
    button.textContent = '🤍';
    showCutePopup(`💔 Removed "${productName}" from wishlist.`);
  }
}

// Load Cart Items on Cart Page (Updated with INR symbol ₹)
async function loadCart() {
  const userId = localStorage.getItem('userId') || 1;
  const container = document.getElementById('cart-items-container');
  if (!container) return; // Exit if not on cart page

  try {
    const response = await fetch(`/api/cart/${userId}`);
    const cartItems = await response.json();
    
    container.innerHTML = '';
    
    if (cartItems.length === 0) {
      container.innerHTML = '<p>Your cart is empty 🛍️</p>';
      return;
    }

    cartItems.forEach(item => {
      container.innerHTML += `
        <div class="cart-item" style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4>${item.name}</h4>
            <p>Price: ₹${item.price} | Qty: ${item.quantity}</p>
          </div>
          <button onclick="removeFromCart(${item.cart_id})" style="background: #ef4444; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer;">Remove</button>
        </div>
      `;
    });
  } catch (err) {
    console.error('Error loading cart:', err);
  }
}

async function removeFromCart(cartId) {
  try {
    await fetch(`/api/cart/${cartId}`, { method: 'DELETE' });
    showCutePopup('🗑️ Item removed from cart.');
    loadCart();
  } catch (err) {
    console.error('Error removing item:', err);
  }
}

async function updateCartBadgeCount() {
  const userId = localStorage.getItem('userId') || 1;
  const cartBadge = document.getElementById('cartCount');
  if (!cartBadge) return;

  try {
    const response = await fetch(`/api/cart/${userId}`);
    const cartItems = await response.json();
    cartBadge.textContent = cartItems.length;
  } catch (err) {
    console.error('Error updating cart count:', err);
  }
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
  loadCart();
  updateCartBadgeCount();
});

// ===================================================
// STAGE 6 - SELLER DASHBOARD FUNCTIONALITY
// ===================================================

function deleteProduct(button, productName) {
  const row = button.closest('tr');
  row.remove();
  
  const list = document.getElementById('sellerProductList');
  if (list) {
    const countBadge = document.getElementById('activeProductsCount');
    if (countBadge) countBadge.textContent = list.children.length;
  }
  
  showCutePopup(`🗑️ Removed "${productName}" from listings!`);
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

// ===================================================
// API CONNECTIONS (LOGIN, REGISTER, PRODUCTS)
// ===================================================

const loginBtn = document.getElementById('loginBtn');
if (loginBtn) {
    loginBtn.addEventListener('click', async (e) => {
        e.preventDefault();

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
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('username', data.username);
                alert('Login successful! Welcome, ' + data.username);
                
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

const registerBtn = document.getElementById('registerBtn');
if (registerBtn) {
    registerBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const username = document.getElementById('regUsername').value;
        const password = document.getElementById('regPassword').value;
        const role = document.getElementById('regRole') ? document.getElementById('regRole').value : 'buyer';

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                window.location.href = 'login.html';
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert('Something went wrong connecting to the server!');
        }
    });
}

const addProductBtn = document.getElementById('addProductBtn');
if (addProductBtn) {
    addProductBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const name = document.getElementById('productName').value;
        const price = parseFloat(document.getElementById('productPrice').value);
        const seller = localStorage.getItem('username') || 'Unknown Seller';

        try {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, price, seller })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Product added successfully!');
                location.reload();
            } else {
                alert('Error: ' + data.error);
            }
        } catch (err) {
            console.error('Error adding product:', err);
            alert('Something went wrong connecting to the server!');
        }
    });
}

async function addDemoProduct() {
    const name = prompt("Enter product name:");
    if (!name) return;

    const priceInput = prompt("Enter product price (₹):");
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
            location.reload();
        } else {
            alert('Error: ' + data.error);
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Failed to connect to server!');
    }
}

// Fetch and display database products on the buyer home page (Updated with INR symbol ₹)
async function loadProducts() {
    const productContainer = document.getElementById('productsGrid');
    if (!productContainer) return;

    try {
        const response = await fetch('/api/products');
        const products = await response.json();

        if (products.length === 0) return;

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.setAttribute('data-category', 'all');
            productCard.innerHTML = `
                <span class="product-badge">Live Listing</span>
                <button class="wishlist-btn" onclick="toggleWishlist(this, ${product.id}, '${product.name}')">🤍</button>
                <div class="product-img-box">📦</div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">Seller: ${product.seller}</p>
                <div class="product-rating">★ 5.0 (New)</div>
                <div class="product-footer">
                    <span class="product-price">₹${product.price.toFixed(2)}</span>
                    <button class="add-cart-btn" onclick="addToCart(${product.id}, '${product.name}')">+ Add to Cart</button>
                </div>
            `;
            productContainer.appendChild(productCard);
        });
    } catch (err) {
        console.error('Error loading products:', err);
    }
}

window.addEventListener('DOMContentLoaded', loadProducts);

// Admin User Management
async function loadAdminUsers() {
    const userTableBody = document.getElementById('userListBody'); 
    if (!userTableBody) return;

    try {
        const response = await fetch('/api/admin/users');
        const data = await response.json();
        const users = data.users || data;

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