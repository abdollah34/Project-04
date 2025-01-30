// Replace the static products array with a fetch call
let products = [];

// Fetch products from the database
async function fetchProducts() {
    try {
        const response = await fetch('/admin/database/products/get_products.php');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        products = data;
        filteredProducts = [...products];
        console.log('Fetched products:', products); // Debug log
        displayProducts(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        productGrid.innerHTML = '<p>Error loading products. Please try again later.</p>';
    }
}

// DOM Elements
const productGrid = document.getElementById('product-grid');
const modal = document.getElementById('product-modal');
const filterInputs = document.querySelectorAll('.filter-item input');
const priceSlider = document.querySelector('.price-slider');
const minPriceInput = document.querySelector('.min-price');
const maxPriceInput = document.querySelector('.max-price');
const sortSelect = document.getElementById('sort-by');
const applyFiltersBtn = document.querySelector('.apply-filters');

// State
let filteredProducts = [...products];
let activeFilters = {
    categories: [],
    minPrice: 0,
    maxPrice: 10000
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchProducts();
    setupEventListeners();
});

// Event Listeners Setup
function setupEventListeners() {
    // Filter checkbox events
    filterInputs.forEach(input => {
        input.addEventListener('change', updateFilters);
    });

    // Price range events
    priceSlider.addEventListener('input', updatePriceRange);
    minPriceInput.addEventListener('input', updatePriceInputs);
    maxPriceInput.addEventListener('input', updatePriceInputs);

    // Sort events
    sortSelect.addEventListener('change', sortProducts);

    // Apply filters button
    applyFiltersBtn.addEventListener('click', applyFilters);

    // Modal close button
    document.querySelector('.modal-close').addEventListener('click', closeModal);
}

// Display Products
function displayProducts(productsToShow) {
    console.log('Displaying products:', productsToShow); // Debug log
    if (!productsToShow || productsToShow.length === 0) {
        productGrid.innerHTML = '<p>No products available.</p>';
        return;
    }

    productGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" 
                     onerror="this.src='../images/placeholder.jpg'">
                <div class="product-overlay">
                    <button onclick="openModal(${product.id})" class="quick-look-btn">
                        <i class="fas fa-search"></i> Quick Look
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="price-row">
                    <p class="price">${parseFloat(product.price).toFixed(2)} MAD</p>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Update display function to handle image paths
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';

    // Fix image path to use admin/uploads/products
    const imagePath = product.image.startsWith('http') ?
        product.image :
        `../../admin/${product.image}`;

    card.innerHTML = `
        <div class="product-image">
            <img src="${imagePath}" alt="${product.name}" 
                 onerror="this.src='../images/placeholder.jpg'">
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
                <p class="price">${product.price.toFixed(2)} MAD</p>
                <div class="rating">
                    ${createRatingStars(product.rating)}
                </div>
            </div>
        </div>
    `;

    return card;
}

// Filter Functions
function updateFilters(e) {
    const category = e.target.value;
    if (e.target.checked) {
        activeFilters.categories.push(category);
    } else {
        activeFilters.categories = activeFilters.categories.filter(cat => cat !== category);
    }
}

function updatePriceRange(e) {
    const value = e.target.value;
    minPriceInput.value = 0;
    maxPriceInput.value = value;
    activeFilters.maxPrice = Number(value);
}

function updatePriceInputs(e) {
    const isMin = e.target.classList.contains('min-price');
    const value = Number(e.target.value);

    if (isMin) {
        activeFilters.minPrice = value;
    } else {
        activeFilters.maxPrice = value;
    }
}

function applyFilters() {
    filteredProducts = products.filter(product => {
        const matchesCategory = activeFilters.categories.length === 0 ||
            activeFilters.categories.includes(product.category);
        const matchesPrice = product.price >= activeFilters.minPrice &&
            product.price <= activeFilters.maxPrice;

        return matchesCategory && matchesPrice;
    });

    displayProducts(filteredProducts);
}

// Sort Functions
function sortProducts(e) {
    const sortBy = e.target.value;

    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'newest':
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        default:
            filteredProducts = [...products];
    }

    displayProducts(filteredProducts);
}

// Modal Functions
function openModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('modal-product-image').src = product.image;
    document.getElementById('modal-product-name').textContent = product.name;
    document.getElementById('modal-product-price').textContent = `${product.price}`;
    document.getElementById('modal-product-description').textContent = product.description;

    modal.classList.add('active');
}

function closeModal() {
    modal.classList.remove('active');
}

// Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Get existing cart or initialize empty array
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Add product to cart
    cart.push(product);

    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Show notification
    showNotification(`${product.name} added to cart!`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.length;

    // Update cart count in header and mobile nav
}
document.querySelector('.cart-icon').setAttribute('data-count', cartCount);
document.querySelector('.mobile-bottom-nav a[href="cart.html"]').setAttribute('data-count', cartCount);


function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize cart count on page load
updateCartCount();

// Initialize cart count on page load
updateCartCount();