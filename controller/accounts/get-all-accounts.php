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
SELECT
    ac.school_id,
    COALESCE(s.first_name, f.first_name) AS first_name,
    COALESCE(s.last_name,  f.last_name)  AS last_name,
    ac.school_email,
    p.program_name,
    f.position,
    ac.role
FROM accounts ac
LEFT JOIN students s ON ac.account_id = s.account_id
LEFT JOIN faculty  f ON ac.account_id = f.account_id
LEFT JOIN programs p ON s.program_id = p.program_id
WHERE ac.role = :role
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
