<?php
header('Content-Type: application/json');
require_once __DIR__ . '/../../config/connection.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['school_id'])) {
    echo json_encode(['success' => false, 'message' => 'No school_id provided']);
    exit;
}

$school_id = $input['school_id'];

try {
    $stmt = $conn->prepare("DELETE FROM account_table WHERE school_id = :school_id");
    $stmt->bindParam(':school_id', $school_id);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        echo json_encode(['success' => true, 'message' => 'Account deleted successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'No account found with that school_id']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>