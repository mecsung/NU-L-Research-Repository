<?php
require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

/* Allowed sorting */
$allowed_columns = ['first_name', 'program_name'];
$allowed_sorts = ['asc', 'desc'];

$column = $_GET['column'] ?? 'first_name';
$sort = strtolower($_GET['sort'] ?? 'asc');
$search = trim($_GET['search'] ?? '');

/* Validate ORDER BY */
if (!in_array($column, $allowed_columns, true)) {
    $column = 'first_name';
}
if (!in_array($sort, $allowed_sorts, true)) {
    $sort = 'asc';
}

$orderBy = "$column $sort";

/* Base query */
$query = "
SELECT
    ac.school_id,
    s.first_name,
    s.last_name,
    ac.school_email,
    p.program_name,
    ac.role
FROM accounts ac
JOIN students s ON ac.account_id = s.account_id
JOIN programs p ON s.program_id = p.program_id
WHERE ac.role = 'student'
";

/* Optional search */
$params = [];

if ($search !== '') {
    $query .= "
    AND (
        ac.school_id LIKE :search
        OR s.first_name LIKE :search
        OR s.last_name LIKE :search
        OR ac.school_email LIKE :search
        OR p.program_name LIKE :search
    )
    ";
    $params[':search'] = "%{$search}%";
}

/* ORDER BY */
$query .= " ORDER BY $orderBy";

$stmt = $conn->prepare($query);
$stmt->execute($params);

$accounts = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'accounts' => $accounts
], JSON_PRETTY_PRINT);
