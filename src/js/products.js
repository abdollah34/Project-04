let products = [];
let filteredProducts = [];

// Update price formatting function
function formatPrice(price) {
    return `${price.toLocaleString('fr-MA')} MAD`;
}

// Add these cart management functions at the top level
function getCart() {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(cart);
}

function createFlyingImage(sourceElement, product) {
    // Get source element position
    const sourceRect = sourceElement.getBoundingClientRect();
    const cartIcon = document.querySelector('.cart-icon');
    const cartRect = cartIcon.getBoundingClientRect();

    // Create flying image
    const flyingImg = document.createElement('img');
    flyingImg.src = product.images[0];
    flyingImg.classList.add('flying-item');
    flyingImg.style.top = `${sourceRect.top}px`;
    flyingImg.style.left = `${sourceRect.left}px`;

    // Calculate the translation values
    const translateX = cartRect.left - sourceRect.left;
    const translateY = cartRect.top - sourceRect.top;

    // Add custom animation styles
    flyingImg.style.setProperty('--translate-x', `${translateX}px`);
    flyingImg.style.setProperty('--translate-y', `${translateY}px`);

    document.body.appendChild(flyingImg);

    // Remove flying image after animation
    flyingImg.addEventListener('animationend', () => {
        flyingImg.remove();
        // Bounce cart icon
        cartIcon.classList.add('bounce');
        setTimeout(() => cartIcon.classList.remove('bounce'), 500);
    });
}

function updateCartCount(cart) {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartIcons = document.querySelectorAll('.cart-icon');

    cartIcons.forEach(icon => {
        icon.classList.add('updating');
        icon.setAttribute('data-count', count);
        setTimeout(() => icon.classList.remove('updating'), 300);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('product-grid');

    // Add loading state
    productGrid.innerHTML = '<div class="loading">Loading products...</div>';

    // Fix the fetch URL path - adjust this path to match your server setup
    fetch('/admin/database/products/get_products.php')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                // Ensure products array is properly formatted
                products = data.products.map(product => ({
                    id: parseInt(product.id),
                    name: product.name,
                    price: parseFloat(product.price),
                    description: product.description || '',
                    stock: parseInt(product.stock) || 0,
                    images: Array.isArray(product.images) ? product.images : [],
                    specs: product.specs || {}
                }));

                if (products.length === 0) {
                    productGrid.innerHTML = '<div class="info">No products found</div>';
                } else {
                    initializeProducts();
                }
            } else {
                throw new Error(data.message || 'Failed to load products');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            productGrid.innerHTML = `
                <div class="error">
                    <p>Error loading products</p>
                    <p class="error-details">${error.message}</p>
                </div>
            `;
        });

    // Add modal close event listeners here
    document.querySelector('.modal-close').addEventListener('click', () => {
        document.getElementById('product-modal').classList.remove('active');
    });

    document.getElementById('product-modal').addEventListener('click', (e) => {
        if (e.target.id === 'product-modal') {
            e.target.classList.remove('active');
        }
    });

    // Quantity controls
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            handleQuantity(btn.dataset.action);
        });
    });

    // Initialize cart count
    updateCartCount(getCart());

    // Add filter functionality
    const priceSlider = document.getElementById('price-slider');
    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const applyFiltersBtn = document.getElementById('apply-filters');
    const categoryFilters = document.getElementById('category-filters');

    // Initialize price range inputs
    priceSlider.addEventListener('input', (e) => {
        maxPriceInput.value = e.target.value;
    });

    minPriceInput.addEventListener('input', (e) => {
        const min = parseInt(e.target.value) || 0;
        const max = parseInt(maxPriceInput.value) || parseInt(priceSlider.max);
        if (min > max) {
            maxPriceInput.value = min;
            priceSlider.value = min;
        }
    });

    maxPriceInput.addEventListener('input', (e) => {
        const max = parseInt(e.target.value) || parseInt(priceSlider.max);
        const min = parseInt(minPriceInput.value) || 0;
        if (max < min) {
            minPriceInput.value = max;
        }
        priceSlider.value = max;
    });

    // Apply filters function
    function applyFilters() {
        const selectedCategories = Array.from(categoryFilters.querySelectorAll('input:checked'))
            .map(input => input.value);

        const minPrice = parseInt(minPriceInput.value) || 0;
        const maxPrice = parseInt(maxPriceInput.value) || Infinity;

        filteredProducts = products.filter(product => {
            const matchesCategory = selectedCategories.length === 0 ||
                selectedCategories.includes(product.category);
            const matchesPrice = product.price >= minPrice && product.price <= maxPrice;

            return matchesCategory && matchesPrice;
        });

        // Update display
        const productGrid = document.getElementById('product-grid');
        if (filteredProducts.length === 0) {
            productGrid.innerHTML = '<div class="info">No products match your filters</div>';
        } else {
            productGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
            // Reattach event listeners
            document.querySelectorAll('.quick-view-btn').forEach(btn => {
                btn.addEventListener('click', handleQuickView);
            });
            document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
                btn.addEventListener('click', handleAddToCart);
            });
        }
    }

    // Add filter event listeners
    applyFiltersBtn.addEventListener('click', applyFilters);

    // Sort functionality
    const sortSelect = document.getElementById('sort-by');
    sortSelect.addEventListener('change', () => {
        const sortValue = sortSelect.value;

        filteredProducts.sort((a, b) => {
            switch (sortValue) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'newest':
                    return new Date(b.date_added) - new Date(a.date_added);
                default: // 'featured'
                    return b.featured - a.featured;
            }
        });

        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');

        // Reattach event listeners
        document.querySelectorAll('.quick-view-btn').forEach(btn => {
            btn.addEventListener('click', handleQuickView);
        });
        document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
            btn.addEventListener('click', handleAddToCart);
        });
    });

    // Initialize filtered products
    filteredProducts = [...products];
});

