<?php
require_once __DIR__ . '/../../config/my_cookies.php';
header("Content-Type: application/json");

// Only expose what's safe for the frontend
$response = [
    "school_id" => getMyCookie("school_id"),
    "first_name" => getMyCookie("first_name")
];

echo json_encode($response);
?>