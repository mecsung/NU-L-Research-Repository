<?php
require_once __DIR__ . '/../config/connection.php';
header('Content-Type: application/json');

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'POST':
            // --- Add or update rating ---
            $input = json_decode(file_get_contents('php://input'), true);
            $thesis_id = isset($input['thesis_id']) ? (int) $input['thesis_id'] : 0;
            $school_id = isset($input['school_id']) ? trim($input['school_id']) : '';
            $rating_value = isset($input['rating_value']) ? (int) $input['rating_value'] : 0;

            if (!$thesis_id || !$school_id || !$rating_value) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing or invalid fields']);
                exit;
            }

            // Ensure account exists (prevents FK error)
            $checkAccount = $conn->prepare("SELECT COUNT(*) FROM accounts WHERE school_id = ?");
            $checkAccount->execute([$school_id]);
            if ($checkAccount->fetchColumn() == 0) {
                http_response_code(404);
                echo json_encode(['error' => 'Account not found for this school_id']);
                exit;
            }

            // Check if rating exists
            $stmt = $conn->prepare("SELECT rating_id FROM thesis_ratings WHERE thesis_id = ? AND school_id = ?");
            $stmt->execute([$thesis_id, $school_id]);
            $existing = $stmt->fetchColumn();

            if ($existing) {
                // Update existing rating
                $update = $conn->prepare("UPDATE thesis_ratings 
                                         SET rating_value = ?, rated_at = NOW() 
                                         WHERE rating_id = ?");
                $update->execute([$rating_value, $existing]);
                echo json_encode(['message' => 'Rating updated']);
            } else {
                // Insert new rating
                $insert = $conn->prepare("INSERT INTO thesis_ratings (thesis_id, school_id, rating_value) 
                                         VALUES (?, ?, ?)");
                $insert->execute([$thesis_id, $school_id, $rating_value]);
                echo json_encode(['message' => 'Rating added']);
            }
            break;

        case 'DELETE':
            // --- Delete rating ---
            $input = json_decode(file_get_contents('php://input'), true);
            $thesis_id = isset($input['thesis_id']) ? (int) $input['thesis_id'] : 0;
            $school_id = isset($input['school_id']) ? trim($input['school_id']) : '';

            if (!$thesis_id || !$school_id) {
                http_response_code(400);
                echo json_encode(['error' => 'Missing fields']);
                exit;
            }

            $del = $conn->prepare("DELETE FROM thesis_ratings WHERE thesis_id = ? AND school_id = ?");
            $del->execute([$thesis_id, $school_id]);
            echo json_encode(['message' => 'Rating deleted']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['error' => 'Invalid request method']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>