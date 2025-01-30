<?php
require_once 'Config.php';

header('Content-Type: application/json');

try {
    $db = DatabaseConfig::getInstance();
    $db->beginTransaction();

    $data = [
        'name' => $_POST['name'],
        'category' => $_POST['category'],
        'price' => floatval($_POST['price']),
        'stock' => intval($_POST['stock']),
        'description' => $_POST['description'],
        'specs' => json_encode($_POST['specs'] ?? [])
    ];

    $sql = "INSERT INTO products (name, category, price, stock, description, specs) 
            VALUES (:name, :category, :price, :stock, :description, :specs)";
    
    $stmt = $db->prepare($sql);
    $stmt->execute($data);
    $productId = $db->lastInsertId();

    // Handle image uploads
    if (!empty($_FILES['images'])) {
        $uploadDir = '../../uploads/products/';
        foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
            $filename = uniqid() . '_' . $_FILES['images']['name'][$key];
            move_uploaded_file($tmp_name, $uploadDir . $filename);
            
            $stmt = $db->prepare("INSERT INTO product_images (product_id, image_url) VALUES (?, ?)");
            $stmt->execute([$productId, 'uploads/products/' . $filename]);
        }
    }

    $db->commit();
    echo json_encode(['success' => true, 'id' => $productId]);

} catch (Exception $e) {
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
