// Order specific functions
function loadOrders() {
    // Implementation for loading orders
    console.log('Loading orders...');
}

function exportOrders() {
    // Implementation for exporting orders
    console.log('Exporting orders...');
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

// Replace the PDF generation with HTML invoice
function printInvoice(orderData) {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Please allow popups for this website');
        return;
    }

    // Wait for window to load before writing content
    setTimeout(() => {
                printWindow.document.write(`
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <title>Order Invoice #${orderData.orderId}</title>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
                        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                        <style>
                            @media print {
                                .no-print { display: none; }
                                body { font-size: 12px; }
                            }
                            .invoice-header {
                                border-bottom: 2px solid #dee2e6;
                                padding-bottom: 20px;
                                margin-bottom: 30px;
                            }
                            .invoice-title {
                                color: #4e73df;
                                font-size: 28px;
                                font-weight: bold;
                            }
                            .company-details {
                                text-align: right;
                            }
                            .order-info {
                                background: #f8f9fc;
                                padding: 15px;
                                border-radius: 5px;
                                margin-bottom: 20px;
                            }
                            .customer-details, .shipping-details {
                                margin-bottom: 20px;
                            }
                            .table th {
                                background-color: #4e73df;
                                color: white;
                            }
                            .total-section {
                                border-top: 2px solid #dee2e6;
                                margin-top: 20px;
                                padding-top: 20px;
                            }
                            .footer {
                                margin-top: 50px;
                                padding-top: 20px;
                                border-top: 1px solid #dee2e6;
                                font-size: 0.9em;
                                color: #666;
                            }
                        </style>
                    </head>
                    <body class="p-4">
                        <div class="container">
                            <!-- Invoice Header -->
                            <div class="invoice-header row">
                                <div class="col-6">
                                    <div class="invoice-title">INVOICE</div>
                                    <div>Order #${orderData.orderId}</div>
                                </div>
                                <div class="col-6 company-details">
                                    <h4>Electro Tinejdad</h4>
                                    <p class="mb-0">Maknes,maknes-fes/</p>
                                    <p class="mb-0">Morocco</p>
                                    <p class="mb-0">Phone: +212 76749 5006</p>
                                    <p>Email: abdollahbagueri02@gmail.com</p>
                                </div>
                            </div>

                            <!-- Order Info -->
                            <div class="row">
                                <div class="col-md-6 customer-details">
                                    <h5>Bill To:</h5>
                                    <p class="mb-1"><strong>${orderData.customerName}</strong></p>
                                    <p class="mb-1">${orderData.shippingAddress}</p>
                                    <p class="mb-1">New York, NY</p>
                                    <p class="mb-1">Phone: +1 234-567-8900</p>
                                    <p>Email: ${orderData.customerEmail}</p>
                                </div>
                                <div class="col-md-6 order-info">
                                    <div class="row">
                                        <div class="col-6"><strong>Invoice Date:</strong></div>
                                        <div class="col-6">${orderData.date}</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6"><strong>Order Status:</strong></div>
                                        <div class="col-6">${orderData.status}</div>
                                    </div>
                                    <div class="row">
                                        <div class="col-6"><strong>Payment Method:</strong></div>
                                        <div class="col-6">Cash on delivery</div>
                                    </div>
                                </div>
                            </div>

                            <!-- Order Items -->
                            <table class="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>Item Description</th>
                                        <th class="text-center">Quantity</th>
                                        <th class="text-end">Unit Price</th>
                                        <th class="text-end">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${orderData.items.map(item => `
                                        <tr>
                                            <td>${item.name}</td>
                                            <td class="text-center">${item.quantity}</td>
                                            <td class="text-end">${item.price.toFixed(2)} MAD</td>
                                            <td class="text-end">${(item.quantity * item.price).toFixed(2)} MAD</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="2"></td>
                                        <td class="text-end"><strong>Subtotal:</strong></td>
                                        <td class="text-end">${orderData.subtotal.toFixed(2)} MAD</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2"></td>
                                        <td class="text-end"><strong>Tax (0%):</strong></td>
                                        <td class="text-end">0.00 MAD</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2"></td>
                                        <td class="text-end"><strong>Total:</strong></td>
                                        <td class="text-end"><strong>${orderData.total.toFixed(2)} MAD</strong></td>
                                    </tr>
                                </tfoot>
                            </table>

                            <!-- Footer -->
                            <div class="footer">
                                <div class="row">
                                    <div class="col-8">
                                        <p class="mb-0"><strong>Terms & Conditions</strong></p>
                                        <p class="mb-0">Ila 3ndk atakl ma3ndkch maghataklch</p>
                                        <p>tanmirt nk bahra</p>
                                    </div>
                                    <div class="col-4 text-end">
                                        <button class="btn btn-primary no-print" onclick="window.print()">
                                            <i class="fas fa-print"></i> Print Invoice
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </body>
                    </html>
                `);

                // Ensure resources are loaded before showing print dialog
                printWindow.document.close();
                printWindow.onload = function() {
                    // Add a slight delay to ensure styles are applied
                    setTimeout(() => {
                        printWindow.focus();
                        printWindow.print();
                    }, 250);
                };
            }, 100);
        }

        // Update click handler for print invoice button
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelector('.print-invoice-btn').addEventListener('click', function(e) {
                e.preventDefault();
                const orderData = {
                    orderId: 'ORD-2023-1234',
                    date: 'July 15, 2023 - 14:30',
                    status: 'Processing',
                    customerName: 'John Doe',
                    customerEmail: 'john.doe@example.com',
                    shippingAddress: '123 Main St, New York, NY 10001',
                    items: [{
                        name: 'ASUS ROG Strix G15',
                        quantity: 1,
                        price: 1499.99
                    }],
                    subtotal: 1499.99,
                    tax: 0,
                    total: 1499.99
                };

                printInvoice(orderData);
            });

            // Initialize
            document.addEventListener('DOMContentLoaded', function() {
                createRain();
                loadOrders();

                // Set active state for both sidebar and mobile nav
                const currentPage = window.location.pathname.split('/').pop() || 'Dashboard.html';
                document.querySelectorAll('.nav-link, .mobile-nav-item').forEach(item => {
                    if (item.getAttribute('href') === currentPage) {
                        item.classList.add('active');
                    }
                });
            });
        });