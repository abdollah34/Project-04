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
    
    $stmt = $conn->prepare("SELECT p.*, GROUP_CONCAT(pi.image_url) as images 
                           FROM products p 
                           LEFT JOIN product_images pi ON p.id = pi.product_id 
                           WHERE p.id = ?
                           GROUP BY p.id");
    
    $stmt->bind_param("i", $productId);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows === 0) {
        throw new Exception('Product not found');
    }

    $product = $result->fetch_assoc();
    
    // Parse specs JSON
    if ($product['specs']) {
        $product['specs'] = json_decode($product['specs'], true) ?? new stdClass();
    }
    
    // Parse images
    if ($product['images']) {
        $product['images'] = explode(',', $product['images']);
    } else {
        $product['images'] = [];
    }

    echo json_encode([
        'success' => true,
        'data' => $product
    ]);

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
