<?php
require_once __DIR__ . '/../../config/connection.php';
header('Content-Type: application/json');

try {
    $input = json_decode(file_get_contents('php://input'), true);
    $thesis_id = intval($input['thesis_id'] ?? 0);

    if (!$thesis_id) {
        http_response_code(400); // ← Bad Request
        echo json_encode(["success" => false, "error" => "Invalid thesis ID"]);
        exit;
    }

    // 1️⃣ Delete from link tables first
    $tables = ['thesis_authors', 'thesis_keyword', 'thesis_refer', 'thesis_types'];
    foreach ($tables as $table) {
        $stmt = $conn->prepare("DELETE FROM $table WHERE thesis_id = ?");
        $stmt->execute([$thesis_id]);
    }

    // 2️⃣ Delete the main thesis record
    $stmt = $conn->prepare("DELETE FROM thesis WHERE thesis_id = ?");
    $stmt->execute([$thesis_id]);

    // 3️⃣ Confirm deletion
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => true, "message" => "Thesis deleted successfully!"]);
    } else {
        http_response_code(404); // ← Not Found
        echo json_encode(["success" => false, "error" => "Thesis not found or already deleted"]);
    }
} catch (PDOException $e) {
    http_response_code(500); // ← Internal Server Error
    echo json_encode(["success" => false, "error" => $e->getMessage()]);
}
?>