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

$delete = $conn->prepare("
    DELETE FROM thesis_favorite 
    WHERE thesis_id = :thesis_id 
    AND school_id = :school_id
");
$delete->execute(['thesis_id' => $thesis_id, 'school_id' => $school_id]);

if ($delete->rowCount() > 0) {
    echo json_encode(['success' => true, 'message' => 'Removed from favorites']);
} else {
    echo json_encode(['success' => false, 'message' => 'Favorite not found']);
}
?>
