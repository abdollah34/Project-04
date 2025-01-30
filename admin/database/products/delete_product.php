<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: application/json');

try {
    require_once __DIR__ . '/Config.php';

    // Validate input
    if (!isset($_POST['id']) || !is_numeric($_POST['id'])) {
        throw new Exception('Invalid product ID');
    }

    $productId = intval($_POST['id']);

    // Start transaction
    $conn->begin_transaction();

    try {
        // Delete images first (both files and database records)
        $stmt = $conn->prepare("SELECT image_url FROM product_images WHERE product_id = ?");
        $stmt->bind_param("i", $productId);
        $stmt->execute();
        $result = $stmt->get_result();
        
        while ($row = $result->fetch_assoc()) {
            $imagePath = __DIR__ . '/../../uploads/products/' . basename($row['image_url']);
            if (file_exists($imagePath)) {
                unlink($imagePath);
            }
        }

        // Delete image records
        $stmt = $conn->prepare("DELETE FROM product_images WHERE product_id = ?");
        $stmt->bind_param("i", $productId);
        $stmt->execute();

        // Delete product
        $stmt = $conn->prepare("DELETE FROM products WHERE id = ?");
        $stmt->bind_param("i", $productId);
        $stmt->execute();

        if ($stmt->affected_rows === 0) {
            throw new Exception('Product not found');
        }

        $conn->commit();
        
        echo json_encode([
            'success' => true,
            'message' => 'Product deleted successfully'
        ]);

    } catch (Exception $e) {
        $conn->rollback();
        throw $e;
    }

} catch (Exception $e) {
    error_log("Error deleting product: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}

if (isset($conn)) {
    $conn->close();
}
