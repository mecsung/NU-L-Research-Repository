<?php
require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

$input = json_decode(file_get_contents('php://input'), true);
$thesis_id = $input['thesis_id'] ?? null;
$school_id = $input['school_id'] ?? null;

if (!$thesis_id || !$school_id) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

// Check if already exists
$check = $conn->prepare("
    SELECT 1 
    FROM thesis_favorite 
    WHERE thesis_id = :thesis_id 
    AND school_id = :school_id
");
$check->execute(['thesis_id' => $thesis_id, 'school_id' => $school_id]);

if ($check->fetchColumn()) {
    echo json_encode(['success' => false, 'message' => 'Already in favorites']);
    exit;
}

// Insert
$insert = $conn->prepare("
    INSERT INTO thesis_favorite (school_id, thesis_id)
    VALUES (:school_id, :thesis_id)
");
$insert->execute(['school_id' => $school_id, 'thesis_id' => $thesis_id]);

echo json_encode(['success' => true, 'message' => 'Added to favorites']);
?>
