// App State
const state = {
    products: [{
            id: 1,
            name: "iPhone 14 Pro Max",
            price: 14999.99,
            image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-14-pro-finish-select-202209-6-7inch-deeppurple?wid=800&hei=800&fmt=jpeg&qlt=90",
            description: "Latest iPhone with Dynamic Island, 48MP camera, A16 Bionic chip",
            category: "smartphones",
            rating: 4.8
        },
        {
            id: 2,
            name: "Samsung Galaxy S23 Ultra",
            price: 13499.99,
            image: "https://fdn2.gsmarena.com/vv/pics/samsung/samsung-galaxy-s23-ultra-5g-1.jpg",
            description: "200MP camera, S Pen, Snapdragon 8 Gen 2",
            category: "smartphones",
            rating: 4.7
        },
        {
            id: 3,
            name: "MacBook Pro 16\"",
            price: 24999.99,
            image: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mbp16-spacegray-select-202301?wid=800&hei=800&fmt=jpeg&qlt=90",
            description: "M2 Pro chip, 32GB RAM, 1TB SSD, 16-inch Liquid Retina XDR",
            category: "laptops",
            rating: 4.9
        },
        {
            id: 4,
            name: "Samsung QLED 4K TV",
            price: 9999.99,
            image: "https://images.samsung.com/is/image/samsung/p6pim/levant/qe65q80cafxzn/gallery/levant-qled-q80c-qe65q80cafxzn-536688183?$1300_1038_PNG$",
            description: "65\" Smart TV with Quantum Processor, HDR",
            category: "tvs",
            rating: 4.6
        },
        {
            id: 5,
            name: "Sony WH-1000XM4",
            price: 3499.99,
            image: "https://media.ldlc.com/r1600/ld/products/00/05/74/25/LD0005742587_1.jpg",
            description: "Industry-leading noise cancellation, 30-hour battery",
            category: "accessories",
            rating: 4.8
        },
        {
            id: 6,
            name: "Gaming PC RTX 4090",
            price: 39999.99,
            image: "https://static.gigabyte.com/StaticFile/Image/Global/01b62da85fc30dd8e5c6d458084eec80/Product/32447/Png",
            description: "NVIDIA RTX 4090, Intel i9, 64GB RAM, 2TB NVMe",
            category: "computers",
            rating: 4.9
        }
    ],
    cart: [],
    filters: {
        category: 'all',
        maxPrice: 50000,
        searchQuery: ''
    }
};

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
    productDisplay.init();
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