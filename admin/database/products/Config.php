<?php
$servername = "localhost";
$username = "u862171013_prod";  // Replace with your database username
$password = "UcooW[j9";      // Replace with your database password
$dbname = "u862171013_product";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Set charset to utf8mb4
$conn->set_charset("utf8mb4");
?>
