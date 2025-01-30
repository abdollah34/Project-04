<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/Config.php';

    if (!isset($_POST['id']) || !is_numeric($_POST['id'])) {
        throw new Exception('Invalid product ID');
    }

    $productId = intval($_POST['id']);
    
    $stmt = $conn->prepare("UPDATE products SET 
        name = ?,
        category = ?,
        price = ?,
        stock = ?,
        description = ?,
        specs = ?
        WHERE id = ?");

    $name = strip_tags($_POST['name']);
    $category = strip_tags($_POST['category']);
    $price = floatval($_POST['price']);
    $stock = intval($_POST['stock']);
    $description = strip_tags($_POST['description']);
    $specs = $_POST['specs'];

    $stmt->bind_param('ssddssr', 
        $name, 
        $category, 
        $price, 
        $stock, 
        $description,
        $specs,
        $productId
    );

    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Product updated successfully'
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

if (isset($conn)) {
    $conn->close();
}
