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


        // Logout function
        function logout() {
            sessionStorage.removeItem('isLoggedIn');
            window.location.href = 'login.html';
        }

        // Initialize dashboard
        document.addEventListener('DOMContentLoaded', function() {
            checkAuth();
            createRain();
            loadRecentOrders();
        });

        // Load recent orders
        function loadRecentOrders() {
            // Sample data - replace with actual API call
            const orders = [{
                    id: '1',
                    customer: 'John Doe',
                    product: 'Gaming Mouse',
                    amount: '899.99 MAD',
                    status: 'completed',
                    date: '2024-01-15'
                }, {
                    id: '2',
                    customer: 'Jane Smith',
                    product: 'Mechanical Keyboard',
                    amount: '1,599.99 MAD',
                    status: 'pending',
                    date: '2024-01-14'
                },
                // Add more orders as needed
            ];

            // Update table view
            const ordersTable = document.getElementById('ordersTable');
            ordersTable.innerHTML = orders.map(order => `
                <tr>
                    <td>#${order.id}</td>
                    <td>${order.customer}</td>
                    <td>${order.product}</td>
                    <td>${order.amount}</td>
                    <td><span class="status-badge status-${order.status}">${order.status}</span></td>
                </tr>
            `).join('');

            // Update mobile cards view
            const ordersGrid = document.getElementById('ordersGrid');
            ordersGrid.innerHTML = orders.map(order => `
                <div class="orders-card">
                    <div class="order-detail">
                        <span class="order-detail-label">Order ID</span>
                        <span class="order-detail-value">#${order.id}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Customer</span>
                        <span class="order-detail-value">${order.customer}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Product</span>
                        <span class="order-detail-value">${order.product}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Amount</span>
                        <span class="order-detail-value">${order.amount}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Date</span>
                        <span class="order-detail-value">${new Date(order.date).toLocaleDateString()}</span>
                    </div>
                    <div class="order-detail">
                        <span class="order-detail-label">Status</span>
                        <span class="status-badge status-${order.status}">${order.status}</span>
                    </div>
                </div>
            `).join('');
        }

        // Add to existing JavaScript
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

        // Add active state handler
        document.addEventListener('DOMContentLoaded', function() {
            const currentPage = window.location.pathname.split('/').pop() || 'Dashboard.html';
            document.querySelectorAll('.mobile-nav-item').forEach(item => {
                if (item.getAttribute('href') === currentPage) {
                    item.classList.add('active');
                }
            });
        });

        // Add touch scroll handling
        document.addEventListener('DOMContentLoaded', function() {
            const slider = document.querySelector('.orders-slider');
            let isDown = false;
            let startX;
            let scrollLeft;

            slider.addEventListener('mousedown', (e) => {
                isDown = true;
                slider.style.cursor = 'grabbing';
                startX = e.pageX - slider.offsetLeft;
                scrollLeft = slider.scrollLeft;
            });

            slider.addEventListener('mouseleave', () => {
                isDown = false;
                slider.style.cursor = 'grab';
            });

            slider.addEventListener('mouseup', () => {
                isDown = false;
                slider.style.cursor = 'grab';
            });

            slider.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - slider.offsetLeft;
                const walk = (x - startX) * 2;
                slider.scrollLeft = scrollLeft - walk;
            });
        });