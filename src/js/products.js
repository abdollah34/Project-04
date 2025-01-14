// Sample product data (you can replace this with your API or database data)
const products = [
    // Smartphones
    {
        id: 1,
        name: "iPhone 14 Pro",
        price: 9999,
        category: "smartphones",
        description: "Latest iPhone with dynamic island and pro camera system",
        image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Samsung Galaxy S23 Ultra",
        price: 8999,
        category: "smartphones",
        description: "Premium Android smartphone with S-Pen support",
        image: "https://images.unsplash.com/photo-1678685888425-d776360866d3?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Google Pixel 7 Pro",
        price: 7999,
        category: "smartphones",
        description: "Pure Android experience with exceptional camera",
        image: "https://images.unsplash.com/photo-1678685888466-30f46e56a649?auto=format&fit=crop&w=800&q=80"
    },

    // More Smartphones
    {
        id: 16,
        name: "OnePlus 11",
        price: 6999,
        category: "smartphones",
        description: "Fast charging flagship with Hasselblad cameras",
        image: "https://images.unsplash.com/photo-1676467178878-e0972526c548?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 17,
        name: "Xiaomi 13 Pro",
        price: 7499,
        category: "smartphones",
        description: "Premium smartphone with Leica optics",
        image: "https://images.unsplash.com/photo-1678685888466-30f46e56a649?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 18,
        name: "Nothing Phone 2",
        price: 4999,
        category: "smartphones",
        description: "Unique design with Glyph interface",
        image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?auto=format&fit=crop&w=800&q=80"
    },

    // Laptops
    {
        id: 4,
        name: "MacBook Pro 16",
        price: 15999,
        category: "laptops",
        description: "Powerful laptop with M2 Pro chip",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Dell XPS 15",
        price: 12999,
        category: "laptops",
        description: "Premium Windows laptop with OLED display",
        image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        name: "Lenovo ThinkPad X1",
        price: 11999,
        category: "laptops",
        description: "Business laptop with legendary reliability",
        image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80"
    },

    // More Laptops
    {
        id: 19,
        name: "ASUS ROG Zephyrus",
        price: 13999,
        category: "laptops",
        description: "Premium gaming laptop with RTX 4080",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 20,
        name: "Razer Blade 15",
        price: 14999,
        category: "laptops",
        description: "Ultra-powerful gaming laptop",
        image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 21,
        name: "HP Spectre x360",
        price: 9999,
        category: "laptops",
        description: "Premium 2-in-1 laptop with OLED display",
        image: "https://images.unsplash.com/photo-1544731612-de7f96afe55f?auto=format&fit=crop&w=800&q=80"
    },

    // Accessories
    {
        id: 7,
        name: "AirPods Pro",
        price: 1999,
        category: "accessories",
        description: "Premium wireless earbuds with noise cancellation",
        image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 8,
        name: "Sony WH-1000XM4",
        price: 2499,
        category: "accessories",
        description: "High-end wireless headphones",
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 9,
        name: "Samsung Galaxy Watch 5",
        price: 1799,
        category: "accessories",
        description: "Advanced smartwatch with health features",
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 10,
        name: "iPad Pro 12.9",
        price: 8499,
        category: "tablets",
        description: "Powerful tablet for professionals",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 11,
        name: "Gaming Mouse",
        price: 499,
        category: "accessories",
        description: "RGB gaming mouse with 16000 DPI",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 12,
        name: "Mechanical Keyboard",
        price: 899,
        category: "accessories",
        description: "RGB mechanical keyboard with blue switches",
        image: "https://images.unsplash.com/photo-1601445638532-3c6f6c3aa1d6?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 13,
        name: "4K Gaming Monitor",
        price: 3999,
        category: "accessories",
        description: "27-inch 4K monitor with 144Hz refresh rate",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 14,
        name: "Samsung Galaxy Tab S8",
        price: 5999,
        category: "tablets",
        description: "Premium Android tablet with S-Pen",
        image: "https://images.unsplash.com/photo-1632634571086-44a8be575675?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 15,
        name: "Nintendo Switch OLED",
        price: 2999,
        category: "gaming",
        description: "Portable gaming console with OLED display",
        image: "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&w=800&q=80"
    },

    // More Accessories
    {
        id: 22,
        name: "Logitech MX Master 3",
        price: 799,
        category: "accessories",
        description: "Premium wireless mouse for productivity",
        image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 23,
        name: "Samsung 49\" Odyssey G9",
        price: 9999,
        category: "accessories",
        description: "Ultra-wide curved gaming monitor",
        image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80"
    },

    // Gaming Category
    {
        id: 24,
        name: "PS5 Digital Edition",
        price: 3999,
        category: "gaming",
        description: "Next-gen gaming console",
        image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 25,
        name: "Xbox Series X",
        price: 4499,
        category: "gaming",
        description: "Microsoft's most powerful console",
        image: "https://images.unsplash.com/photo-1621259182978-fbf433f6a536?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 26,
        name: "Gaming Chair",
        price: 1499,
        category: "gaming",
        description: "Ergonomic gaming chair with RGB",
        image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6?auto=format&fit=crop&w=800&q=80"
    },

    // Tablets Category
    {
        id: 27,
        name: "Samsung Tab S9 Ultra",
        price: 7999,
        category: "tablets",
        description: "Large screen Android tablet with S-Pen",
        image: "https://images.unsplash.com/photo-1632634571086-44a8be575675?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 28,
        name: "Xiaomi Pad 6 Pro",
        price: 2999,
        category: "tablets",
        description: "High-performance Android tablet",
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80"
    },

    // Smart Home
    {
        id: 29,
        name: "Amazon Echo Show 15",
        price: 1999,
        category: "smart-home",
        description: "Large smart display with Alexa",
        image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 30,
        name: "Philips Hue Starter Kit",
        price: 899,
        category: "smart-home",
        description: "Smart lighting system",
        image: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=800&q=80"
    },

    // Cameras
    {
        id: 31,
        name: "Sony A7 IV",
        price: 15999,
        category: "cameras",
        description: "Full-frame mirrorless camera",
        image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 32,
        name: "DJI Mini 3 Pro",
        price: 4999,
        category: "cameras",
        description: "Compact 4K drone with obstacle avoidance",
        image: "https://images.unsplash.com/photo-1524143986875-3b098d78b363?auto=format&fit=crop&w=800&q=80"
    }
];

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
    displayProducts(products);
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
    productGrid.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-overlay">
                    <button class="quick-look-btn" onclick="openModal(${product.id})">
                        <i class="fas fa-eye"></i> Quick Look
                    </button>
                </div>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="description">${product.description}</p>
                <div class="price-row">
                    <div class="price">${product.price} MAD</div>
                    <button class="add-to-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
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
    document.querySelector('.cart-icon').setAttribute('data-count', cartCount);
    document.querySelector('.mobile-bottom-nav a[href="cart.html"]').setAttribute('data-count', cartCount);
}

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