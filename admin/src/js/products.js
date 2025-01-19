let allProducts = []; // Will store all products

// Function to load products with filtering
async function loadProducts() {
    try {
        const response = await fetch('../database/products/load_products.php');
        const result = await response.json();

        if (result.success) {
            allProducts = result.data;
            filterProducts();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function filterProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const category = document.getElementById('categoryFilter').value;
    const brand = document.getElementById('brandFilter').value;
    const sortBy = document.getElementById('sortFilter').value;

    let filteredProducts = allProducts.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm);
        const matchesCategory = !category || product.category === category;
        const matchesBrand = !brand || product.brand === brand;

        return matchesSearch && matchesCategory && matchesBrand;
    });

    // Sort products
    if (sortBy) {
        filteredProducts.sort((a, b) => {
            switch (sortBy) {
                case 'price-asc':
                    return a.price - b.price;
                case 'price-desc':
                    return b.price - a.price;
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'newest':
                    return b.id - a.id;
                case 'bestselling':
                    return b.sales - a.sales;
                default:
                    return 0;
            }
        });
    }

    displayProducts(filteredProducts);
}

function displayProducts(products) {
    const grid = document.getElementById('productsGrid');

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: rgba(255,255,255,0.3);"></i>
                <p style="margin-top: 1rem; color: rgba(255,255,255,0.7);">No products found</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image || 'path/to/placeholder.jpg'}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-specs">
                    ${Object.entries(product.specs).map(([key, value]) => `
                        <div class="spec-item">
                            <span class="spec-label">${key}:</span>
                            <span>${value}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="product-price">${formatMAD(product.price)}</div>
                <div class="stock-status">
                    <span>In Stock</span>
                    <span>${product.stock} units</span>
                </div>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Add debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize with debounced search
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const debouncedFilter = debounce(() => filterProducts(), 300);
    searchInput.addEventListener('input', debouncedFilter);
    
    loadProducts();
});

function openAddProductModal() {
    document.getElementById('addProductModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('addProductModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('productForm').reset();
    document.getElementById('imagePreview').innerHTML = '';
}

function previewImages(event) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    const files = event.target.files;

    for (const file of files) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-img';
            preview.appendChild(img);
        }
        reader.readAsDataURL(file);
    }
}

async function saveProduct(event) {
    event.preventDefault();
    console.log('Form submission started');
    
    try {
        const form = event.target;
        const formData = new FormData(form);

        // Log form data for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Fix the path to the PHP file
        const response = await fetch('/admin/database/products/add_product.php', {
            method: 'POST',
            body: formData
        });

        // Log the raw response for debugging
        const rawResponse = await response.text();
        console.log('Raw server response:', rawResponse);

        // Try to parse the response as JSON
        let result;
        try {
            result = JSON.parse(rawResponse);
        } catch (e) {
            throw new Error('Server response was not valid JSON: ' + rawResponse.substring(0, 100));
        }

        if (result.success) {
            alert('Product added successfully!');
            closeModal();
            await loadProducts();
        } else {
            throw new Error(result.message || 'Failed to add product');
        }
    } catch (error) {
        console.error('Error in saveProduct:', error);
        alert('Error adding product: ' + error.message);
    }
}

async function deleteProduct(id) {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
        const formData = new FormData();
        formData.append('id', id);

        const response = await fetch('../database/products/delete_product.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        if (result.success) {
            await loadProducts();
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        alert('Error deleting product: ' + error.message);
    }
}

// Add currency formatter helper
function formatMAD(amount) {
    return new Intl.NumberFormat('fr-MA', {
        style: 'currency',
        currency: 'MAD'
    }).format(amount);
}

// Add mobile navigation handlers
function showMore(event) {
    event.preventDefault();
    event.stopPropagation();
    const moreMenu = document.getElementById('moreMenu');
    const isVisible = moreMenu.style.display === 'block';
    moreMenu.style.display = isVisible ? 'none' : 'block';
}

// Close more menu when clicking outside
document.addEventListener('click', function(event) {
    const moreMenu = document.getElementById('moreMenu');
    const moreButton = event.target.closest('.mobile-nav-item');
    const moreMenuContent = event.target.closest('#moreMenu');

    if (!moreButton && !moreMenuContent && moreMenu.style.display === 'block') {
        moreMenu.style.display = 'none';
    }
});

// Create rain effect
function createRain() {
    const rain = document.querySelector('.rain');
    const dropCount = 200;

    for (let i = 0; i < dropCount; i++) {
        const drop = document.createElement('span');
        drop.style.left = Math.random() * 100 + '%';
        drop.style.animationDelay = Math.random() * 2 + 's';
        drop.style.animationDuration = Math.random() * 1 + 1 + 's';
        rain.appendChild(drop);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    createRain();
    loadProducts();

    // Set active state for both sidebar and mobile nav
    const currentPage = window.location.pathname.split('/').pop() || 'Dashboard.html';
    document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(item => {
        if (item.getAttribute('href') === currentPage) {
            item.classList.add('active');
        }
    });
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addProductModal');
    if (event.target === modal) {
        closeModal();
    }
}