<?php
// Enable error reporting but prevent display
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Start output buffering to prevent unwanted output
ob_start();

try {
    require_once '../../admin/database/products/Config.php';

    if (!$conn) {
        throw new Exception("Database connection failed");
    }

    $query = "SELECT p.*, GROUP_CONCAT(pi.image_url) as images 
              FROM products p 
              LEFT JOIN product_images pi ON p.id = pi.product_id 
              GROUP BY p.id";
    
    $result = $conn->query($query);
    
    if (!$result) {
        throw new Exception($conn->error);
    }

    $products = array();
    while ($row = $result->fetch_assoc()) {
        $product = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'price' => floatval($row['price']),
            'description' => $row['description'],
            'category' => $row['category'],
            'stock' => intval($row['stock']),
            'specs' => json_decode($row['specs']),
            'images' => $row['images'] ? explode(',', $row['images']) : []
        );
        $products[] = $product;
    }

    // Clean any previous output
    ob_clean();
    
    echo json_encode([
        'success' => true, 
        'products' => $products
    ]);

} catch (Exception $e) {
    // Log error for debugging
    error_log("API Error: " . $e->getMessage());
    
    // Clean any previous output
    ob_clean();
    
    // Send error response
    echo json_encode([
        'success' => false,
        'message' => "Failed to load products: " . $e->getMessage()
    ]);
}

// Close database connection if it exists
if (isset($conn)) {
    $conn->close();
}

// End output buffer
ob_end_flush();
?>