function createProductCard(product) {
    const imageUrl = product.images && product.images.length > 0 ?
        product.images[0] :
        'https://placehold.co/400x400/png?text=No+Image';

    return `
    <div class="product-card">
        <div class="product-image">
            <img src="${imageUrl}" alt="${product.name}">
            ${product.stock < 10 ? `<span class="product-badge">Low Stock</span>` : ''}
        </div>
        <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-price">
                ${formatPrice(product.price)}
            </div>
            <div class="product-actions">
                <button class="quick-view-btn" data-product-id="${product.id}">
                    <i class="fas fa-eye"></i> Quick View
                </button>
                ${product.stock > 0 ? `
                    <button class="add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add
                    </button>
                ` : `
                    <button class="out-of-stock-btn" disabled>
                        Out of Stock
                    </button>
                `}
            </div>
        </div>
    </div>
    `;
}

// Load products and add event listeners
function initializeProducts() {
    filteredProducts = [...products];
    const productGrid = document.getElementById('product-grid');
    productGrid.innerHTML = filteredProducts.map(product => createProductCard(product)).join('');
    
    // Add event listeners for quick view and add to cart buttons
    document.querySelectorAll('.quick-view-btn').forEach(btn => {
        btn.addEventListener('click', handleQuickView);
    });
    
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', handleAddToCart);
    });

    // Set initial price range values
    const maxPrice = Math.max(...products.map(p => p.price));
    document.getElementById('price-slider').max = maxPrice;
    document.getElementById('max-price').value = maxPrice;
}

