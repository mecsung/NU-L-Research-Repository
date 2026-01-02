<?php
header("Content-Type: application/json");
require_once __DIR__ . '/../../config/connection.php';

// Assume $searchTerm comes from a GET or POST parameter
$searchTerm = isset($_GET['search']) ? $_GET['search'] : '';
$role = isset($_GET['role']) ? $_GET['role'] : '';
$searchPattern = "%{$searchTerm}%";

// Prepare the query using placeholders to prevent SQL injection
$query = "
    SELECT ac.school_id, ac.first_name, ac.last_name, ac.school_email, p.program_name, ac.role
    FROM account_table ac
    JOIN programs p ON ac.program_id = p.program_id
    WHERE (ac.first_name LIKE :search
       OR ac.last_name LIKE :search
       OR ac.school_email LIKE :search
       OR p.program_name LIKE :search
       OR ac.school_id LIKE :search)
    AND ac.role = :role
";


// Prepare and execute
$stmt = $conn->prepare($query);
$stmt->bindParam(':search', $searchPattern, PDO::PARAM_STR);
$stmt->bindParam(':role', $role, PDO::PARAM_STR);
$stmt->execute();

// Fetch results
$accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return JSON
echo json_encode([
    "accounts" => $accounts
], JSON_PRETTY_PRINT);
?>