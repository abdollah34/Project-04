<?php
// Enable error reporting but prevent display
error_reporting(E_ALL);
ini_set('display_errors', 0);

// Set headers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

// Start output buffering to prevent unwanted output
ob_start();

try {
    require_once 'Config.php';

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
        // Improved specs handling
        $specs = null;
        if (!empty($row['specs'])) {
            $specs = json_decode($row['specs'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                // Valid JSON
                $specs = is_array($specs) ? $specs : [];
            } else {
                // Try to decode as string if it's a serialized array
                $specs = @unserialize($row['specs']);
                $specs = is_array($specs) ? $specs : [];
            }
        }

        $product = array(
            'id' => $row['id'],
            'name' => $row['name'],
            'price' => floatval($row['price']),
            'description' => $row['description'],
            'category' => $row['category'],
            'stock' => intval($row['stock']),
            'specs' => $specs, // Use the properly handled specs
            'images' => $row['images'] ? explode(',', $row['images']) : []
        );
        $products[] = $product;
    }

    ob_clean();
    echo json_encode([
        'success' => true, 
        'products' => $products
    ]);

} catch (Exception $e) {
    error_log("API Error: " . $e->getMessage());
    ob_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => "Failed to load products: " . $e->getMessage()
    ]);
}

if (isset($conn)) {
    $conn->close();
}

ob_end_flush();
?>
