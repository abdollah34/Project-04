<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/Config.php';
    
    if (!isset($_GET['id'])) {
        throw new Exception('Product ID is required');
    }

    $productId = intval($_GET['id']);
    
    // Log the request
    error_log("Fetching product ID: " . $productId);
    
    $stmt = $conn->prepare("SELECT * FROM products WHERE id = ?");
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($product = $result->fetch_assoc()) {
        // Log the found product
        error_log("Found product: " . print_r($product, true));
        
        echo json_encode([
            'success' => true,
            'data' => $product
        ]);
    } else {
        throw new Exception('Product not found');
    }

} catch (Exception $e) {
    error_log("Error in get_product.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

if (isset($conn)) {
    $conn->close();
}
