<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Ensure no output before headers
ob_start();

// Set JSON headers
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

try {
    // Check if the request is POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        throw new Exception('Invalid request method');
    }

    // Include database configuration - Fix path
    require_once __DIR__ . '/Config.php';

    // Log incoming data for debugging
    error_log("POST data: " . print_r($_POST, true));
    error_log("FILES data: " . print_r($_FILES, true));

    // Basic input validation
    if (empty($_POST['name']) || empty($_POST['category'])) {
        throw new Exception('Required fields are missing');
    }

    // Sanitize inputs
    $name = strip_tags(trim($_POST['name']));
    $category = strip_tags(trim($_POST['category']));
    $price = floatval($_POST['price']);
    $stock = intval($_POST['stock']);
    $description = strip_tags(trim($_POST['description'] ?? ''));

    // Validate numeric values
    if ($price <= 0 || $stock < 0) {
        throw new Exception('Invalid price or stock value');
    }

    // Database insertion
    $stmt = $conn->prepare("INSERT INTO products (name, category, price, stock, description) VALUES (?, ?, ?, ?, ?)");
    if (!$stmt) {
        throw new Exception($conn->error);
    }

    $stmt->bind_param("ssdis", $name, $category, $price, $stock, $description);
    
    if (!$stmt->execute()) {
        throw new Exception($stmt->error);
    }

    $product_id = $conn->insert_id;
    
    // Handle image uploads
    if (isset($_FILES['images']) && is_array($_FILES['images']['tmp_name'])) {
        $uploadDir = __DIR__ . '/../../uploads/products/';
        if (!file_exists($uploadDir)) {
            if (!mkdir($uploadDir, 0777, true)) {
                throw new Exception("Failed to create upload directory");
            }
        }

        foreach ($_FILES['images']['tmp_name'] as $key => $tmp_name) {
            if (!empty($tmp_name) && is_uploaded_file($tmp_name)) {
                $fileName = time() . '_' . basename($_FILES['images']['name'][$key]);
                $filePath = $uploadDir . $fileName;
                
                if (!move_uploaded_file($tmp_name, $filePath)) {
                    throw new Exception("Failed to upload file: " . $_FILES['images']['name'][$key]);
                }

                $imageUrl = '/admin/uploads/products/' . $fileName;
                $imgStmt = $conn->prepare("INSERT INTO product_images (product_id, image_url, is_primary) VALUES (?, ?, ?)");
                if (!$imgStmt) {
                    throw new Exception("Image insert preparation failed: " . $conn->error);
                }

                $isPrimary = ($key === 0) ? 1 : 0;
                $imgStmt->bind_param("isi", $product_id, $imageUrl, $isPrimary);
                if (!$imgStmt->execute()) {
                    throw new Exception("Image insert failed: " . $imgStmt->error);
                }
            }
        }
    }
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Product added successfully',
        'id' => $product_id
    ]);

} catch (Exception $e) {
    // Log the error
    error_log("Error in add_product.php: " . $e->getMessage());
    
    // Error response
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage(),
        'debug' => error_get_last()
    ]);
}

// Clean any output buffers
while (ob_get_level() > 0) {
    ob_end_flush();
}

// Close database connection
if (isset($conn)) {
    $conn->close();
}
?>
