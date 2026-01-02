<?php
require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$school_id = $input['school_id'] ?? null;

if (!$school_id) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required parameter: school_id'
    ]);
    exit;
}

$stmt = $conn->prepare("SELECT role FROM account_table WHERE school_id = :school_id");
$stmt->execute(['school_id' => $school_id]);
$role = $stmt->fetchColumn();

if (!$role) {
    echo json_encode([
        'success' => false,
        'message' => 'School ID not found'
    ]);
    exit;
}

echo json_encode([
    'success' => true,
    'role' => $role
], JSON_PRETTY_PRINT);
?>