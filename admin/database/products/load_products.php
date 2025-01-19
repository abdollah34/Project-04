<?php
require_once '../DatabaseConfig.php';

header('Content-Type: application/json');

try {
    $db = DatabaseConfig::getInstance();
    $query = "SELECT p.*, 
              GROUP_CONCAT(pi.image_url) as images,
              (SELECT COUNT(*) FROM orders_products op WHERE op.product_id = p.id) as sales
              FROM products p
              LEFT JOIN product_images pi ON p.id = pi.product_id
              GROUP BY p.id";
    
    $stmt = $db->query($query);
    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'success' => true,
        'data' => $products
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
