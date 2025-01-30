<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

require_once 'Config.php';

try {
    // Enable error reporting for debugging
    error_reporting(E_ALL);
    ini_set('display_errors', 1);

    $sql = "SELECT * FROM products ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    $products = array();
    
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $products[] = array(
                'id' => intval($row['id']),
                'name' => $row['name'],
                'description' => $row['description'],
                'price' => floatval($row['price']),
                'image' => $row['image'],
                'category' => $row['category'],
                'stock' => intval($row['stock']),
                'rating' => floatval($row['rating'])
            );
        }
    }
    
    echo json_encode($products);

} catch (Exception $e) {
    error_log($e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
?>
