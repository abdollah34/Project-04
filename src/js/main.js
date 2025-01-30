// App State
const state = {
    products: [],
    cart: [],
    filters: {
        category: 'all',
        maxPrice: 50000,
        searchQuery: ''
    }
};

// Add fetch function
async function fetchProducts() {
    try {
        const response = await fetch('../admin/database/products/get_products.php');
        const data = await response.json();
        state.products = data;
        productDisplay.init();
    } catch (error) {
        console.error('Error fetching products:', error);
    }
}

// Cart Management
const cart = {
    add(productId, quantity = 1) {
        const product = state.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = state.cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            state.cart.push({...product, quantity });
        }
        this.updateCartUI();
        this.showNotification(`${product.name} added to cart!`);
    },

    remove(productId) {
        state.cart = state.cart.filter(item => item.id !== productId);
        this.updateCartUI();
    },

    updateCartUI() {
        const itemCount = state.cart.reduce((total, item) => total + item.quantity, 0);

        // Update desktop cart icon
        const cartIcon = document.querySelector('.nav-icons .fa-shopping-cart');
        if (cartIcon) {
            cartIcon.setAttribute('data-count', itemCount);
        }

        // Update mobile cart icon
        const mobileCartLink = document.querySelector('.mobile-bottom-nav a[href="#cart"]');
        if (mobileCartLink) {
            mobileCartLink.setAttribute('data-count', itemCount);
        }
    },

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 3000);
    }
};

// Product Display
const productDisplay = {
    init() {
        this.renderProducts(state.products);
    },

    renderProducts(products) {
        const productGrid = document.querySelector('.product-grid');
        if (!productGrid) return;

        productGrid.innerHTML = '';
        products.forEach(product => {
            const productCard = this.createProductCard(product);
            productGrid.appendChild(productCard);
        });
    },

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';

        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='src/images/placeholder.jpg'">
                <div class="product-overlay">
                    <button onclick="showProductModal(${product.id})" class="quick-look-btn">
                        <i class="fas fa-search"></i> Quick Look
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="price-row">
                    <p class="price">${product.price.toFixed(2)}</p>
                    <div class="rating">
                        ${this.createRatingStars(product.rating)}
                    </div>
                </div>
            </div>
        `;

        return card;
    },

    createRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        let stars = '';

        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        }
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star"></i>';
        }

        return stars;
    }
};

// Modal Functions
function showProductModal(productId) {
    const product = state.products.find(p => p.id === productId);
    if (!product) return;

    const modal = document.getElementById('product-modal');

    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-image').alt = product.name;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = product.price.toFixed(2);
    document.getElementById('modal-product-description').textContent = product.description;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        const quantityInput = document.getElementById('quantity');
        if (quantityInput) {
            quantityInput.value = 1;
        }
    }
}

function increaseQty() {
    const qty = document.getElementById('quantity');
    if (qty) {
        const newValue = parseInt(qty.value) + 1;
        qty.value = Math.min(newValue, 99); // Set maximum quantity
    }
}

function decreaseQty() {
    const qty = document.getElementById('quantity');
    if (qty) {
        const newValue = parseInt(qty.value) - 1;
        qty.value = Math.max(newValue, 1); // Ensure minimum is 1
    }
}

function addToCartFromModal() {
    const productName = document.getElementById('modal-product-name').textContent;
    const product = state.products.find(p => p.name === productName);
    const quantity = parseInt(document.getElementById('quantity').value);

    if (product && quantity > 0) {
        cart.add(product.id, quantity);
        closeModal();
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    cart.updateCartUI(); // Initialize cart UI on load

    // Modal handling
    const closeBtn = document.getElementById('modalCloseButton');
    const modal = document.getElementById('product-modal');

    if (closeBtn && modal) {
        closeBtn.onclick = (e) => {
            e.preventDefault();
            closeModal();
        };

        modal.onclick = (e) => {
            if (e.target === modal) closeModal();
        };
    }

    // Close on escape key - fixed optional chaining
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Mobile Menu Handler - improved error handling
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            const icon = mobileMenuBtn.querySelector('i');
            if (icon) {
                navLinks.classList.toggle('mobile-active');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
                document.body.style.overflow = navLinks.classList.contains('mobile-active') ? 'hidden' : '';
            }
        });

        // Close mobile menu when clicking links
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                navLinks.classList.remove('mobile-active');
                const icon = mobileMenuBtn.querySelector('i');
                if (icon) {
                    icon.classList.replace('fa-times', 'fa-bars');
                }
                document.body.style.overflow = '';
            }
        });
    }

    // Set active state for mobile navigation
    const mobileNavLinks = document.querySelectorAll('.mobile-bottom-nav a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            mobileNavLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
        });
    });

    // Add error handling for images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'src/images/placeholder.jpg';
        });
    });
});