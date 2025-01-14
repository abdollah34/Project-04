document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    setupEventListeners();
    updateCartCount();
});

const moroccanCities = [
    'Agadir', 'Al Hoceima', 'Assilah', 'Azemmour', 'Azrou', 'Beni Mellal', 'Berkane', 'Berrechid',
    'Bouarfa', 'Casablanca', 'Chefchaouen', 'Dakhla', 'El Hajeb', 'El Jadida', 'Errachidia',
    'Essaouira', 'Fes', 'Figuig', 'Fnideq', 'Guelmim', 'Guercif', 'Ifrane', 'Inezgane',
    'Jerada', 'Kenitra', 'Khemisset', 'Khenifra', 'Khouribga', 'Laayoune', 'Larache',
    'Marrakech', 'Martil', 'M\'diq', 'Meknes', 'Midelt', 'Mohammedia', 'Nador', 'Ouarzazate',
    'Ouazzane', 'Oued Zem', 'Oujda', 'Rabat', 'Safi', 'Sale', 'Sefrou', 'Settat',
    'Sidi Bennour', 'Sidi Ifni', 'Sidi Kacem', 'Sidi Slimane', 'Skhirat', 'Tangier',
    'Tan-Tan', 'Taounate', 'Taroudant', 'Taza', 'Temara', 'Tetouan', 'Tiflet', 'Tinghir',
    'Tiznit', 'Youssoufia', 'Zagora'
].sort();

function setupEventListeners() {
    document.getElementById('continue-shopping').addEventListener('click', () => {
        window.location.href = 'products.html';
    });

    document.getElementById('checkout-btn').addEventListener('click', handleCheckout);
}

function loadCart() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart-items');
    updateCartCount();

    if (cartItems.length === 0) {
        showEmptyCart(cartContainer);
        return;
    }

    const groupedItems = groupCartItems(cartItems);
    displayCartItems(cartContainer, groupedItems);
    updateCartTotals(groupedItems);
    setupCartItemListeners();
}

function showEmptyCart(container) {
    container.innerHTML = `
        <div class="empty-cart">
            <i class="fas fa-shopping-basket"></i>
            <p>Your Shopping Cart is Empty</p>
            <p class="empty-cart-subtitle">Looks like you haven't added any items yet.</p>
            <button class="continue-shopping-btn" onclick="window.location.href='products.html'">
                <i class="fas fa-store"></i> Start Shopping
            </button>
        </div>
    `;
    updateCartTotals({});
}

function groupCartItems(cartItems) {
    return cartItems.reduce((acc, item) => {
        if (!acc[item.id]) {
            acc[item.id] = {
                ...item,
                quantity: 0,
                totalPrice: 0
            };
        }
        acc[item.id].quantity += 1;
        acc[item.id].totalPrice = acc[item.id].quantity * item.price;
        return acc;
    }, {});
}

