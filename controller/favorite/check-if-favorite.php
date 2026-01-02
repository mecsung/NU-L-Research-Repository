<?php
require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

$school_id = $_GET['school_id'] ?? null;
$thesis_id = $_GET['thesis_id'] ?? null;

if (!$school_id || !$thesis_id) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing required parameters: school_id and thesis_id'
    ]);
    exit;
}

// Check if the thesis is in favorites
$stmt = $conn->prepare("
    SELECT EXISTS(
        SELECT 1 
        FROM thesis_favorite 
        WHERE school_id = :school_id AND thesis_id = :thesis_id
    ) AS is_favorite
");
$stmt->execute(['school_id' => $school_id, 'thesis_id' => $thesis_id]);
$result = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode([
    'success' => true,
    'is_favorite' => $result && $result['is_favorite'] == 1
], JSON_PRETTY_PRINT);
?>