// Keep handleQuickView function outside DOMContentLoaded
function handleQuickView(e) {
    const productId = e.currentTarget.dataset.productId;
    const product = products.find(p => p.id == productId);
    
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const modalImg = document.getElementById('modal-product-image');
    const thumbnailsContainer = document.getElementById('modal-image-thumbnails');
    let currentImageIndex = 0;

    // Setup main image and thumbnails
    function updateMainImage(index) {
        modalImg.src = product.images[index];
        currentImageIndex = index;
        
        // Update thumbnails active state
        document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    // Clear and create thumbnails
    thumbnailsContainer.innerHTML = '';
    if (product.images && product.images.length > 0) {
        product.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            thumbnail.innerHTML = `<img src="${image}" alt="${product.name} ${index + 1}">`;
            thumbnail.addEventListener('click', () => updateMainImage(index));
            thumbnailsContainer.appendChild(thumbnail);
        });

        // Setup navigation buttons
        const prevBtn = modal.querySelector('.gallery-nav.prev');
        const nextBtn = modal.querySelector('.gallery-nav.next');

        prevBtn.onclick = () => {
            const newIndex = (currentImageIndex - 1 + product.images.length) % product.images.length;
            updateMainImage(newIndex);
        };

        nextBtn.onclick = () => {
            const newIndex = (currentImageIndex + 1) % product.images.length;
            updateMainImage(newIndex);
        };

        // Show/hide navigation buttons based on image count
        const navButtons = modal.querySelectorAll('.gallery-nav');
        navButtons.forEach(btn => {
            btn.style.display = product.images.length > 1 ? 'flex' : 'none';
        });

        // Initialize first image
        updateMainImage(0);
    }

    // Update other modal content
    const modalName = document.getElementById('modal-product-name');
    const modalPrice = document.getElementById('modal-product-price');
    const modalDesc = document.getElementById('modal-product-description');
    const modalSpecs = document.getElementById('modal-product-specs');
    
    modal.querySelector('.modal-content').dataset.productId = product.id;
    modalName.textContent = product.name;
    modalPrice.textContent = formatPrice(product.price);
    modalDesc.textContent = product.description || '';
    
    // Update specs
    modalSpecs.innerHTML = '';
    if (product.specs && Object.keys(product.specs).length > 0) {
        Object.entries(product.specs)
            .filter(([_, value]) => value !== null && value !== '')
            .forEach(([key, value]) => {
                const specItem = document.createElement('div');
                specItem.className = 'spec-item';
                specItem.innerHTML = `
                    <span class="spec-label">${key}:</span>
                    <span class="spec-value">${value}</span>
                `;
                modalSpecs.appendChild(specItem);
            });
    }
    
    // Setup add to cart button
    const addToCartBtn = modal.querySelector('.add-to-cart-btn');
    addToCartBtn.onclick = () => {
        createFlyingImage(addToCartBtn, product);
        addToCart(product, 1);
        
        addToCartBtn.textContent = 'Added to Cart!';
        addToCartBtn.classList.add('success');
        
        setTimeout(() => {
            addToCartBtn.textContent = 'Add to Cart';
            addToCartBtn.classList.remove('success');
        }, 2000);
    };
    
    modal.classList.add('active');
}

// Replace the existing handleAddToCart function with this enhanced version
function handleAddToCart(e) {
    const productId = e.currentTarget.dataset.productId;
    const product = products.find(p => p.id == productId);
    if (!product) return;

    // Create flying image effect
    createFlyingImage(e.currentTarget, product);

    const quantity = 1; // Default quantity when adding from product grid
    addToCart(product, quantity);

    // Show success message
    const button = e.currentTarget;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added';
    button.classList.add('success');
    
    setTimeout(() => {
        button.innerHTML = originalText;
        button.classList.remove('success');
    }, 2000);
}

// Add new function for handling modal add to cart
function handleModalAddToCart() {
    const productId = document.querySelector('.modal-content').dataset.productId;
    const product = products.find(p => p.id == productId);
    if (!product) return;

    const button = document.querySelector('.modal .add-to-cart-btn');
    // Create flying image effect from modal
    createFlyingImage(button, product);

    const quantity = parseInt(document.getElementById('quantity').value);
    addToCart(product, quantity);

    // Show success message in modal
    const originalText = button.textContent;
    button.textContent = 'Added to Cart';
    button.classList.add('success');
    
    setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('success');
    }, 2000);
}

// Update the addToCart function
function addToCart(product, quantity = 1) {
    if (!product || !product.id || !product.name || !product.price) {
        console.error('Invalid product data', product);
        return;
    }

    // Create a clean cart item with quantity
    const cartItem = {
        id: parseInt(product.id),
        name: product.name,
        price: parseFloat(product.price),
        quantity: 1, // Always set to 1
        image: product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://placehold.co/400x400/png?text=No+Image'
    };

    // Get existing cart
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(item => item.id === cartItem.id);
    
    if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += quantity;
    } else {
        // Add new item if it doesn't exist
        cart.push(cartItem);
    }
    
    // Save cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount(cart);
}