function displayCartItems(container, groupedItems) {
    container.innerHTML = Object.values(groupedItems).map(item => `
        <div class="cart-item glass-card" data-id="${item.id}">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" loading="lazy">
            </div>
            <div class="cart-item-details">
                <h3>${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <div class="price-quantity-row">
                    <div class="quantity-controls">
                        <button class="quantity-btn minus" data-id="${item.id}">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <div class="price-info">
                        <span class="item-price">${item.price.toFixed(2)} MAD</span>
                        <span class="item-total">Total: ${item.totalPrice.toFixed(2)} MAD</span>
                    </div>
                </div>
            </div>
            <button class="remove-item" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function updateCartTotals(groupedItems) {
    const items = Object.values(groupedItems);
    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

    document.getElementById('subtotal').textContent = `${total.toFixed(2)} MAD`;
    document.getElementById('total').textContent = `${total.toFixed(2)} MAD`;

    // Update checkout button state
    const checkoutBtn = document.getElementById('checkout-btn');
    if (items.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('disabled');
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('disabled');
    }
}

function setupCartItemListeners() {
    // Quantity buttons
    document.querySelectorAll('.quantity-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(btn.dataset.id);
            const isIncrease = btn.classList.contains('plus');
            updateQuantity(itemId, isIncrease);
        });
    });

    // Remove buttons
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const itemId = parseInt(btn.dataset.id);
            removeItem(itemId);
        });
    });
}

function updateQuantity(itemId, isIncrease) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = [...cart];

    if (isIncrease) {
        // Add item
        const item = cart.find(item => item.id === itemId);
        if (item) updatedCart.push({...item });
    } else {
        // Remove one instance
        const index = updatedCart.findLastIndex(item => item.id === itemId);
        if (index !== -1) updatedCart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    showUpdateAnimation(itemId, isIncrease);
    loadCart();
}

function removeItem(itemId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item.id !== itemId);

    const itemElement = document.querySelector(`.cart-item[data-id="${itemId}"]`);
    itemElement.classList.add('removing');

    setTimeout(() => {
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        loadCart();
    }, 300);
}

function showUpdateAnimation(itemId, isIncrease) {
    const quantityDisplay = document.querySelector(`.cart-item[data-id="${itemId}"] .quantity-display`);
    quantityDisplay.classList.add(isIncrease ? 'increase' : 'decrease');
    setTimeout(() => quantityDisplay.classList.remove('increase', 'decrease'), 300);
}

function handleCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }

    const modal = document.createElement('div');
    modal.className = 'checkout-modal';

    const cityOptions = moroccanCities.map(city =>
        `<option value="${city.toLowerCase()}">${city}</option>`
    ).join('');

    modal.innerHTML = `
        <div class="checkout-content">
            <button class="close-checkout">&times;</button>
            <h2>Checkout</h2>
            <div class="payment-options">
                <div class="payment-option cod" onclick="selectPaymentMethod('cod')">
                    <i class="fas fa-truck"></i>
                    <h3>Cash on Delivery</h3>
                    <p>Pay when you receive your order</p>
                </div>
                <div class="payment-option paypal disabled" onclick="showComingSoon()">
                    <i class="fab fa-paypal"></i>
                    <h3>PayPal</h3>
                    <p>Coming Soon</p>
                    <span class="coming-soon-badge">Coming Soon</span>
                </div>
            </div>
            <form id="checkout-form" class="checkout-form" style="display: none;">
                <div class="form-section">
                    <h3>Personal Information</h3>
                    <div class="form-group">
                        <input type="text" name="fullName" placeholder="Full Name *" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="phone" placeholder="Phone Number *" required>
                    </div>
                    <div class="form-group">
                        <input type="tel" name="altPhone" placeholder="Alternative Phone">
                    </div>
                </div>

                <div class="form-section">
                    <h3>Delivery Information</h3>
                    <div class="form-group">
                        <select name="city" required>
                            <option value="">Select City *</option>
                            ${cityOptions}
                        </select>
                    </div>
                    <div class="form-group">
                        <input type="text" name="district" placeholder="District/Area *" required>
                    </div>
                    <div class="form-group">
                        <textarea name="address" placeholder="Detailed Address *" required></textarea>
                    </div>
                </div>

                <div class="order-summary">
                    <h3>Order Summary</h3>
                    <div class="summary-details">
                        <div class="summary-row">
                            <span>Items Total:</span>
                            <span>${calculateTotal(cart)} MAD</span>
                        </div>
                        <div class="summary-row">
                            <span>Delivery Fee:</span>
                            <span>30 MAD</span>
                        </div>
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>${calculateTotal(cart) + 30} MAD</span>
                        </div>
                    </div>
                </div>

                <div class="form-section agreement">
                    <label class="checkbox-container">
                        <input type="checkbox" required>
                        <span class="checkmark"></span>
                        I confirm that all the provided information is correct
                    </label>
                </div>

                <button type="submit" class="confirm-order-btn">
                    <i class="fas fa-check"></i> Confirm Order
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 100);

    // Setup event listeners
    setupCheckoutEvents(modal);
}

function setupCheckoutEvents(modal) {
    const closeBtn = modal.querySelector('.close-checkout');
    const form = modal.querySelector('#checkout-form');

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        processOrder(form);
    });
}

function selectPaymentMethod(method) {
    if (method === 'cod') {
        document.getElementById('checkout-form').style.display = 'block';
        document.querySelector('.payment-options').style.display = 'none';
    }
}

function showComingSoon() {
    showNotification('PayPal payment will be available soon!', 'info');
}

function processOrder(form) {
    const formData = new FormData(form);
    const orderData = {
        customer: {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            altPhone: formData.get('altPhone')
        },
        delivery: {
            city: formData.get('city'),
            district: formData.get('district'),
            address: formData.get('address')
        },
        cart: JSON.parse(localStorage.getItem('cart')),
        total: calculateTotal(JSON.parse(localStorage.getItem('cart'))) + 30
    };

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    submitButton.disabled = true;

    fetch('../DB/save_order.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear cart
                localStorage.setItem('cart', '[]');

                // Show success message
                showNotification(`Order #${data.orderId} placed successfully! We will contact you shortly.`, 'success');

                // Close modal and redirect after delay
                const modal = document.querySelector('.checkout-modal');
                modal.classList.remove('active');
                setTimeout(() => {
                    modal.remove();
                    window.location.href = 'products.html';
                }, 2000);
            } else {
                throw new Error(data.message);
            }
        })
        .catch(error => {
            showNotification('Error: ' + error.message, 'error');
            console.error('Error:', error);

            // Reset button state
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        });
}

function calculateTotal(cart) {
    return cart.reduce((sum, item) => sum + item.price, 0);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('show');
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }, 100);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.length;

    document.querySelectorAll('[data-count]').forEach(element => {
        element.setAttribute('data-count', count);
        // Add animation class if count changed
        element.classList.add('update');
        setTimeout(() => element.classList.remove('update'), 300);
    });
}