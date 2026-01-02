<?php

require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

$allowed_columns = ['first_name', 'program_name'];
$allowed_sorts = ['asc', 'desc'];

$role = $_GET['role'] ?? "";
$column = $_GET['column'] ?? false;
$sort = isset($_GET['sort']) ? strtolower($_GET['sort']) : false;

// Default ORDER BY
$orderBy = "first_name ASC";

if ($column && in_array($column, $allowed_columns)) {

    // Default sort is ASC if not provided
    if (!$sort || !in_array($sort, $allowed_sorts)) {
        $sort = "asc";
    }

    $orderBy = "$column $sort";
}



// Define the query
$query = "
SELECT school_id, first_name, last_name, school_email, program_name, role 
FROM account_table ac
JOIN programs p ON ac.program_id = p.program_id
WHERE role = :role
ORDER BY $orderBy
";


// Execute the query
$stmt = $conn->prepare($query);
$stmt->bindParam(':role', $role, PDO::PARAM_STR);
$stmt->execute();


// Fetch all results
$accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Return JSON
echo json_encode(
    [
        "success" => true,
        "accounts" => $accounts
    ],
    JSON_PRETTY_PRINT
);
