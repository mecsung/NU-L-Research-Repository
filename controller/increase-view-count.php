<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../config/connection.php';

try {
    // Decode the JSON input
    $input = json_decode(file_get_contents('php://input'), true);

    if ($input === null && json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception("Invalid JSON input");
    }

    // Validate required fields
    if (empty($input['thesis_id'])) {
        throw new Exception("thesis_id is required");
    }

    if (empty($input['school_id'])) {
        throw new Exception("school_id is required");
    }

    $thesis_id = intval($input['thesis_id']);
    $school_id = trim($input['school_id']);

    $stmt = $conn->prepare("
        INSERT INTO thesis_view_logs (thesis_id, school_id)
        VALUES (?, ?)
    ");
    $stmt->execute([$thesis_id, $school_id]);

    echo json_encode([
        'success' => true,
        'message' => 'View recorded successfully'
    ]);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
