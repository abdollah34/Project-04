
<?php
require_once 'db_connection.php';

try {
    // Test customers table
    $result = $pdo->query("SHOW TABLES");
    echo "<h2>Available Tables:</h2>";
    while ($row = $result->fetch()) {
        echo $row[0] . "<br>";
    }

    // Test table structure
    $tables = ['customers', 'addresses', 'orders', 'order_items'];
    foreach ($tables as $table) {
        echo "<h3>Structure of $table table:</h3>";
        $result = $pdo->query("DESCRIBE $table");
        echo "<pre>";
        print_r($result->fetchAll());
        echo "</pre>";
    }
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>