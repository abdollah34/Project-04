<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once 'db_connection.php';

try {
    // Log the raw request
    $rawData = file_get_contents('php://input');
    error_log("Raw request data: " . $rawData);
    
    // Decode JSON data
    $data = json_decode($rawData, true);
    
    if (!$data) {
        throw new Exception('Invalid JSON data received: ' . json_last_error_msg());
    }

    $pdo->beginTransaction();

    // Debug logs
    error_log("Starting transaction");
    error_log("Customer data: " . print_r($data['customer'], true));
    error_log("Delivery data: " . print_r($data['delivery'], true));
    error_log("Cart data: " . print_r($data['cart'], true));
    
    // Insert customer data
    $stmt = $pdo->prepare("INSERT INTO customers (full_name, phone, alt_phone) VALUES (?, ?, ?)");
    $stmt->execute([
        $data['customer']['fullName'],
        $data['customer']['phone'],
        $data['customer']['altPhone'] ?? null
    ]);
    $customerId = $pdo->lastInsertId();
    error_log("Customer created with ID: " . $customerId);

    // Insert address
    $stmt = $pdo->prepare("INSERT INTO addresses (customer_id, city, district, detailed_address) VALUES (?, ?, ?, ?)");
    $stmt->execute([
        $customerId,
        $data['delivery']['city'],
        $data['delivery']['district'],
        $data['delivery']['address']
    ]);
    error_log("Address saved for customer: " . $customerId);

    // Insert order
    $stmt = $pdo->prepare("INSERT INTO orders (customer_id, total_amount, status) VALUES (?, ?, 'pending')");
    $stmt->execute([
        $customerId,
        $data['total']
    ]);
    $orderId = $pdo->lastInsertId();
    error_log("Order created with ID: " . $orderId);

    // Insert order items
    $stmt = $pdo->prepare("INSERT INTO order_items (order_id, product_id, product_name, price, quantity) VALUES (?, ?, ?, ?, ?)");
    foreach ($data['cart'] as $item) {
        $stmt->execute([
            $orderId,
            $item['id'],
            $item['name'],
            $item['price'],
            1  // Since the cart structure keeps multiple entries for quantity
        ]);
        error_log("Added item to order: " . $item['name']);
    }

    $pdo->commit();
    error_log("Transaction committed successfully");
    
    echo json_encode([
        'success' => true,
        'message' => 'Order saved successfully',
        'orderId' => $orderId
    ]);

} catch (Exception $e) {
    error_log("Error in save_order.php: " . $e->getMessage());
    if ($pdo && $pdo->inTransaction()) {
        $pdo->rollBack();
        error_log("Transaction rolled back");
    }
    echo json_encode([
        'success' => false,
        'message' => 'Error saving order: ' . $e->getMessage()
    ]);
}
?>
