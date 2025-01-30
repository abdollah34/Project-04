<?php
require_once 'db_connection.php';
try {
    $stmt = $pdo->query("SELECT 1");
    echo "Database connection successful!";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
