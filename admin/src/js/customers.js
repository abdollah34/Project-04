       // Product specific functions
       let allProducts = []; // Will store all products

       // Function to load products with filtering
       async function loadProducts() {
           try {
               // In real implementation, fetch from API
               // For demo, using sample data
               allProducts = [{
                       id: 1,
                       name: "ASUS ROG Strix G15",
                       category: "laptops",
                       brand: "asus",
                       price: 15999.99,
                       specs: {
                           processor: "Intel Core i7-12700H",
                           graphics: "RTX 3060 6GB",
                           ram: "16GB DDR4",
                           storage: "1TB NVMe SSD"
                       },
                       stock: 15,
                       sales: 42
                   }, {
                       id: 2,
                       name: "iPhone 14 Pro",
                       category: "smartphones",
                       brand: "apple",
                       price: 12999.99,
                       specs: {
                           processor: "A16 Bionic",
                           storage: "256GB",
                           ram: "6GB",
                           screen: "6.1 inch"
                       },
                       stock: 25,
                       sales: 78
                   }
                   // Add more products as needed
               ];

               filterProducts(); // Initial display with all products
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
           const form = event.target;
           const formData = new FormData(form);

           // Convert price to MAD if needed
           const price = formData.get('price');
           formData.set('price', `${price} MAD`);

           try {
               const response = await fetch('../api/products/add.php', {
                   method: 'POST',
                   body: formData
               });

               const data = await response.json();
               if (data.success) {
                   alert('Product added successfully!');
                   closeModal();
                   loadProducts(); // Refresh products list
               } else {
                   throw new Error(data.message);
               }
           } catch (error) {
               alert('Error adding product: ' + error.message);
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

       // Sample customers data
       let allCustomers = [{
           id: 1,
           name: "John Doe",
           email: "john.doe@example.com",
           phone: "+212 666-123456",
           joinDate: "2023-01-15",
           orders: 15
       }];

       // Customer management functions
       async function loadCustomers() {
           try {
               // In real implementation, fetch from API
               filterCustomers();
           } catch (error) {
               console.error('Error loading customers:', error);
           }
       }

       function filterCustomers() {
           const searchTerm = document.getElementById('searchInput').value.toLowerCase();
           const sortBy = document.getElementById('sortFilter').value;

           let filteredCustomers = allCustomers.filter(customer => {
               return customer.name.toLowerCase().includes(searchTerm) ||
                   customer.email.toLowerCase().includes(searchTerm);
           });

           // Sort customers
           if (sortBy) {
               filteredCustomers.sort((a, b) => {
                   switch (sortBy) {
                       case 'name':
                           return a.name.localeCompare(b.name);
                       case 'recent':
                           return new Date(b.joinDate) - new Date(a.joinDate);
                       case 'orders':
                           return b.orders - a.orders;
                       default:
                           return 0;
                   }
               });
           }

           displayCustomers(filteredCustomers);
       }

       function displayCustomers(customers) {
           const grid = document.getElementById('customersGrid');

           if (customers.length === 0) {
               grid.innerHTML = `
                   <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
                       <i class="fas fa-search" style="font-size: 3rem; color: rgba(255,255,255,0.3);"></i>
                       <p style="margin-top: 1rem; color: rgba(255,255,255,0.7);">No customers found</p>
                   </div>
               `;
               return;
           }

           grid.innerHTML = customers.map(customer => `
               <div class="customer-card">
                   <div class="customer-details">
                       <h3 class="customer-name">${customer.name}</h3>
                       <div class="customer-info">
                           <div class="info-item">
                               <span class="info-label">Email:</span>
                               <span>${customer.email}</span>
                           </div>
                           <div class="info-item">
                               <span class="info-label">Phone:</span>
                               <span>${customer.phone}</span>
                           </div>
                           <div class="info-item">
                               <span class="info-label">Join Date:</span>
                               <span>${formatDate(customer.joinDate)}</span>
                           </div>
                       </div>
                       <div class="action-buttons">
                           <button class="action-btn edit-btn" onclick="editCustomer(${customer.id})">
                               <i class="fas fa-edit"></i>
                               Edit
                           </button>
                           <button class="action-btn delete-btn" onclick="deleteCustomer(${customer.id})">
                               <i class="fas fa-trash"></i>
                               Delete
                           </button>
                       </div>
                   </div>
               </div>
           `).join('');
       }

       // Helper function to format dates
       function formatDate(dateString) {
           return new Date(dateString).toLocaleDateString('en-US', {
               year: 'numeric',
               month: 'short',
               day: 'numeric'
           });
       }

       // Initialize
       document.addEventListener('DOMContentLoaded', function() {
           createRain();
           loadCustomers();
       });