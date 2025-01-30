let allProducts = []; // Will store all products

// Function to load products with filtering
async function loadProducts() {
    try {
        // Fix the path to load_products.php
        const response = await fetch('/admin/database/products/load_products.php');
        console.log('Loading products...');

        const result = await response.json();
        console.log('Products data:', result);

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
    console.log('Displaying products:', products);

    if (!products || products.length === 0) {
        grid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: rgba(255,255,255,0.3);"></i>
                <p style="margin-top: 1rem; color: rgba(255,255,255,0.7);">No products found</p>
            </div>
        `;
        return;
    }

    grid.innerHTML = products.map(product => {
                // Handle specs safely
                const specs = product.specs || {};

                // Clean up specs object - remove any invalid entries
                const cleanSpecs = Object.entries(specs)
                    .filter(([key, value]) => key && value) // Remove empty entries
                    .reduce((obj, [key, value]) => {
                        obj[key.trim()] = value.trim();
                        return obj;
                    }, {});

                // Handle missing or empty images
                const mainImage = product.image_url || (product.images ? product.images.split(',')[0] : '') || '/admin/assets/images/placeholder.jpg';

                return `
            <div class="product-card" data-product-id="${product.id}">
                <img src="${mainImage}" alt="${product.name}" class="product-image">
                <div class="product-details">
                    <div class="product-category">${product.category || 'Uncategorized'}</div>
                    <h3 class="product-name">${product.name}</h3>
                    ${Object.keys(cleanSpecs).length > 0 ? `
                        <div class="product-specs">
                            ${Object.entries(cleanSpecs).map(([key, value]) => `
                                <div class="spec-item">
                                    <span class="spec-label">${key}:</span>
                                    <span>${value}</span>
                                </div>
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="product-price">${formatMAD(product.price || 0)}</div>
                    <div class="stock-status">
                        <span>${Number(product.stock) > 0 ? 'In Stock' : 'Out of Stock'}</span>
                        <span>${product.stock || 0} units</span>
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
        `;
    }).join('');
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

// Add this after existing variables
const categorySpecs = {
    laptops: [
        { key: 'processor', label: 'Processor', placeholder: 'e.g., Intel Core i7-12700H' },
        { key: 'graphics', label: 'Graphics', placeholder: 'e.g., NVIDIA RTX 3060 6GB' },
        { key: 'ram', label: 'RAM', placeholder: 'e.g., 16GB DDR4' },
        { key: 'storage', label: 'Storage', placeholder: 'e.g., 1TB NVMe SSD' },
        { key: 'display', label: 'Display', placeholder: 'e.g., 15.6-inch FHD 144Hz' },
        { key: 'os', label: 'Operating System', placeholder: 'e.g., Windows 11' },
        { key: 'battery', label: 'Battery', placeholder: 'e.g., 90WHr' },
        { key: 'weight', label: 'Weight', placeholder: 'e.g., 2.3 kg' }
    ],
    desktops: [
        { key: 'processor', label: 'Processor', placeholder: 'e.g., Intel Core i9-12900K' },
        { key: 'graphics', label: 'Graphics', placeholder: 'e.g., NVIDIA RTX 3080 12GB' },
        { key: 'ram', label: 'RAM', placeholder: 'e.g., 32GB DDR5' },
        { key: 'storage', label: 'Storage', placeholder: 'e.g., 2TB NVMe SSD' },
        { key: 'motherboard', label: 'Motherboard', placeholder: 'e.g., ASUS ROG Z690' },
        { key: 'psu', label: 'Power Supply', placeholder: 'e.g., 850W Gold' },
        { key: 'case', label: 'Case', placeholder: 'e.g., NZXT H510' },
        { key: 'cooling', label: 'Cooling', placeholder: 'e.g., 360mm AIO' }
    ]
};

// Add these new functions
function updateSpecFields() {
    const category = document.querySelector('select[name="category"]').value;
    const specsContainer = document.getElementById('specsContainer');
    const dynamicSpecs = document.getElementById('dynamicSpecs');
    
    if (categorySpecs[category]) {
        specsContainer.style.display = 'block';
        dynamicSpecs.innerHTML = categorySpecs[category].map(spec => `
            <div class="form-group">
                <label class="form-label">${spec.label}</label>
                <input type="text" 
                       class="form-input" 
                       name="specs[${spec.key}]" 
                       placeholder="${spec.placeholder}">
            </div>
        `).join('');
    } else {
        specsContainer.style.display = 'none';
        dynamicSpecs.innerHTML = '';
    }
}

// Update the saveProduct function to handle specs
async function saveProduct(event) {
    event.preventDefault();
    console.log('Form submission started');
    
    try {
        const form = event.target;
        const formData = new FormData(form);
        
        // Collect specs into an object
        const specs = {};
        const specsInputs = form.querySelectorAll('input[name^="specs["]');
        specsInputs.forEach(input => {
            const key = input.name.match(/\[(.*?)\]/)[1];
            specs[key] = input.value;
        });
        
        // Add specs to formData
        formData.set('specs', JSON.stringify(specs));
        
        // Handle multiple files
        const fileInput = form.querySelector('input[type="file"]');
        if (fileInput.files.length > 0) {
            // Remove any existing file entries
            formData.delete('images[]');
            // Add each file with the correct name
            for (let i = 0; i < fileInput.files.length; i++) {
                formData.append('images[]', fileInput.files[i]);
            }
        }

        // Log form data for debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

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
            console.error('Failed to parse server response:', rawResponse);
            throw new Error('Server response was not valid JSON. Check the console for details.');
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
            // Remove the product card from UI
            const productCard = document.querySelector(`[data-product-id="${id}"]`);
            if (productCard) {
                productCard.remove();
            }
            await loadProducts(); // Refresh the product list
        } else {
            throw new Error(result.message || 'Failed to delete product');
        }
    } catch (error) {
        console.error('Error:', error);
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

    const categorySelect = document.querySelector('select[name="category"]');
    categorySelect.addEventListener('change', updateSpecFields);

    // Add event listener for edit category select
    const editCategorySelect = document.querySelector('select[name="category"]#editCategory');
    if (editCategorySelect) {
        editCategorySelect.addEventListener('change', function() {
            updateEditSpecFields();
        });
    }
});

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('addProductModal');
    if (event.target === modal) {
        closeModal();
    }
}

async function editProduct(id) {
    try {
        console.log('Editing product:', id); // Debug log
        const response = await fetch(`/admin/database/products/get_product.php?id=${id}`);
        const rawResponse = await response.text();
        console.log('Raw response:', rawResponse); // Debug log

        const result = JSON.parse(rawResponse);
        
        if (result.success) {
            const product = result.data;
            console.log('Product data:', product); // Debug log
            
            // Fill the edit form with product data
            document.getElementById('editProductId').value = product.id;
            document.getElementById('editName').value = product.name;
            document.getElementById('editCategory').value = product.category;
            document.getElementById('editPrice').value = product.price;
            document.getElementById('editStock').value = product.stock;
            document.getElementById('editDescription').value = product.description || '';

            // Parse specs if it's a string
            const specs = typeof product.specs === 'string' ? 
                JSON.parse(product.specs) : product.specs;

            // Handle specs
            if (categorySpecs[product.category]) {
                document.getElementById('editSpecsContainer').style.display = 'block';
                updateEditSpecFields(specs);
            }

            // Show the modal
            document.getElementById('editProductModal').style.display = 'block';
            document.body.style.overflow = 'hidden';
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('Error fetching product:', error);
        alert('Error loading product details: ' + error.message);
    }
}

function updateEditSpecFields(existingSpecs = {}) {
    const category = document.getElementById('editCategory').value;
    const specsContainer = document.getElementById('editSpecsContainer');
    const dynamicSpecs = document.getElementById('editDynamicSpecs');
    
    if (categorySpecs[category]) {
        specsContainer.style.display = 'block';
        dynamicSpecs.innerHTML = categorySpecs[category].map(spec => `
            <div class="form-group">
                <label class="form-label">${spec.label}</label>
                <input type="text" 
                       class="form-input" 
                       name="specs[${spec.key}]" 
                       value="${existingSpecs[spec.key] || ''}"
                       placeholder="${spec.placeholder}">
            </div>
        `).join('');
    } else {
        specsContainer.style.display = 'none';
        dynamicSpecs.innerHTML = '';
    }
}

function closeEditModal() {
    document.getElementById('editProductModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    document.getElementById('editProductForm').reset();
}

async function updateProduct(event) {
    event.preventDefault();
    
    try {
        const form = event.target;
        const formData = new FormData(form);
        
        // Handle specs
        const specs = {};
        const specsInputs = form.querySelectorAll('input[name^="specs["]');
        specsInputs.forEach(input => {
            const key = input.name.match(/\[(.*?)\]/)[1];
            specs[key] = input.value;
        });
        formData.set('specs', JSON.stringify(specs));

        const response = await fetch('/admin/database/products/update_product.php', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();
        
        if (result.success) {
            alert('Product updated successfully!');
            closeEditModal();
            await loadProducts();
        } else {
            throw new Error(result.message || 'Failed to update product');
        }
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Error updating product: ' + error.message);
    }
}