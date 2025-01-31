<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/Config.php';
    
    // Log connection status
    error_log("Database connection established");
    
    $sql = "SELECT p.*, 
            COALESCE(GROUP_CONCAT(pi.image_url), '') as images,
            (SELECT image_url FROM product_images WHERE product_id = p.id AND is_primary = 1 LIMIT 1) as image_url
            FROM products p 
            LEFT JOIN product_images pi ON p.id = pi.product_id 
            GROUP BY p.id";
            
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $products = [];
    while ($row = $result->fetch_assoc()) {
        // Parse specs JSON
        if ($row['specs']) {
            $row['specs'] = json_decode($row['specs'], true) ?? new stdClass();
        } else {
            $row['specs'] = new stdClass();
        }
        $products[] = $row;
    }
    
    // Log product count and first product for debugging
    error_log("Found " . count($products) . " products");
    if (!empty($products)) {
        error_log("First product: " . print_r($products[0], true));
    }
    
    echo json_encode([
        'success' => true,
        'data' => $products
    ]);

} catch (Exception $e) {
    error_log("Error in load_products.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

if (isset($conn)) {
    $conn->close();
}
?>
