<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

try {
    // Get POST data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        throw new Exception('No data received');
    }

    // Create a new PHPMailer instance
    $mail = new PHPMailer(true);

    // Server settings
    $mail->isSMTP();
    $mail->Host = 'smtp.hostinger.com';  // Hostinger SMTP server
    $mail->SMTPAuth = true;
    $mail->Username = 'contact@pixelfga.com';
    $mail->Password = 'Sky!23Blue';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = 587;

    // Recipients
    $mail->setFrom('contact@pixelfga.com', 'Electro Tinejdad');
    $mail->addAddress('abdollahbagueri02@gmail.com', 'Admin');

    // Format order items
    $orderItems = '';
    foreach ($data['items'] as $item) {
        $orderItems .= "- {$item['name']} (x{$item['quantity']}) - {$item['price']} MAD\n";
    }

    // Email content
    $mail->isHTML(true);
    $mail->Subject = 'New Order from Electro Tinejdad';
    $mail->Body = "
        <h2>New Order Details</h2>
        <p><strong>Customer Information:</strong></p>
        <ul>
            <li>Name: {$data['fullName']}</li>
            <li>Phone: {$data['phone']}</li>
            <li>Alternative Phone: {$data['altPhone']}</li>
        </ul>

        <p><strong>Delivery Information:</strong></p>
        <ul>
            <li>City: {$data['city']}</li>
            <li>District: {$data['district']}</li>
            <li>Address: {$data['address']}</li>
        </ul>

        <p><strong>Order Summary:</strong></p>
        <pre>{$orderItems}</pre>

        <p><strong>Total Amount:</strong> {$data['total']} MAD</p>
        <p><strong>Shipping Fee:</strong> {$data['shipping']} MAD</p>
        <p><strong>Grand Total:</strong> {$data['grandTotal']} MAD</p>
    ";

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Order placed successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => "Error: {$e->getMessage()}"]);
}
